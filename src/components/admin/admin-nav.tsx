"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Building2,
  FileText,
  Images,
  LayoutDashboard,
  Layers,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_NAV = [
  { href: "/admin", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/admin/products", label: "מנות", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "קטגוריות", icon: Layers },
  { href: "/admin/gallery", label: "גלריה", icon: Images },
  { href: "/admin/content", label: "טקסטים באתר", icon: FileText },
  { href: "/admin/business", label: "פרטי העסק ושעות", icon: Building2 },
  { href: "/admin/settings", label: "הזמנות והגדרות", icon: Settings },
] as const;

export function AdminNav({ variant }: { variant: "sidebar" | "bar" }) {
  const barRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const active = barRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    active?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  if (variant === "bar") {
    return (
      <nav ref={barRef} aria-label="תפריט ניהול" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-3">
        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition-colors",
                active ? "bg-gold-500 text-brand-900" : "bg-white/8 text-brand-100 hover:bg-white/12",
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="תפריט ניהול" className="flex flex-col gap-1">
      {ADMIN_NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[0.95rem] font-semibold transition-colors",
              active
                ? "bg-gold-500/15 text-gold-300"
                : "text-brand-100/85 hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon
              className={cn("size-[1.15rem]", active ? "text-gold-400" : "text-brand-300 group-hover:text-gold-400")}
              aria-hidden
            />
            {item.label}
            {active ? <span className="ms-auto h-5 w-1 rounded-full bg-gold-500" aria-hidden /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
