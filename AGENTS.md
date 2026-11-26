# Bhatta Khata Pro

Offline-first Tauri 2 desktop ERP for brick kilns.

## Verification commands

- Frontend production build: `npm run build`
- Frontend dev server: `npm run dev`
- Rust check: `cargo check` from `src-tauri`
- Rust tests: `cargo test` from `src-tauri`
- Desktop dev: `npm run tauri dev`

## Notes

- Cargo may not be on PATH in Git Bash; use `"$USERPROFILE/.cargo/bin/cargo.exe"` if needed.
- The frontend must not access SQLite directly; add Tauri commands in `src-tauri/src/lib.rs` and call them with `invoke`.
- License verification uses the Ed25519 public key from `BHATTA_LICENSE_PUBLIC_KEY` at runtime, falling back to the compile-time environment value. The private signing key belongs only in the owner key generator, never in the customer app.
