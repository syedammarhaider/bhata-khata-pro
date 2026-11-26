# Updates and support reports

## Client support

In the desktop app, open **Settings → Support & updates**. The page shows the latest local log entries, lets the user refresh the viewer, and can export a diagnostic text report or open an email addressed to support. The crash screen also offers a report and export action.

Reports are saved under the app's local diagnostics directory. They include app/OS/schema metadata and recent log text. Logs can contain details from an error message, so the client should review the report before sharing it. The database file itself and its full local path are not included.

## Stable Windows updates

The configured updater endpoint is the GitHub repository's `releases/latest/download/latest.json`. A normal stable release therefore targets every installed client using that endpoint; GitHub's standard latest-release URL does not select one license or customer. The app checks on demand from **Settings → Support & updates** and installs only a valid signed update.

To publish a stable update:

1. Increment the same version in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`.
2. Commit and push the version change.
3. Create and push the matching tag, for example `v0.2.0` for version `0.2.0`.
4. The GitHub workflow builds the Windows installer, signs updater artifacts, and publishes the release plus `latest.json`.

Before the first release, configure repository Actions secrets `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. The private key must match the public key already embedded in `src-tauri/tauri.conf.json`. Keep the private key only in the repository secret or a secure owner environment; never commit it or place it in the client app. Preserve a backup because previously installed clients trust this key.

The workflow requires GitHub Actions to be enabled and its `GITHUB_TOKEN` to have release write permission. A release cannot be produced until the signing secret is configured. The action generates the updater manifest and signed platform artifact; do not hand-edit `latest.json` or replace the signing key for a routine update.

## Testing a fix with one client

The stable endpoint is shared, so publishing there is a broadcast. A GitHub prerelease alone does not create a private per-client update channel. To test with one client, provide that client a separately built and signed test app configured with a separate test endpoint/repository, or use a controlled manual installer. Do not change the stable endpoint for only one user: every installation containing that endpoint would see the same update. Per-license targeting requires an authenticated update service or a client-specific endpoint/configuration and is not part of the shared GitHub latest-release setup.
