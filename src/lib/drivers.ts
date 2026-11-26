// ============================================================
// Bhatta Khata Pro - Driver Fleet Manager
// Persisted in app_settings table via Tauri
// ============================================================

import { invoke } from "@tauri-apps/api/core";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  status: "available" | "on_trip";
  freeAfterHours: number;
  notes?: string;
}

const DEFAULT_DRIVERS: Driver[] = [
  {
    id: "drv-1",
    name: "Muhammad Tariq",
    phone: "0300-1234567",
    vehicleNumber: "LEB-1234",
    status: "available",
    freeAfterHours: 0,
    notes: "Bedford 6-wheeler truck (Capacity: 10,000 bricks)",
  },
  {
    id: "drv-2",
    name: "Rashid Khan",
    phone: "0321-7654321",
    vehicleNumber: "FD-5678",
    status: "on_trip",
    freeAfterHours: 4,
    notes: "Isuzu 10-wheeler (Capacity: 15,000 bricks) - Delivery to City project",
  },
  {
    id: "drv-3",
    name: "Ali Raza",
    phone: "0312-9876543",
    vehicleNumber: "MN-9012",
    status: "available",
    freeAfterHours: 0,
    notes: "Tractor Trolley (Capacity: 5,000 bricks)",
  },
  {
    id: "drv-4",
    name: "Nawazish Ali",
    phone: "0345-5556677",
    vehicleNumber: "RWP-3344",
    status: "on_trip",
    freeAfterHours: 6,
    notes: "Hino Truck - Dispatched to Housing Society",
  },
];

const SETTING_KEY = "bhatta_drivers_list";

export async function getDrivers(): Promise<Driver[]> {
  try {
    const settings = await invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings");
    const found = settings.find((s) => s.setting_key === SETTING_KEY);
    if (found && found.setting_value) {
      const parsed = JSON.parse(found.setting_value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load drivers from database, using defaults:", err);
  }
  return DEFAULT_DRIVERS;
}

export async function saveDrivers(drivers: Driver[]): Promise<void> {
  const json = JSON.stringify(drivers);
  await invoke("save_app_settings", {
    settings: [{ setting_key: SETTING_KEY, setting_value: json }],
  });
}
