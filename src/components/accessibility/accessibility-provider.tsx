"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  A11Y_STORAGE_KEY,
  DEFAULT_A11Y,
  applyA11yToDocument,
  type A11ySettings,
} from "@/components/accessibility/a11y-types";

type A11yContextValue = {
  settings: A11ySettings;
  setSettings: (next: Partial<A11ySettings>) => void;
  reset: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

function readStored(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT_A11Y;
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y;
    return { ...DEFAULT_A11Y, ...JSON.parse(raw) } as A11ySettings;
  } catch {
    return DEFAULT_A11Y;
  }
}

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettingsState] = useState<A11ySettings>(DEFAULT_A11Y);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    setSettingsState(stored);
    applyA11yToDocument(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyA11yToDocument(settings);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings, hydrated]);

  useEffect(() => {
    if (!panelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  const setSettings = useCallback((next: Partial<A11ySettings>) => {
    setSettingsState((prev) => ({ ...prev, ...next }));
  }, []);

  const reset = useCallback(() => {
    setSettingsState(DEFAULT_A11Y);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      reset,
      panelOpen,
      setPanelOpen,
    }),
    [settings, setSettings, reset, panelOpen],
  );

  return (
    <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(A11yContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
