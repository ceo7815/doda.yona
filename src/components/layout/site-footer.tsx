import Link from "next/link";
import { Container } from "@/components/ui/container";
import { RESTAURANT } from "@/data/catalog";

type SiteFooterProps = {
  restaurantName: string;
};

const LEGAL_LINKS = [
  ["/privacy", "מדיניות פרטיות"],
  ["/terms", "תנאי שימוש"],
  ["/accessibility", "הצהרת נגישות"],
] as const;

export function SiteFooter({ restaurantName }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-auto border-t border-brand-800 bg-brand-900 text-brand-100 pb-[env(safe-area-inset-bottom,0px)]">
      <Container className="py-7 sm:py-9">
        <div className="flex flex-col items-center gap-5 text-center sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:text-start">
          <Link
            href="/"
            className="flex min-w-0 flex-col items-center sm:items-start sm:justify-self-start sm:text-start"
          >
            <span className="text-xl font-black tracking-tight text-gold-gradient sm:text-2xl lg:text-3xl">
              {restaurantName}
            </span>
            <span className="mt-0.5 max-w-[14rem] text-[0.7rem] font-medium leading-snug tracking-[0.04em] text-brand-100/90 sm:text-xs">
              {RESTAURANT.tagline}
            </span>
          </Link>

          <nav
            aria-label="מידע משפטי"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium sm:text-sm"
          >
            {LEGAL_LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="min-h-10 inline-flex items-center text-brand-200 transition-colors hover:text-gold-400"
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="max-w-xs text-center text-[0.7rem] leading-relaxed text-brand-400 sm:max-w-none sm:justify-self-end sm:text-end sm:text-xs">
            © {year} כל הזכויות שמורות ל
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
