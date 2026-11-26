
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface BusinessProfile {
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  language: string;
}

const emptyProfile: BusinessProfile = {
  business_name: "",
  owner_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "Pakistan",
  currency: "PKR",
  language: "en",
};

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function App() {
  const [profile, setProfile] = useState<BusinessProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!isTauri()) {
        setError(
          "Tauri runtime not detected. Run the app with `npm run tauri dev` and use the desktop window."
        );
        setLoading(false);
        return;
      }

      try {
        const result = await invoke<BusinessProfile | null>(
          "get_business_profile"
        );

        if (result) {
          setProfile(result);
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(
    field: keyof BusinessProfile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!profile.business_name.trim() || !profile.owner_name.trim()) {
      setError("Business name and owner name are required.");
      return;
    }

    setSaving(true);

    if (!isTauri()) {
      setError(
        "Tauri runtime not detected. Run the app with `npm run tauri dev` and use the desktop window."
      );
      setSaving(false);
      return;
    }

    try {
      await invoke("save_business_profile", { profile });
      setMessage("Business profile saved successfully.");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #dce2ea",
    borderRadius: "9px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#172033",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#344054",
  };

  if (loading) {
    return (
      <main style={{ padding: 40, fontFamily: "Arial" }}>
        Loading business profile...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6fa",
        padding: "36px 20px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <div
            style={{
              color: "#5265d8",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              marginBottom: 10,
            }}
          >
            BHATTA KHATA PRO
          </div>

          <h1 style={{ fontSize: 28, color: "#172033", margin: 0 }}>
            Set up your brick kiln
          </h1>

          <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
            Enter your business information to configure your local ERP system.
          </p>
        </header>

        <form
          onSubmit={saveProfile}
          style={{
            background: "#ffffff",
            border: "1px solid #e5e9f0",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 8px 30px rgba(20,35,70,0.05)",
          }}
        >
          <h2 style={{ fontSize: 18, color: "#172033", marginTop: 0 }}>
            Business information
          </h2>

          <p style={{ color: "#667085", fontSize: 13, marginBottom: 24 }}>
            Fields marked with * are required.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 20,
            }}
          >
            <div>
              <label style={labelStyle}>Business / Kiln name *</label>
              <input
                style={inputStyle}
                value={profile.business_name}
                onChange={(e) => updateField("business_name", e.target.value)}
                placeholder="Enter your kiln name"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Owner name *</label>
              <input
                style={inputStyle}
                value={profile.owner_name}
                onChange={(e) => updateField("owner_name", e.target.value)}
                placeholder="Enter owner name"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Phone number</label>
              <input
                style={inputStyle}
                value={profile.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+92 300 1234567"
              />
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <input
                style={inputStyle}
                type="email"
                value={profile.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label style={labelStyle}>City</label>
              <input
                style={inputStyle}
                value={profile.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div>
              <label style={labelStyle}>Country</label>
              <input
                style={inputStyle}
                value={profile.country}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Currency</label>
              <select
                style={inputStyle}
                value={profile.currency}
                onChange={(e) => updateField("currency", e.target.value)}
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Application language</label>
              <select
                style={inputStyle}
                value={profile.language}
                onChange={(e) => updateField("language", e.target.value)}
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Business address</label>
              <textarea
                style={{ ...inputStyle, minHeight: 85, resize: "vertical" }}
                value={profile.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter complete kiln address"
              />
            </div>
          </div>

          {error && (
            <p style={{ color: "#c62828", fontSize: 13 }}>{error}</p>
          )}

          {message && (
            <p style={{ color: "#16834a", fontSize: 13 }}>{message}</p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 26,
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#4f5fd5",
                color: "#ffffff",
                border: "none",
                borderRadius: 9,
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Business Profile"}
            </button>
          </div>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#98a2b3",
            fontSize: 12,
            marginTop: 20,
          }}
        >
          Your business information is stored locally on this computer.
        </p>
      </div>
    </main>
  );
}

export default App;
