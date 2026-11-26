// =========================================================
// FILE 570
// PATH: src-tauri/src/license_crypto.rs
// =========================================================

// Ed25519 signature verification.
//
// IMPORTANT:
// The private signing key must NEVER be included in the
// customer Windows application.
//
// Only the public verification key belongs in this app.
// The future Android Owner App will hold the private key.
//
// Required Rust dependencies will be listed in the final
// integration dependency list.

use base64::{
    engine::general_purpose::URL_SAFE_NO_PAD,
    Engine as _,
};

use ed25519_dalek::{Signature, Verifier, VerifyingKey};

use crate::licensing::LicensePayload;

pub fn verify_activation_key(
    activation_key: &str,
) -> Result<LicensePayload, String> {
    let public_key = std::env::var("BHATTA_LICENSE_PUBLIC_KEY")
        .ok()
        .or_else(|| option_env!("BHATTA_LICENSE_PUBLIC_KEY").map(|value| value.to_string()))
        .ok_or_else(|| {
            "License verification public key is not configured.".to_string()
        })?;

    let public_key_bytes = URL_SAFE_NO_PAD
        .decode(public_key.trim())
        .map_err(|_| "License verification public key is invalid.".to_string())?;

    if public_key_bytes.len() != 32 {
        return Err("License verification public key is invalid.".into());
    }

    if public_key_bytes.iter().all(|byte| *byte == 0) {
        return Err("License verification public key is not configured.".into());
    }

    let activation_key: String = activation_key.split_whitespace().collect();
    let mut parts = activation_key.split('.');

    let payload_part = parts
        .next()
        .ok_or_else(|| "Missing license payload.".to_string())?;

    let signature_part = parts
        .next()
        .ok_or_else(|| "Missing license signature.".to_string())?;

    if parts.next().is_some() {
        return Err("Invalid activation key format.".into());
    }

    let payload_bytes = URL_SAFE_NO_PAD
        .decode(payload_part)
        .map_err(|_| "Invalid license payload encoding.".to_string())?;

    let signature_bytes = URL_SAFE_NO_PAD
        .decode(signature_part)
        .map_err(|_| "Invalid signature encoding.".to_string())?;

    let payload: LicensePayload = serde_json::from_slice(&payload_bytes)
        .map_err(|_| "Invalid license information.".to_string())?;

    let key_array: [u8; 32] = public_key_bytes
        .try_into()
        .map_err(|_| "License verification public key is invalid.".to_string())?;

    let verifying_key = VerifyingKey::from_bytes(&key_array)
        .map_err(|_| "License verification public key is invalid.".to_string())?;

    let signature = Signature::from_slice(&signature_bytes)
        .map_err(|_| "Invalid license signature.".to_string())?;

    verifying_key
        .verify(&payload_bytes, &signature)
        .map_err(|_| "Activation key verification failed.".to_string())?;

    Ok(payload)
}
