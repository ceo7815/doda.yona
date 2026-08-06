"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { MENU_ITEMS, type MenuItem } from "@/data/catalog";

export type CartLine = {
  slug: string;
  quantity: number;
};

type CartActions = {
  addItem: (slug: string, qty?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

type CartState = CartActions & {
  lines: CartLine[];
  totalItems: number;
  getLineItems: () => Array<{ item: MenuItem; quantity: number }>;
};

const STORAGE_KEY = "doda-yona-cart-v1";

type Snapshot = CartLine[];

/** חייב להיות reference קבוע — אחרת useSyncExternalStore נכנס ללולאה */
const EMPTY_SNAPSHOT: Snapshot = [];

let memoryLines: Snapshot = EMPTY_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function readStorage(): Snapshot {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SNAPSHOT;
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return EMPTY_SNAPSHOT;
    const filtered = parsed.filter(
      (l) => typeof l.slug === "string" && typeof l.quantity === "number",
    );
    return filtered.length === 0 ? EMPTY_SNAPSHOT : filtered;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function writeStorage(lines: Snapshot) {
  memoryLines = lines.length === 0 ? EMPTY_SNAPSHOT : lines;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryLines));
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Snapshot {
  return memoryLines;
}

function getServerSnapshot(): Snapshot {
  return EMPTY_SNAPSHOT;
}

const CartContext = createContext<CartState | null>(null);
const CartActionsContext = createContext<CartActions | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    memoryLines = readStorage();
    emit();

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      memoryLines = readStorage();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((slug: string, qty = 1) => {
    const current = [...memoryLines];
    const existing = current.find((l) => l.slug === slug);
    if (existing) {
      writeStorage(
        current.map((l) =>
          l.slug === slug ? { ...l, quantity: l.quantity + qty } : l,
        ),
      );
      return;
    }
    writeStorage([...current, { slug, quantity: qty }]);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const current = [...memoryLines];
    if (quantity <= 0) {
      writeStorage(current.filter((l) => l.slug !== slug));
      return;
    }
    writeStorage(
      current.map((l) => (l.slug === slug ? { ...l, quantity } : l)),
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    writeStorage(memoryLines.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => writeStorage(EMPTY_SNAPSHOT), []);

  const getLineItems = useCallback(() => {
    return lines
      .map((line) => {
        const item = MENU_ITEMS.find((m) => m.slug === line.slug);
        if (!item) return null;
        return { item, quantity: line.quantity };
      })
      .filter((x): x is { item: MenuItem; quantity: number } => Boolean(x));
  }, [lines]);

  const actions = useMemo<CartActions>(
    () => ({ addItem, setQuantity, removeItem, clear }),
    [addItem, setQuantity, removeItem, clear],
  );

  const value = useMemo<CartState>(
    () => ({
      lines,
      ...actions,
      totalItems: lines.reduce((sum, l) => sum + l.quantity, 0),
      getLineItems,
    }),
    [lines, actions, getLineItems],
  );

  return (
    <CartActionsContext.Provider value={actions}>
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    </CartActionsContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart חייב להיות בתוך CartProvider");
  }
  return ctx;
}

/** פעולות בלבד — לא גורם לרינדור מחדש כשהסל משתנה */
export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) {
    throw new Error("useCartActions חייב להיות בתוך CartProvider");
  }
  return ctx;
}
