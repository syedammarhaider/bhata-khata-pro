
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import { useAppStore } from "./store";
import ProtectedRoute from "./ProtectedRoute";

import SetupPage from "../features/settings/SetupPage";
import LoginPage from "../features/settings/LoginPage";
import SettingsPage from "../features/settings/SettingsPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ProductionPage from "../features/production/ProductionPage";
import InventoryPage from "../features/inventory/InventoryPage";
import SalesPage from "../features/sales/SalesPage";
import OrdersPage from "../features/orders/OrdersPage";
import GatePassPage from "../features/gate-pass/GatePassPage";
import CustomersPage from "../features/customers/CustomersPage";
import SuppliersPage from "../features/suppliers/SuppliersPage";
import PaymentsPage from "../features/payments/PaymentsPage";
import LabourPage from "../features/labour/LabourPage";
import AttendancePage from "../features/attendance/AttendancePage";
import WagesPage from "../features/wages/WagesPage";
import BackupRestorePage from "../features/backup-restore/BackupRestorePage";
import LicensePage from "../features/licensing/LicensePage";
import CoalFuelPage from "../features/coal-fuel/CoalFuelPage";
import ExpensesPage from "../features/expenses/ExpensesPage";
import PurchasesPage from "../features/purchases/PurchasesPage";
import ReportsPage from "../features/reports/ReportsPage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";
import AdminPage from "../features/admin/AdminPage";
import AppLayout from "../components/layout/AppLayout";

import type { BusinessProfile } from "../types";

import "../styles/globals.css";

interface AppBootstrapState {
  business_profile: BusinessProfile | null;
  admin_exists: boolean;
}

function ApplicationRoutes() {
  const initialized = useAppStore(
    (state) => state.initialized,
  );

  const authenticated = useAppStore(
    (state) => state.authenticated,
  );

  const requiresSetup = useAppStore(
    (state) => state.requiresSetup,
  );

  const setBusinessProfile = useAppStore(
    (state) => state.setBusinessProfile,
  );

  const setRequiresSetup = useAppStore(
    (state) => state.setRequiresSetup,
  );

  const setInitialized = useAppStore(
    (state) => state.setInitialized,
  );

  const setActiveRoute = useAppStore(
    (state) => state.setActiveRoute,
  );

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveRoute(currentPath);
  }, [setActiveRoute]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const state = await invoke<AppBootstrapState>("get_app_state");

        if (!active) return;

        setBusinessProfile(state.business_profile);
        setRequiresSetup(
          !state.business_profile || !state.admin_exists,
        );
      } catch {
        if (active) {
          setRequiresSetup(true);
        }
      } finally {
        if (active) {
          setInitialized(true);
        }
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [
    setBusinessProfile,
    setInitialized,
    setRequiresSetup,
  ]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500" />
          <p className="text-sm text-slate-300">
            Loading Bhatta Khata Pro...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/setup"
        element={
          authenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SetupPage />
          )
        }
      />

      <Route
        path="/login"
        element={
          authenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={
              authenticated
                ? "/dashboard"
                : requiresSetup
                  ? "/setup"
                  : "/login"
            }
            replace
          />
        }
      />

      <Route
        path="/license"
        element={<LicensePage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardRoute />}
        />

        <Route
          path="/production"
          element={<ProductionPage />}
        />

        <Route
          path="/inventory"
          element={<InventoryPage />}
        />

        <Route
          path="/sales"
          element={<SalesPage />}
        />

        <Route
          path="/orders"
          element={<OrdersPage />}
        />

        <Route
          path="/gate-pass"
          element={<GatePassPage />}
        />

        <Route
          path="/customers"
          element={<CustomersPage />}
        />

        <Route
          path="/suppliers"
          element={<SuppliersPage />}
        />

        <Route
          path="/payments"
          element={<PaymentsPage />}
        />

        <Route
          path="/labour"
          element={<LabourPage />}
        />

        <Route
          path="/attendance"
          element={<AttendancePage />}
        />

        <Route
          path="/wages"
          element={<WagesPage />}
        />

        <Route
          path="/coal-fuel"
          element={<CoalFuelPage />}
        />

        <Route
          path="/expenses"
          element={<ExpensesPage />}
        />

        <Route
          path="/purchases"
          element={<PurchasesPage />}
        />

        <Route
          path="/reports"
          element={<ReportsPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="/backup-restore"
          element={<BackupRestorePage />}
        />

        <Route
          path="/settings"
          element={<SettingsPage />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={
              authenticated
                ? "/dashboard"
                : requiresSetup
                  ? "/setup"
                  : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

function DashboardRoute() {
  const currentUser = useAppStore((state) => state.currentUser);
  const businessProfile = useAppStore((state) => state.businessProfile);

  return (
    <DashboardPage
      userName={currentUser?.full_name ?? "Administrator"}
      businessName={businessProfile?.business_name ?? "Your Brick Kiln"}
      currency={businessProfile?.currency ?? "PKR"}
    />
  );
}

export default function App() {
  return (
    <HashRouter>
      <ApplicationRoutes />
    </HashRouter>
  );
}
