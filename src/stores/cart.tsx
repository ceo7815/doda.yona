"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  buildCartLineKey,
  calcAddonTotalAgorot,
  formatAddonSummary,
} from "@/data/addons";
import { MENU_ITEMS, type MenuItem } from "@/data/catalog";

export type CartLine = {
  lineKey: string;
  slug: string;
  quantity: number;
  freeAddonIds: string[];
  paidAddonIds: string[];
};

export type CartLineView = {
  lineKey: string;
  item: MenuItem;
  quantity: number;
  freeAddonIds: string[];
  paidAddonIds: string[];
  addonNotes: string;
  addonTotalAgorot: number;
  lineTotalAgorot: number;
};

type AddItemOptions = {
  freeAddonIds?: string[];
  paidAddonIds?: string[];
};

type CartActions = {
  addItem: (slug: string, qty?: number, options?: AddItemOptions) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clear: () => void;
};

type CartState = CartActions & {
  lines: CartLine[];
  totalItems: number;
  getLineItems: () => CartLineView[];
};

const STORAGE_KEY = "doda-yona-cart-v2";

type Snapshot = CartLine[];

const EMPTY_SNAPSHOT: Snapshot = [];

let memoryLines: Snapshot = EMPTY_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function normalizeLine(raw: Partial<CartLine> & { slug?: string }): CartLine | null {
  if (typeof raw.slug !== "string" || typeof raw.quantity !== "number") {
    return null;
  }
  const freeAddonIds = Array.isArray(raw.freeAddonIds) ? raw.freeAddonIds : [];
  const paidAddonIds = Array.isArray(raw.paidAddonIds) ? raw.paidAddonIds : [];
  const lineKey =
    typeof raw.lineKey === "string"
      ? raw.lineKey
      : buildCartLineKey(raw.slug, freeAddonIds, paidAddonIds);

  return {
    lineKey,
    slug: raw.slug,
    quantity: raw.quantity,
    freeAddonIds,
    paidAddonIds,
  };
}

function readStorage(): Snapshot {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    const keys = [STORAGE_KEY, "doda-yona-cart-v1"];
    for (const key of keys) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Array<Partial<CartLine> & { slug?: string }>;
      if (!Array.isArray(parsed)) continue;
      const filtered = parsed
        .map(normalizeLine)
        .filter((line): line is CartLine => Boolean(line));
      if (filtered.length === 0) return EMPTY_SNAPSHOT;
      return filtered;
    }
    return EMPTY_SNAPSHOT;
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
      if (e.key !== STORAGE_KEY && e.key !== "doda-yona-cart-v1") return;
      memoryLines = readStorage();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback(
    (slug: string, qty = 1, options?: AddItemOptions) => {
      const freeAddonIds = options?.freeAddonIds ?? [];
      const paidAddonIds = options?.paidAddonIds ?? [];
      const lineKey = buildCartLineKey(slug, freeAddonIds, paidAddonIds);
      const current = [...memoryLines];
      const existing = current.find((l) => l.lineKey === lineKey);

      if (existing) {
        writeStorage(
          current.map((l) =>
            l.lineKey === lineKey
              ? { ...l, quantity: l.quantity + qty }
              : l,
          ),
        );
        return;
      }

      writeStorage([
        ...current,
        { lineKey, slug, quantity: qty, freeAddonIds, paidAddonIds },
      ]);
    },
    [],
  );

  const setQuantity = useCallback((lineKey: string, quantity: number) => {
    const current = [...memoryLines];
    if (quantity <= 0) {
      writeStorage(current.filter((l) => l.lineKey !== lineKey));
      return;
    }
    writeStorage(
      current.map((l) => (l.lineKey === lineKey ? { ...l, quantity } : l)),
    );
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    writeStorage(memoryLines.filter((l) => l.lineKey !== lineKey));
  }, []);

  const clear = useCallback(() => writeStorage(EMPTY_SNAPSHOT), []);

  const getLineItems = useCallback((): CartLineView[] => {
    return lines
      .map((line) => {
        const item = MENU_ITEMS.find((m) => m.slug === line.slug);
        if (!item) return null;
        const addonTotalAgorot = calcAddonTotalAgorot(line.paidAddonIds);
        const unitPrice = (item.priceAgorot ?? 0) + addonTotalAgorot;
        return {
          lineKey: line.lineKey,
          item,
          quantity: line.quantity,
          freeAddonIds: line.freeAddonIds,
          paidAddonIds: line.paidAddonIds,
          addonNotes: formatAddonSummary(line.freeAddonIds, line.paidAddonIds),
          addonTotalAgorot,
          lineTotalAgorot: unitPrice * line.quantity,
        };
      })
      .filter((x): x is CartLineView => Boolean(x));
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

export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) {
    throw new Error("useCartActions חייב להיות בתוך CartProvider");
  }
  return ctx;
}
