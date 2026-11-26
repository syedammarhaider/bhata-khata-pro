
import type { ReactNode } from "react";

interface PermissionGateProps {
  allowed: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  hideWhenDenied?: boolean;
}

export default function PermissionGate({
  allowed,
  children,
  fallback = null,
  hideWhenDenied = true,
}: PermissionGateProps) {
  if (allowed) {
    return <>{children}</>;
  }

  if (hideWhenDenied) {
    return null;
  }

  return <>{fallback}</>;
}
