
import {
  MODULES,
  NAVIGATION_GROUPS,
  DEFAULT_ROLE_ACCESS,
} from "../lib/constants";

import type {
  PermissionModule,
  UserRole,
} from "../types";

export interface NavigationItem {
  id: PermissionModule;
  label: string;
  route: string;
  icon: string;
  description: string;
  group: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

export function getNavigationForRole(
  role: UserRole,
  customPermissions?: PermissionModule[],
): NavigationSection[] {
  const allowedModules = new Set(
    customPermissions ?? DEFAULT_ROLE_ACCESS[role],
  );

  return NAVIGATION_GROUPS
    .map((group) => ({
      id: group.id,
      label: group.label,
      items: MODULES
        .filter(
          (module) =>
            module.group === group.id &&
            allowedModules.has(module.id) &&
            (!module.adminOnly || role === "admin"),
        )
        .map((module) => ({
          id: module.id,
          label: module.label,
          route: module.route,
          icon: module.icon,
          description: module.description,
          group: module.group,
        })),
    }))
    .filter((section) => section.items.length > 0);
}

export function getModuleByRoute(route: string) {
  return MODULES.find((module) => module.route === route);
}

export function getModuleById(id: PermissionModule) {
  return MODULES.find((module) => module.id === id);
}

export function isAllowedRoute(
  route: string,
  role: UserRole,
  customPermissions?: PermissionModule[],
): boolean {
  const module = getModuleByRoute(route);

  if (!module) return false;

  const permissions =
    customPermissions ?? DEFAULT_ROLE_ACCESS[role];

  if (module.adminOnly && role !== "admin") {
    return false;
  }

  return permissions.includes(module.id);
}
