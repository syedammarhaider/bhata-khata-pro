
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAppStore } from "./store";
import { isAllowedRoute } from "./navigation";

import type { PermissionModule } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredModule?: PermissionModule;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredModule,
  adminOnly = false,
}: ProtectedRouteProps) {
  const authenticated = useAppStore(
    (state) => state.authenticated,
  );

  const currentUser = useAppStore(
    (state) => state.currentUser,
  );

  const location = useLocation();

  if (!authenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    requiredModule &&
    !isAllowedRoute(
      `/${requiredModule.replace(/_/g, "-")}`,
      currentUser.role,
    )
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
