import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductionTrendItem } from "../dashboard.types";
import { useAppStore } from "../../../app/store";
import { translateText, translateTextNode } from "../../../lib/i18n";

interface ProductionTrendChartProps {
  data: ProductionTrendItem[];
  title?: string;
}

type ChartMode = "area" | "line" | "bars" | "table";

export default function ProductionTrendChart({
  data,
  title = "Production & Dispatch Trend Analysis",
}: ProductionTrendChartProps) {
  const language = useAppStore((state) => state.language);
  const [range, setRange] = useState(0);
  const [mode, setMode] = useState<ChartMode>("area");
  const [show, setShow] = useState({ p: true, d: true });
  const [active, setActive] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [plotWidth, setPlotWidth] = useState(860);

  const plotRef = useRef<HTMLDivElement | null>(null);
  const rangesRef = useRef<HTMLDivElement | null>(null);
  const modesRef = useRef<HTMLDivElement | null>(null);

  const view = useMemo(
    () => (range ? data.slice(-range) : data),
    [data, range],
  );

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
  const rate = (r: ProductionTrendItem) =>
    r.produced ? (r.dispatched / r.produced) * 100 : 0;

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const updateWidth = () => {
      const w = Math.floor(el.clientWidth);
      if (w > 0) setPlotWidth(w);
    };
    updateWidth();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateWidth);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [mode]);

  useEffect(() => {
    const movePill = (container: HTMLDivElement | null) => {
      if (!container) return;
      const pill = container.querySelector<HTMLElement>(".kpd-pill");
      const activeBtn = container.querySelector<HTMLElement>("button.on");
      if (pill && activeBtn) {
        pill.style.width = `${activeBtn.offsetWidth}px`;
        pill.style.transform = `translateX(${activeBtn.offsetLeft - 3}px)`;
      }
    };
    movePill(rangesRef.current);
    movePill(modesRef.current);
    const onResize = () => {
      movePill(rangesRef.current);
      movePill(modesRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [range, mode]);

  const totals = useMemo(() => {
    let P = 0;
    let D = 0;
    view.forEach((r) => {
      P += r.produced;
      D += r.dispatched;
    });
    const prev =
      range && data.length >= range * 2
        ? data.slice(-range * 2, -range)
        : null;
    let pp = 0;
    let pd = 0;
    if (prev) {
      prev.forEach((r) => {
        pp += r.produced;
        pd += r.dispatched;
      });
    }
    const rt = P ? (D / P) * 100 : 0;
    return { P, D, pp, pd, rt, yard: P - D };
  }, [view, data, range]);

  const last = data[data.length - 1];
  const prv = data.length >= 2 ? data[data.length - 2] : undefined;
  const ch = last && prv ? last.produced - prv.produced : 0;
  const chPct = last && prv && prv.produced ? Math.abs((ch / prv.produced) * 100) : 0;

  const tickerItems: [string, string, boolean][] = [
    ["Produced Total", fmt(totals.P), true],
    ["Dispatched Total", fmt(totals.D), true],
    ["Dispatch Rate", `${totals.rt.toFixed(1)}%`, totals.rt >= 50],
    ["Yard Stock", `${totals.yard >= 0 ? "+" : "−"}${fmt(Math.abs(totals.yard))}`, totals.yard >= 0],
    ["Today Produced", last ? fmt(last.produced) : "0", true],
    ["Today Dispatched", last ? fmt(last.dispatched) : "0", true],
    ["Periods", `${view.length}`, true],
  ];

  const n = view.length;
  const activeIndex = Math.min(active ?? Math.max(0, n - 1), Math.max(0, n - 1));
  const selected = view[activeIndex];

  const W = Math.max(300, plotWidth);
  const H = W < 560 ? 280 : 340;
  const P = { l: W < 560 ? 42 : 54, r: 14, t: 14, b: 30 };
  const pw = W - P.l - P.r;
  const ph = H - P.t - P.b;
  const base = P.t + ph;

  const keys: ("produced" | "dispatched")[] = [];
  if (show.p) keys.push("produced");
  if (show.d) keys.push("dispatched");

  let maxV = 1;
  view.forEach((r) => {
    keys.forEach((k) => {
      if (r[k] > maxV) maxV = r[k];
    });
  });

  const raw = (maxV * 1.08) / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const step =
    [1, 1.5, 2, 2.5, 5, 10]
      .map((s) => s * pow)
      .find((s) => s >= raw) ?? raw;
  const yMax = step * 4;

  const isBars = mode === "bars";
  const xAt = (i: number) =>
    isBars
      ? P.l + ((i + 0.5) * pw) / Math.max(1, n)
      : P.l + (n <= 1 ? pw / 2 : (i * pw) / (n - 1));
  const yAt = (v: number) => P.t + ph - (v / yMax) * ph;

  const maxLabels = Math.max(2, Math.floor(pw / 64));
  const ls = Math.ceil(Math.max(1, n) / maxLabels);

  const buildPath = (k: "produced" | "dispatched") =>
    view
      .map((r, i) => {
        const x = xAt(i);
        const y = yAt(r[k]);
        if (!i) return `M${x} ${y}`;
        const px = xAt(i - 1);
        const py = yAt(view[i - 1][k]);
        const mx = (px + x) / 2;
        return `C${mx} ${py} ${mx} ${y} ${x} ${y}`;
      })
      .join("");

  const barPath = (x: number, y: number, w: number, h: number, r: number) => {
    const rad = Math.min(r, w / 2, h);
    if (h <= 0) return `M${x} ${y}h${w}`;
    return `M${x} ${y + h}V${y + rad}Q${x} ${y} ${x + rad} ${y}H${x + w - rad}Q${x + w} ${y} ${x + w} ${y + rad}V${y + h}Z`;
  };

  const renderDelta = (cur: number, prev: number) => {
    if (!prev || !range) return null;
    const p = (cur / prev - 1) * 100;
    return (
      <div className={`kpd-dl ${p >= 0 ? "up" : "down"}`}>
        {p >= 0 ? "▲ " : "▼ "}
        {Math.abs(p).toFixed(1)}% vs previous {range} days
      </div>
    );
  };

  const selectedX = n ? xAt(activeIndex) : P.l;

  return (
    <div className="kpd-root">
      <style>{`
        .kpd-root {
          --kpd-bg: #f3f5f8;
          --kpd-surface: #ffffff;
          --kpd-ink: #101827;
          --kpd-muted: #5b6678;
          --kpd-line: #e3e7ee;
          --kpd-p: #c96b45;
          --kpd-d: #15966f;
          --kpd-up: #0f9d6b;
          --kpd-down: #d8434b;
          --kpd-glow: rgba(201, 107, 69, .17);
          color: var(--kpd-ink);
          font-variant-numeric: tabular-nums;
        }
        .dark .kpd-root {
          --kpd-bg: #0c1117;
          --kpd-surface: #141b24;
          --kpd-ink: #eef2f7;
          --kpd-muted: #8d9aaf;
          --kpd-line: #243040;
          --kpd-p: #ee8b61;
          --kpd-d: #34d19e;
          --kpd-up: #2ccf98;
          --kpd-down: #ff6b73;
          --kpd-glow: rgba(238, 139, 97, .18);
        }
        .kpd-ticker {
          overflow: hidden;
          border: 1px solid var(--kpd-line);
          background: var(--kpd-surface);
          border-radius: 12px;
          margin-bottom: 18px;
          -webkit-mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .kpd-track {
          display: flex;
          gap: 34px;
          width: max-content;
          padding: 9px 0;
          animation: kpd-scroll 40s linear infinite;
          font-size: 13px;
        }
        .kpd-ticker:hover .kpd-track { animation-play-state: paused; }
        @keyframes kpd-scroll { to { transform: translateX(-50%); } }
        .kpd-track b { font-weight: 600; margin-right: 6px; }
        .kpd-track .up { color: var(--kpd-up); }
        .kpd-track .down { color: var(--kpd-down); }
        .kpd-header {
          display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end;
          justify-content: space-between; margin-bottom: 18px;
        }
        .kpd-header h1 {
          font-size: clamp(24px, 3.5vw, 34px); font-weight: 700; line-height: 1.1;
          margin: 0 0 6px; letter-spacing: -.02em; color: var(--kpd-ink);
        }
        .kpd-sub { color: var(--kpd-muted); margin: 0; font-size: 14px; }
        .kpd-quote { text-align: right; min-width: 0; }
        .kpd-big {
          font-size: clamp(28px, 5vw, 44px); font-weight: 700; line-height: 1;
          letter-spacing: -.03em; color: var(--kpd-ink);
        }
        .kpd-big small { font-size: .38em; font-weight: 500; letter-spacing: 0; color: var(--kpd-muted); margin-left: 6px; }
        .kpd-chg { font-weight: 600; font-size: 13px; margin-top: 4px; }
        .kpd-chg.up { color: var(--kpd-up); }
        .kpd-chg.down { color: var(--kpd-down); }
        .kpd-panel {
          position: relative;
          background: var(--kpd-surface);
          border: 1px solid var(--kpd-line);
          border-radius: 20px;
          padding: 18px 18px 12px;
          box-shadow: 0 18px 50px -22px var(--kpd-glow);
          transition: background .5s, border-color .5s;
        }
        .kpd-panel::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 3px;
          width: 100%;
          border-radius: 20px 20px 0 0;
          background: linear-gradient(90deg, var(--kpd-p), var(--kpd-d), var(--kpd-p));
          background-size: 200% 100%;
          animation: kpd-sheen 5s linear infinite;
        }
        @keyframes kpd-sheen { to { background-position: -200% 0; } }
        .kpd-ptitle { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 2px 0 2px; }
        .kpd-ptitle h2 { font-size: 17px; font-weight: 700; margin: 0; letter-spacing: -.01em; color: var(--kpd-ink); }
        .kpd-badge {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid color-mix(in srgb, var(--kpd-d) 40%, var(--kpd-line));
          background: color-mix(in srgb, var(--kpd-d) 10%, transparent);
          color: var(--kpd-d); border-radius: 99px; padding: 2px 10px;
          font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em;
        }
        .kpd-badge i { width: 6px; height: 6px; border-radius: 50%; background: var(--kpd-d); display: inline-block; }
        .kpd-psub { margin: 0 0 10px; color: var(--kpd-muted); font-size: 12.5px; }
        .kpd-bar { display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; margin: 6px 0 8px; }
        .kpd-group { display: flex; flex-wrap: wrap; gap: 10px; }
        .kpd-seg {
          position: relative; display: inline-flex;
          background: var(--kpd-bg); border: 1px solid var(--kpd-line);
          border-radius: 12px; padding: 3px;
        }
        .kpd-pill {
          position: absolute; top: 3px; bottom: 3px; left: 0; width: 0;
          background: var(--kpd-surface); border-radius: 9px;
          box-shadow: 0 1px 5px rgba(15, 23, 42, .16);
          transition: transform .45s cubic-bezier(.2, .9, .25, 1.1), width .45s cubic-bezier(.2, .9, .25, 1.1);
        }
        .kpd-seg button {
          position: relative; z-index: 1; font-size: 13px; font-weight: 500;
          color: var(--kpd-muted); background: transparent; border: 0;
          border-radius: 9px; padding: 7px 13px; cursor: pointer;
          transition: color .25s, transform .15s;
        }
        .kpd-seg button:hover { color: var(--kpd-ink); }
        .kpd-seg button.on { color: var(--kpd-ink); font-weight: 600; }
        .kpd-legend { display: flex; flex-wrap: wrap; gap: 8px; }
        .kpd-lg {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--kpd-line); background: var(--kpd-bg);
          padding: 5px 11px; font-size: 12.5px; border-radius: 9px;
          color: var(--kpd-ink); cursor: pointer; font-weight: 500;
        }
        .kpd-lg i { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .kpd-lg.off { opacity: .45; }
        .kpd-lg.off i { background: transparent !important; box-shadow: inset 0 0 0 2px var(--kpd-muted); }
        .kpd-lg.p i { background: var(--kpd-p); }
        .kpd-lg.d i { background: var(--kpd-d); }
        .kpd-plotbox { position: relative; min-height: 280px; margin-top: 6px; }
        .kpd-plotbox svg { display: block; width: 100%; height: auto; overflow: visible; outline: none; }
        .kpd-grid { stroke: var(--kpd-line); stroke-dasharray: 3 5; }
        .kpd-axis { stroke: var(--kpd-line); }
        .kpd-tick { fill: var(--kpd-muted); font-size: 11px; }
        .kpd-ln { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .kpd-end { stroke: var(--kpd-surface); stroke-width: 2; }
        .kpd-xh { stroke: var(--kpd-muted); stroke-dasharray: 3 4; opacity: .6; }
        .kpd-hl { fill: var(--kpd-muted); opacity: .1; }
        .kpd-dot { fill: var(--kpd-surface); stroke-width: 2.5; }
        .kpd-tip {
          position: absolute; top: 8px; pointer-events: none;
          background: var(--kpd-surface); border: 1px solid var(--kpd-line);
          border-radius: 12px; padding: 9px 12px;
          box-shadow: 0 12px 30px -10px rgba(15, 23, 42, .35);
          font-size: 12.5px; min-width: 170px; z-index: 3;
        }
        .kpd-tip b { display: block; margin-bottom: 5px; font-weight: 600; color: var(--kpd-ink); }
        .kpd-tip div { display: flex; align-items: center; gap: 7px; justify-content: space-between; padding: 1px 0; }
        .kpd-tip span.k { display: flex; align-items: center; gap: 7px; color: var(--kpd-muted); }
        .kpd-tip i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .kpd-tip em { font-style: normal; font-weight: 600; color: var(--kpd-ink); }
        .kpd-tip .rt { margin-top: 4px; padding-top: 5px; border-top: 1px solid var(--kpd-line); color: var(--kpd-muted); }
        .kpd-foot {
          display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; align-items: center;
          border-top: 1px solid var(--kpd-line); margin-top: 8px; padding-top: 10px; font-size: 12.5px;
        }
        .kpd-foot .l { color: var(--kpd-muted); }
        .kpd-foot .r { display: flex; flex-wrap: wrap; gap: 6px 16px; }
        .kpd-foot .r span { font-weight: 600; }
        .kpd-tablewrap { max-height: 340px; overflow: auto; border: 1px solid var(--kpd-line); border-radius: 12px; margin-top: 8px; }
        .kpd-tablewrap table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .kpd-tablewrap th, .kpd-tablewrap td { padding: 8px 12px; text-align: end; white-space: nowrap; }
        .kpd-tablewrap th:first-child, .kpd-tablewrap td:first-child { text-align: start; }
        .kpd-track b { margin-inline-end: 6px; margin-right: 0; }
        .kpd-panel::after, .kpd-stat::after { inset-inline-start: 0; left: auto; }
        .kpd-tablewrap thead th {
          position: sticky; top: 0; background: var(--kpd-surface); color: var(--kpd-muted);
          font-weight: 600; font-size: 11.5px; text-transform: uppercase; letter-spacing: .06em;
          border-bottom: 1px solid var(--kpd-line);
        }
        .kpd-tablewrap tbody tr { border-bottom: 1px solid var(--kpd-line); }
        .kpd-tablewrap tbody tr:last-child { border: 0; }
        .kpd-tablewrap tbody tr:hover { background: var(--kpd-bg); }
        .kpd-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; }
        .kpd-stat {
          position: relative; overflow: hidden; min-width: 0;
          background: var(--kpd-surface); border: 1px solid var(--kpd-line);
          border-radius: 14px; padding: 14px 16px;
          transition: transform .3s cubic-bezier(.2, .9, .25, 1.1), box-shadow .3s;
        }
        .kpd-stat:hover { transform: translateY(-4px); box-shadow: 0 16px 30px -18px var(--kpd-glow); }
        .kpd-stat::after { content: ""; position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; opacity: .8; }
        .kpd-stat.sp::after { background: var(--kpd-p); }
        .kpd-stat.sd::after { background: var(--kpd-d); }
        .kpd-stat.sn::after { background: var(--kpd-muted); }
        .kpd-stat .t { display: flex; align-items: center; gap: 7px; color: var(--kpd-muted); font-size: 12.5px; }
        .kpd-stat .t svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .kpd-stat b { display: block; font-size: 26px; font-weight: 700; line-height: 1.2; letter-spacing: -.02em; margin-top: 2px; color: var(--kpd-ink); }
        .kpd-dl { font-size: 12px; font-weight: 600; min-height: 18px; }
        .kpd-dl.up { color: var(--kpd-up); }
        .kpd-dl.down { color: var(--kpd-down); }
        .kpd-meter { height: 6px; background: var(--kpd-bg); border-radius: 9px; margin-top: 6px; overflow: hidden; }
        .kpd-meter i { display: block; height: 100%; background: var(--kpd-d); border-radius: 9px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
      `}</style>

      {/* Ticker */}
      <div className="kpd-ticker" aria-hidden="true">
        <div className="kpd-track">
          {[...tickerItems, ...tickerItems].map((s, idx) => (
            <span key={idx}>
              <b>{translateText(s[0], language)}</b>
              <span className={s[2] ? "up" : "down"}>
                {s[2] ? "▲ " : "▼ "}
                {s[1]}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="kpd-header">
        <div>
          <h1>{translateTextNode("Kiln Production & Dispatch", language)}</h1>
          <p className="kpd-sub">
            {translateTextNode("Daily kiln output compared with gate pass dispatches from your live database.", language)}
          </p>
        </div>
        <div className="kpd-quote">
          <div className="kpd-big">
            {last ? fmt(last.produced) : "0"}
            <small>{translateText("produced latest", language)}</small>
          </div>
          {last && prv && (
            <div className={`kpd-chg ${ch >= 0 ? "up" : "down"}`}>
              {ch >= 0 ? "▲ " : "▼ "}
              {fmt(Math.abs(ch))} ({chPct.toFixed(1)}%) {translateText("vs previous", language)} &middot; {fmt(last.dispatched)} {translateText("dispatched", language)}
            </div>
          )}
        </div>
      </header>

      <section className="kpd-panel">
        <div className="kpd-ptitle">
          <h2>{translateTextNode(title, language)}</h2>
          <span className="kpd-badge">
            <i />
            {translateTextNode("Live database", language)}
          </span>
        </div>
        <p className="kpd-psub">
          {translateTextNode("Kiln output compared with gate pass dispatches", language)} &middot; {n} {translateText(n === 1 ? "period" : "periods", language)}
        </p>

        <div className="kpd-bar">
          <div className="kpd-group">
            <div
              className="kpd-seg"
              ref={rangesRef}
              role="group"
              aria-label={translateText("Date range", language)}
            >
              <i className="kpd-pill" />
              {[
                { label: "7D", val: 7 },
                { label: "14D", val: 14 },
                { label: "30D", val: 30 },
                { label: "All", val: 0 },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  className={range === r.val ? "on" : ""}
                  onClick={() => {
                    setRange(r.val);
                    setActive(null);
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div
              className="kpd-seg"
              ref={modesRef}
              role="group"
              aria-label="Chart type"
            >
              <i className="kpd-pill" />
              {(["area", "line", "bars", "table"] as ChartMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={mode === m ? "on" : ""}
                  onClick={() => setMode(m)}
                >
                {translateText(m.charAt(0).toUpperCase() + m.slice(1), language)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mode !== "table" && (
          <div className="kpd-legend">
            <button
              type="button"
              className={`kpd-lg p ${!show.p ? "off" : ""}`}
              aria-pressed={show.p}
              onClick={() => {
                if (show.p && !show.d) return;
                setShow((prev) => ({ ...prev, p: !prev.p }));
              }}
            >
              <i />
              {translateTextNode("Production", language)}
            </button>
            <button
              type="button"
              className={`kpd-lg d ${!show.d ? "off" : ""}`}
              aria-pressed={show.d}
              onClick={() => {
                if (show.d && !show.p) return;
                setShow((prev) => ({ ...prev, d: !prev.d }));
              }}
            >
              <i />
              {translateTextNode("Gate pass dispatches", language)}
            </button>
          </div>
        )}

        {mode === "table" ? (
          <div className="kpd-tablewrap">
            <table>
              <thead>
                <tr>
                  <th>{translateTextNode("Period", language)}</th>
                  <th>{translateTextNode("Produced", language)}</th>
                  <th>{translateTextNode("Dispatched", language)}</th>
                  <th>{translateTextNode("Dispatch rate", language)}</th>
                </tr>
              </thead>
              <tbody>
                {view
                  .slice()
                  .reverse()
                  .map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      <td style={{ color: "var(--kpd-p)" }}>{fmt(r.produced)}</td>
                      <td style={{ color: "var(--kpd-d)" }}>
                        {fmt(r.dispatched)}
                      </td>
                      <td>{rate(r).toFixed(1)}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="kpd-plotbox" ref={plotRef}>
            {n === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                {translateTextNode("No production or dispatch records in selected period.", language)}
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${W} ${H}`}
                tabIndex={0}
                role="img"
                aria-label={`Production and dispatch trend across ${n} periods`}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setHovering(true);
                    setActive((prev) => Math.min(n - 1, (prev ?? n - 1) + 1));
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setHovering(true);
                    setActive((prev) => Math.max(0, (prev ?? n - 1) - 1));
                  }
                }}
                onBlur={() => setHovering(false)}
              >
                <defs>
                  <linearGradient id="kpd-gp" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--kpd-p)" }} stopOpacity=".2" />
                    <stop offset="1" style={{ stopColor: "var(--kpd-p)" }} stopOpacity=".01" />
                  </linearGradient>
                  <linearGradient id="kpd-gd" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--kpd-d)" }} stopOpacity=".1" />
                    <stop offset="1" style={{ stopColor: "var(--kpd-d)" }} stopOpacity=".01" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4].map((t) => {
                  const v = step * t;
                  const y = yAt(v);
                  return (
                    <g key={t}>
                      <line
                        className={t ? "kpd-grid" : "kpd-axis"}
                        x1={P.l}
                        x2={W - P.r}
                        y1={y}
                        y2={y}
                      />
                      <text
                        className="kpd-tick"
                        x={P.l - 8}
                        y={y + 4}
                        textAnchor="end"
                      >
                        {v >= 1000
                          ? `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k`
                          : Math.round(v)}
                      </text>
                    </g>
                  );
                })}

                {view.map((r, i) =>
                  i % ls === 0 || (i === n - 1 && (n - 1) % ls > ls / 2) ? (
                    <text
                      key={r.label}
                      className="kpd-tick"
                      x={xAt(i)}
                      y={H - 8}
                      textAnchor="middle"
                    >
                      {r.label}
                    </text>
                  ) : null,
                )}

                {isBars ? (
                  <>
                    {view.map((r, i) => {
                      const cnt = keys.length || 1;
                      const gw = Math.min((pw / n) * 0.74, cnt === 2 ? 40 : 22);
                      const bw = (gw - (cnt - 1) * 2) / cnt;
                      return keys.map((k, j) => {
                        const h = Math.max(0, (r[k] / yMax) * ph);
                        const x = xAt(i) - gw / 2 + j * (bw + 2);
                        return (
                          <path
                            key={`${r.label}-${k}`}
                            d={barPath(x, base - h, bw, h, 3)}
                            style={{
                              fill:
                                k === "produced"
                                  ? "var(--kpd-p)"
                                  : "var(--kpd-d)",
                            }}
                          />
                        );
                      });
                    })}
                    {hovering && (
                      <rect
                        className="kpd-hl"
                        x={selectedX - pw / n / 2}
                        y={P.t}
                        width={pw / n}
                        height={ph}
                        rx={6}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {mode === "area" &&
                      keys.map((k) => {
                        const p = buildPath(k);
                        return (
                          <path
                            key={`a-${k}`}
                            fill={
                              k === "produced" ? "url(#kpd-gp)" : "url(#kpd-gd)"
                            }
                            d={`${p}L${xAt(n - 1)} ${base}L${xAt(0)} ${base}Z`}
                          />
                        );
                      })}
                    {keys.map((k) => (
                      <path
                        key={`l-${k}`}
                        className="kpd-ln"
                        style={{
                          stroke:
                            k === "produced" ? "var(--kpd-p)" : "var(--kpd-d)",
                        }}
                        d={buildPath(k)}
                      />
                    ))}
                    {keys.map((k) => (
                      <circle
                        key={`e-${k}`}
                        className="kpd-end"
                        style={{
                          fill:
                            k === "produced" ? "var(--kpd-p)" : "var(--kpd-d)",
                        }}
                        cx={xAt(n - 1)}
                        cy={yAt(view[n - 1][k])}
                        r={4.5}
                      />
                    ))}
                    {hovering && (
                      <>
                        <line
                          className="kpd-xh"
                          x1={selectedX}
                          x2={selectedX}
                          y1={P.t}
                          y2={base}
                        />
                        {keys.map((k) => (
                          <circle
                            key={`d-${k}`}
                            className="kpd-dot"
                            style={{
                              stroke:
                                k === "produced"
                                  ? "var(--kpd-p)"
                                  : "var(--kpd-d)",
                            }}
                            cx={selectedX}
                            cy={yAt(selected[k])}
                            r={5}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}

                <rect
                  x={P.l}
                  y={P.t}
                  width={pw}
                  height={ph}
                  fill="transparent"
                  style={{ cursor: "crosshair" }}
                  onPointerMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) * (W / rect.width);
                    const i = isBars
                      ? Math.floor((x - P.l) / (pw / n))
                      : Math.round((x - P.l) / (pw / Math.max(1, n - 1)));
                    setActive(Math.max(0, Math.min(n - 1, i)));
                    setHovering(true);
                  }}
                  onPointerLeave={() => {
                    setHovering(false);
                    setActive(null);
                  }}
                />
              </svg>
            )}

            {hovering && selected && (
              <div
                className="kpd-tip"
                style={{
                  left: `${(selectedX / W) * 100}%`,
                  transform:
                    selectedX < W / 2
                      ? "translateX(14px)"
                      : "translateX(calc(-100% - 14px))",
                }}
              >
                <b>{selected.label}</b>
                {show.p && (
                  <div>
                    <span className="k">
                      <i style={{ background: "var(--kpd-p)" }} />
                      {translateTextNode("Produced", language)}
                    </span>
                    <em>{fmt(selected.produced)}</em>
                  </div>
                )}
                {show.d && (
                  <div>
                    <span className="k">
                      <i style={{ background: "var(--kpd-d)" }} />
                      {translateTextNode("Dispatched", language)}
                    </span>
                    <em>{fmt(selected.dispatched)}</em>
                  </div>
                )}
                <div className="rt">
                  <span>{translateTextNode("Dispatch rate", language)}</span>
                  <em>{rate(selected).toFixed(1)}%</em>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="kpd-foot">
          <div className="l">
            {translateTextNode("Dispatch / production", language)} {totals.rt.toFixed(1)}%
          </div>
          {selected && (
            <div className="r" aria-live="polite">
              <span style={{ color: "var(--kpd-muted)", fontWeight: 500 }}>
                {selected.label}
              </span>
              <span style={{ color: "var(--kpd-p)" }}>
                {fmt(selected.produced)} {translateText("produced", language)}
              </span>
              <span style={{ color: "var(--kpd-d)" }}>
                {fmt(selected.dispatched)} {translateText("dispatched", language)}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="kpd-stats">
        <div className="kpd-stat sp">
          <div className="t">
            <svg viewBox="0 0 24 24">
              <path d="M3 21V9l6 4V9l6 4V5h6v16z" />
            </svg>
            {translateTextNode("Produced", language)}
          </div>
          <b>{fmt(totals.P)}</b>
          {renderDelta(totals.P, totals.pp)}
        </div>

        <div className="kpd-stat sd">
          <div className="t">
            <svg viewBox="0 0 24 24">
              <path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
            {translateTextNode("Dispatched", language)}
          </div>
          <b>{fmt(totals.D)}</b>
          {renderDelta(totals.D, totals.pd)}
        </div>

        <div className="kpd-stat sd">
          <div className="t">
            <svg viewBox="0 0 24 24">
              <path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" />
            </svg>
            {translateTextNode("Dispatch / production", language)}
          </div>
          <b>{totals.rt.toFixed(1)}%</b>
          <div className="kpd-meter">
            <i style={{ width: `${Math.min(100, totals.rt)}%` }} />
          </div>
        </div>

        <div className="kpd-stat sn">
          <div className="t">
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-5 9 5v10H3zM9 19v-6h6v6" />
            </svg>
            {translateTextNode("Added to yard stock", language)}
          </div>
          <b>
            {totals.yard >= 0 ? "+" : "−"}
            {fmt(Math.abs(totals.yard))}
          </b>
          <div className="kpd-dl" style={{ color: "var(--kpd-muted)" }}>
            {translateTextNode("produced − dispatched", language)}
          </div>
        </div>
      </section>
    </div>
  );
}
