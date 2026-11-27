# Bhatta Khata Pro

Offline-first desktop ERP for brick kilns, built with React, TypeScript, Rust, and Tauri 2.

## Development

- `npm install` — install frontend dependencies
- `npm run dev` — start the frontend
- `npm run build` — create a production frontend build
- `cargo check` from `src-tauri` — check the Rust backend
- `npm run tauri dev` — run the desktop app

## Signed Windows releases

Push a version-matched `v*` tag to run `.github/workflows/release.yml`. The workflow reads the updater signing key from the GitHub Actions secrets `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.

Never commit or paste a private signing key into this repository. Keep the key in a secure owner-controlled backup and GitHub Actions secrets. See [updates and support](docs/UPDATES-AND-SUPPORT.md) for release steps.