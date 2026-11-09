import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { SocialLinks } from "@/components/site/social-links";
import { HoursList } from "@/components/site/hours-list";
import { RESTAURANT } from "@/data/catalog";
import {
  getAddressFull,
  getLocationLabel,
  toTelHref,
  type SiteSettings,
} from "@/lib/site-settings";

type SiteFooterProps = {
  restaurantName: string;
  settings: SiteSettings;
};

const LEGAL_LINKS = [
  ["/privacy", "מדיניות פרטיות"],
  ["/terms", "תנאי שימוש"],
  ["/accessibility", "הצהרת נגישות"],
] as const;

export function SiteFooter({ restaurantName, settings }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const address = getAddressFull(settings);

  return (
    <footer className="no-print mt-auto bg-brand-900 text-brand-100 pb-[calc(var(--mobile-order-bar)+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <div className="h-px bg-gradient-to-l from-transparent via-gold-500/50 to-transparent" aria-hidden />
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 text-center sm:grid-cols-2 sm:text-start lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/" className="text-3xl font-black tracking-tight text-gold-gradient">
              {restaurantName}
            </Link>
            <p className="mt-1.5 text-sm font-medium text-brand-200">{RESTAURANT.tagline}</p>
            <GoldFlourish className="mt-4 h-4 w-28 text-gold-500/70" />
            <p className="mt-4 text-sm text-brand-300">{settings.business.kashrut}</p>
            <SocialLinks social={settings.social} className="mt-5" />
          </div>

          <div>
            <h2 className="footer-heading">ניווט</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">ביקור והזמנות</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {address ? (
                <li className="flex items-start justify-center gap-2 sm:justify-start">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
                  <span>
                    {address}
                    <span className="block text-brand-300">{getLocationLabel(settings)}</span>
                  </span>
                </li>
              ) : null}
              <li>
                <a
                  href={toTelHref(settings.business.phoneDisplay)}
                  className="inline-flex items-center gap-2 font-bold text-gold-300 transition-colors hover:text-gold-400"
                >
                  <Phone className="size-4" aria-hidden />
                  <span dir="ltr">{settings.business.phoneDisplay}</span>
                </a>
              </li>
              {settings.business.email ? (
                <li>
                  <a href={`mailto:${settings.business.email}`} className="footer-link" dir="ltr">
                    {settings.business.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">שעות פעילות</h2>
            <HoursList
              hours={settings.hours}
              note={settings.hoursNote}
              telHref={toTelHref(settings.business.phoneDisplay)}
              tone="dark"
              className="mt-4"
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-xs text-brand-300 sm:flex-row sm:justify-between">
          <nav aria-label="מידע משפטי" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="transition-colors hover:text-gold-400">
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-center">
            © {year} {restaurantName} · כל הזכויות שמורות · פיתוח:{" "}
            <a
              href="https://hub.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              האב מערכות מתקדמות בע״מ
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
