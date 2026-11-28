const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.join(__dirname, 'src');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.tsx') && !full.endsWith(path.join('lib', 'i18n.tsx'))) files.push(full);
  }
}
walk(root);

function norm(value) { return value.replace(/\s+/g, ' ').trim().toLowerCase(); }
const translations = new Map();
const vocabulary = new Set();
const i18nPath = path.join(root, 'lib', 'i18n.tsx');
const i18nText = fs.readFileSync(i18nPath, 'utf8');
const i18n = ts.createSourceFile(i18nPath, i18nText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function addObject(node, target) {
  if (!node || !ts.isObjectLiteralExpression(node)) return;
  for (const p of node.properties) {
    if (!ts.isPropertyAssignment(p) || !ts.isStringLiteral(p.initializer)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : '';
    if (key) {
      if (target instanceof Set) target.add(norm(key));
      else target.set(norm(key), p.initializer.text);
    }
  }
}
function addTranslations(node) {
  if (node && ts.isAsExpression(node)) node = node.expression;
  if (!node || !ts.isObjectLiteralExpression(node)) return;
  for (const p of node.properties) {
    if (!ts.isPropertyAssignment(p) || !ts.isObjectLiteralExpression(p.initializer)) continue;
    let english = '';
    let urdu = '';
    for (const value of p.initializer.properties) {
      if (!ts.isPropertyAssignment(value) || !ts.isStringLiteral(value.initializer)) continue;
      const name = ts.isIdentifier(value.name) ? value.name.text : ts.isStringLiteral(value.name) ? value.name.text : '';
      if (name === 'en') english = value.initializer.text;
      if (name === 'ur') urdu = value.initializer.text;
    }
    if (english && urdu) translations.set(norm(english), urdu);
  }
}
function walkI18n(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'TRANSLATIONS') addTranslations(node.initializer);
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'ENGLISH_TO_URDU') addObject(node.initializer, translations);
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'assign' && ts.isIdentifier(node.arguments[0]) && node.arguments[0].text === 'ENGLISH_TO_URDU') addObject(node.arguments[1], translations);
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'assign' && ts.isIdentifier(node.arguments[0]) && node.arguments[0].text === 'UI_WORDS') addObject(node.arguments[1], vocabulary);
  ts.forEachChild(node, walkI18n);
}
walkI18n(i18n);
for (const key of translations.keys()) if (/^[a-z]+$/.test(key)) vocabulary.add(key);

const labels = new Map();
const attrNames = new Set(['placeholder', 'title', 'aria-label', 'aria-description', 'alt']);
function addLabel(value, file) {
  const label = value.replace(/\s+/g, ' ').trim();
  if (!/[A-Za-z]{2}/.test(label) || label.length > 240) return;
  const key = norm(label);
  if (!labels.has(key)) labels.set(key, { label, file });
}
function visitFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isJsxText(node)) addLabel(node.text, file);
    if (ts.isJsxAttribute(node) && node.name && attrNames.has(node.name.getText(sf))) {
      const init = node.initializer;
      if (init && ts.isStringLiteral(init)) addLabel(init.text, file);
      if (init && ts.isJsxExpression(init) && init.expression && ts.isStringLiteral(init.expression)) addLabel(init.expression.text, file);
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && /^(alert|confirm|prompt)$/.test(node.expression.text)) {
      for (const arg of node.arguments) if (ts.isStringLiteral(arg)) addLabel(arg.text, file);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}
for (const file of files) visitFile(file);

const missing = [];
for (const item of labels.values()) {
  const exact = translations.has(norm(item.label));
  const tokens = [...item.label.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)].map(m => m[0].toLowerCase());
  const covered = tokens.filter(t => vocabulary.has(t)).length;
  if (!exact && (tokens.length < 1 || covered / tokens.length < 0.66)) missing.push({ label: item.label, file: path.relative(root, item.file), missing: [...new Set(tokens.filter(t => !vocabulary.has(t)))] });
}
missing.sort((a, b) => a.file.localeCompare(b.file) || a.label.localeCompare(b.label));
console.log(`UI labels scanned: ${labels.size}; exact or vocabulary-covered: ${labels.size - missing.length}; needs Urdu entries: ${missing.length}`);
const frequencies = new Map();
for (const row of missing) for (const word of row.missing) frequencies.set(word, (frequencies.get(word) || 0) + 1);
console.log([...frequencies].sort((a, b) => b[1] - a[1]).slice(0, 160).map(([word, count]) => `${word}\t${count}`).join('\n'));
