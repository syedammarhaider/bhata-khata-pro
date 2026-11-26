
import { create } from "zustand";
import type {
  AuthSession,
  BusinessProfile,
  LanguageCode,
  User,
} from "../types";

export type ThemeMode = "light" | "dark" | "system";

interface AppStore {
  initialized: boolean;
  authenticated: boolean;
  requiresSetup: boolean;

  currentUser: User | null;
  session: AuthSession | null;

  businessProfile: BusinessProfile | null;

  theme: ThemeMode;
  language: LanguageCode;

  sidebarCollapsed: boolean;
  activeRoute: string;

  setInitialized: (value: boolean) => void;

  setRequiresSetup: (value: boolean) => void;

  setAuthenticated: (
    user: User,
    session: AuthSession,
  ) => void;

  logout: () => void;

  setBusinessProfile: (
    profile: BusinessProfile | null,
  ) => void;

  setTheme: (theme: ThemeMode) => void;

  setLanguage: (language: LanguageCode) => void;

  toggleSidebar: () => void;

  setSidebarCollapsed: (collapsed: boolean) => void;

  setActiveRoute: (route: string) => void;

  resetApplication: () => void;
}

const initialState = {
  initialized: false,
  authenticated: false,
  requiresSetup: false,

  currentUser: null,
  session: null,

  businessProfile: null,

  theme: "light" as ThemeMode,
  language: "en" as LanguageCode,

  sidebarCollapsed: false,
  activeRoute: "/dashboard",
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,

  setInitialized: (value) => {
    set({ initialized: value });
  },

  setRequiresSetup: (value) => {
    set({ requiresSetup: value });
  },

  setAuthenticated: (user, session) => {
    set({
      authenticated: true,
      currentUser: user,
      session,
    });
  },

  logout: () => {
    set({
      authenticated: false,
      currentUser: null,
      session: null,
      activeRoute: "/login",
    });
  },

  setBusinessProfile: (profile) => {
    set({ businessProfile: profile });
  },

  setTheme: (theme) => {
    set({ theme });
  },

  setLanguage: (language) => {
    set({ language });
  },

  toggleSidebar: () => {
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  setActiveRoute: (route) => {
    set({ activeRoute: route });
  },

  resetApplication: () => {
    set(initialState);
  },
}));
