import type { MenuCategoryId, MenuItem } from "@/data/catalog";

export type MenuAddon = {
  id: string;
  name: string;
  /** 0 = תוספת על חשבון הבית */
  priceAgorot: number;
};

export const FREE_HOUSE_ADDONS: MenuAddon[] = [
  { id: "hilba", name: "חילבה", priceAgorot: 0 },
  { id: "schug", name: "סחוג", priceAgorot: 0 },
  { id: "lachuh", name: "לחוח", priceAgorot: 0 },
  { id: "saluf", name: "סלוף", priceAgorot: 0 },
  { id: "vegetables", name: "ירקות", priceAgorot: 0 },
  { id: "eggs", name: "ביצים", priceAgorot: 0 },
  { id: "tomato-dip", name: "רסק עגבניות", priceAgorot: 0 },
];

export const PAID_ADDONS: MenuAddon[] = [
  { id: "extra-egg", name: "ביצה נוספת", priceAgorot: 500 },
  { id: "couscous", name: "קוסקוס", priceAgorot: 800 },
  { id: "rice", name: "אורז", priceAgorot: 800 },
  { id: "salad", name: "סלט ירקות", priceAgorot: 1200 },
  { id: "pita", name: "פיתה", priceAgorot: 400 },
];

const addonMap = new Map<string, MenuAddon>(
  [...FREE_HOUSE_ADDONS, ...PAID_ADDONS].map((addon) => [addon.id, addon]),
);

const CATEGORY_FREE_IDS: Record<MenuCategoryId, string[]> = {
  soups: ["hilba", "schug", "lachuh", "saluf", "vegetables"],
  mains: ["vegetables"],
  pastries: ["eggs", "schug", "tomato-dip"],
  sides: ["schug", "tomato-dip"],
};

const CATEGORY_PAID_IDS: Record<MenuCategoryId, string[]> = {
  soups: ["extra-egg", "couscous", "rice", "salad"],
  mains: ["couscous", "rice", "salad", "extra-egg"],
  pastries: ["extra-egg", "salad"],
  sides: ["salad", "pita"],
};

function resolveCategoryId(categoryId: MenuItem["categoryId"]): MenuCategoryId {
  if (
    categoryId === "soups" ||
    categoryId === "mains" ||
    categoryId === "pastries" ||
    categoryId === "sides"
  ) {
    return categoryId;
  }
  return "soups";
}

export function getAddonsByIds(ids: string[]): MenuAddon[] {
  return ids
    .map((id) => addonMap.get(id))
    .filter((addon): addon is MenuAddon => Boolean(addon));
}

export function getItemFreeAddons(item: MenuItem): MenuAddon[] {
  const categoryId = resolveCategoryId(item.categoryId);
  const ids = item.freeAddonIds?.length
    ? item.freeAddonIds
    : CATEGORY_FREE_IDS[categoryId];
  return getAddonsByIds(ids);
}

export function getItemPaidAddons(item: MenuItem): MenuAddon[] {
  const categoryId = resolveCategoryId(item.categoryId);
  const ids = item.paidAddonIds?.length
    ? item.paidAddonIds
    : CATEGORY_PAID_IDS[categoryId];
  return getAddonsByIds(ids);
}

export function formatAddonSummary(
  freeIds: string[],
  paidIds: string[],
): string {
  const names = [
    ...getAddonsByIds(freeIds).map((a) => a.name),
    ...getAddonsByIds(paidIds).map((a) => a.name),
  ];
  return names.length > 0 ? names.join(" · ") : "";
}

export function calcAddonTotalAgorot(paidIds: string[]): number {
  return getAddonsByIds(paidIds).reduce((sum, addon) => sum + addon.priceAgorot, 0);
}

export function buildCartLineKey(
  slug: string,
  freeIds: string[],
  paidIds: string[],
): string {
  const free = [...freeIds].sort().join(",");
  const paid = [...paidIds].sort().join(",");
  return `${slug}::${free}::${paid}`;
}
