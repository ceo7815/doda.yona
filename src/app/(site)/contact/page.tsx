import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/brand/page-hero";
import { GoldFlourish } from "@/components/brand/ornaments";
import { RESTAURANT } from "@/data/catalog";

export const metadata: Metadata = {
  title: "צרו קשר",
  description: `צרו קשר עם ${RESTAURANT.name} — ${RESTAURANT.addressFull}.`,
};

const DETAILS = [
  { label: "כתובת", value: RESTAURANT.addressFull, note: RESTAURANT.locationLabel },
  { label: "שירותים", value: RESTAURANT.services.join(" · ") },
  { label: "כשרות", value: RESTAURANT.kashrut },
  { label: "טלפון", value: "יעודכן בקרוב" },
  { label: "שעות פעילות", value: "יעודכנו בקרוב" },
  { label: "הערה", value: RESTAURANT.dineInNote },
] as const;

export default function ContactPage() {
  const mapsQuery = encodeURIComponent(RESTAURANT.mapsQuery);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${mapsQuery}&navigate=yes`;

  return (
    <div>
      <PageHero
        priority
        title="צרו קשר"
        subtitle={`${RESTAURANT.addressFull} · ${RESTAURANT.locationLabel}`}
      />

      <div className="surface-paper w-full px-3 py-8 sm:px-6 sm:py-14 lg:px-8 xl:px-10">
        <Container className="max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-gold-700">
              {RESTAURANT.name}
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-brand-900 sm:text-3xl">
              פרטי המסעדה
            </h2>
            <GoldFlourish className="mx-auto mt-3" />
            <p className="mt-4 text-sm font-light leading-relaxed text-ink-muted sm:text-base">
              נשמח לארח אתכם בכרם התימנים — למשלוח, לאיסוף, או לאכילה במקום
              בהזמנה מראש.
            </p>
          </div>

          <ul className="mx-auto mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5">
            {DETAILS.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-border/80 bg-surface-elevated px-4 py-3.5 text-center shadow-[var(--shadow-card)] sm:px-5 sm:py-4 sm:text-start"
              >
                <p className="text-[0.68rem] font-bold tracking-[0.18em] text-gold-700">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm font-extrabold text-brand-900 sm:mt-2 sm:text-base">
                  {item.value}
                </p>
                {"note" in item && item.note ? (
                  <p className="mt-1 text-sm font-light text-ink-muted">
                    {item.note}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col items-stretch gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-deep w-full px-7 sm:w-auto"
            >
              ניווט ב-Waze
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-lg)] border border-brand-900/15 bg-surface-elevated px-7 text-sm font-bold text-brand-900 transition-colors hover:border-gold-500/40 hover:bg-brand-50 sm:w-auto"
            >
              Google Maps
            </a>
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-brand-900/10 bg-brand-900 px-5 py-8 text-center shadow-[var(--shadow-md)] sm:mt-12 sm:rounded-[1.75rem] sm:px-10 sm:py-9">
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold-500">
              הזמנות אונליין
            </p>
            <h3 className="mt-2 text-xl font-black text-gold-400 sm:text-2xl">
              רוצים להזמין?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-brand-200">
              הוסיפו מנות לסל ואשרו הזמנה אונליין — משלוח או איסוף עצמי.
            </p>
            <Link href="/menu" className="btn-gold mt-6 inline-flex w-full max-w-xs justify-center px-9 sm:mt-7">
              לתפריט ולהזמנה
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
