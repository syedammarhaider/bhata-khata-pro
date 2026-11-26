// =========================================================
// FILE 569
// PATH: src-tauri/src/licensing.rs
// =========================================================

// Rust license module.
// The functions are connected to Tauri commands in lib.rs
// during the backend integration stage.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::license_crypto::verify_activation_key;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LicensePayload {
    pub license_id: String,
    pub customer_id: String,
    pub business_name: String,
    pub device_id: String,
    pub issued_at: u64,
    pub expires_at: u64,
    pub issued_by: String,
    pub version: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LicenseInformation {
    pub status: String,
    pub customer_name: Option<String>,
    pub license_id: Option<String>,
    pub expires_at: Option<u64>,
    pub days_remaining: Option<u64>,
    pub device_id: Option<String>,
}

pub fn current_timestamp() -> Result<u64, String> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .map_err(|error| error.to_string())
}

pub fn calculate_days_remaining(expires_at: u64) -> Result<u64, String> {
    let now = current_timestamp()?;

    if now >= expires_at {
        return Ok(0);
    }

    Ok((expires_at - now).div_ceil(86400))
}

pub fn validate_payload(
    payload: &LicensePayload,
    current_device_id: &str,
) -> Result<(), String> {
    if payload.license_id.trim().is_empty() {
        return Err("License ID is missing.".into());
    }

    if payload.customer_id.trim().is_empty() {
        return Err("Customer ID is missing.".into());
    }

    if payload.device_id != current_device_id {
        return Err("This license belongs to another computer.".into());
    }

    if payload.version != 1 {
        return Err("Unsupported license version.".into());
    }

    let now = current_timestamp()?;

    if payload.issued_at > now.saturating_add(300) {
        return Err("License issue date is invalid.".into());
    }

    if payload.expires_at <= now {
        return Err("Subscription has expired.".into());
    }

    if payload.expires_at <= payload.issued_at {
        return Err("License expiry date is invalid.".into());
    }

    Ok(())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StoredLicense {
    activation_key: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LicenseActivationResult {
    pub success: bool,
    pub message: String,
    pub license: Option<LicenseInformation>,
}

fn hex_prefix(bytes: &[u8], length: usize) -> String {
    bytes
        .iter()
        .take(length)
        .map(|byte| format!("{byte:02X}"))
        .collect()
}

pub fn device_id() -> String {
    let computer = std::env::var("COMPUTERNAME")
        .unwrap_or_else(|_| "unknown-computer".to_string());
    let user = std::env::var("USERNAME")
        .unwrap_or_else(|_| "unknown-user".to_string());

    let mut hasher = Sha256::new();
    hasher.update(computer.as_bytes());
    hasher.update(b"|");
    hasher.update(user.as_bytes());

    format!("DEV-{}", hex_prefix(&hasher.finalize(), 8))
}

fn read_license(path: &Path) -> Result<Option<LicensePayload>, String> {
    if !path.exists() {
        return Ok(None);
    }

    let contents = fs::read_to_string(path)
        .map_err(|error| format!("Unable to read license file: {error}"))?;

    let stored: StoredLicense = serde_json::from_str(&contents)
        .map_err(|_| "Stored license data is invalid.".to_string())?;

    verify_activation_key(&stored.activation_key).map(Some)
}

fn write_license(path: &Path, activation_key: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|error| format!("Unable to create license directory: {error}"))?;
    }

    let stored = StoredLicense {
        activation_key: activation_key.to_string(),
    };

    let contents = serde_json::to_string_pretty(&stored)
        .map_err(|error| format!("Unable to serialize license: {error}"))?;

    fs::write(path, contents)
        .map_err(|error| format!("Unable to save license: {error}"))
}

pub fn license_information(path: &Path) -> Result<LicenseInformation, String> {
    let current_device = device_id();

    let Some(payload) = read_license(path)? else {
        return Ok(LicenseInformation {
            status: "not_activated".to_string(),
            customer_name: None,
            license_id: None,
            expires_at: None,
            days_remaining: None,
            device_id: Some(current_device),
        });
    };

    let now = current_timestamp()?;
    let days_remaining = calculate_days_remaining(payload.expires_at).unwrap_or(0);

    let status = if payload.device_id != current_device {
        "invalid"
    } else if payload.expires_at <= now {
        "expired"
    } else {
        "active"
    };

    Ok(LicenseInformation {
        status: status.to_string(),
        customer_name: Some(payload.business_name.clone()),
        license_id: Some(payload.license_id.clone()),
        expires_at: Some(payload.expires_at),
        days_remaining: Some(days_remaining),
        device_id: Some(payload.device_id.clone()),
    })
}

pub fn activate_license(
    path: &Path,
    activation_key: &str,
) -> Result<LicenseActivationResult, String> {
    let payload = match verify_activation_key(activation_key) {
        Ok(payload) => payload,
        Err(message) => {
            return Ok(LicenseActivationResult {
                success: false,
                message,
                license: None,
            });
        }
    };

    if let Err(message) = validate_payload(&payload, &device_id()) {
        return Ok(LicenseActivationResult {
            success: false,
            message,
            license: None,
        });
    }

    write_license(path, activation_key)?;

    let license = license_information(path)?;

    Ok(LicenseActivationResult {
        success: true,
        message: "License activated successfully.".to_string(),
        license: Some(license),
    })
}
