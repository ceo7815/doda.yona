import Link from "next/link";
import { Bike, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/brand/ornaments";
import { OrderButton } from "@/components/site/order-button";
import { HoursList } from "@/components/site/hours-list";
import { Reveal } from "@/components/site/reveal";
import {
  getAddressFull,
  getLocationLabel,
  toTelHref,
  type OrderLink,
  type SiteSettings,
} from "@/lib/site-settings";

const WAYS = [
  { icon: Bike, label: "משלוחים", detail: "עד הבית, לנתניה והסביבה" },
  { icon: ShoppingBag, label: "לקחת", detail: "איסוף מהמסעדה בזמן שנוח לכם" },
  { icon: UtensilsCrossed, label: "אכילה במקום", detail: "בהזמנה מראש" },
] as const;

export function OrderCtaSection({
  settings,
  order,
}: {
  settings: SiteSettings;
  order: OrderLink;
}) {
  const telHref = toTelHref(settings.business.phoneDisplay);
  return (
    <section className="surface-deep section-y text-brand-50" aria-labelledby="order-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="order-title"
            tone="dark"
            eyebrow="איך מזמינים"
            title={settings.home.orderTitle}
            subtitle={settings.home.orderSubtitle}
          />
        </Reveal>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3 sm:gap-5">
          {WAYS.map((way, index) => (
            <Reveal as="li" key={way.label} delay={index * 90}>
              <div className="flex h-full flex-row items-center gap-4 rounded-2xl border border-gold-500/20 bg-white/[0.03] px-5 py-4 text-start sm:flex-col sm:px-6 sm:py-7 sm:text-center">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-500/12 text-gold-400 ring-1 ring-gold-500/30">
                  <way.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-gold-300">{way.label}</h3>
                  <p className="mt-0.5 text-sm font-light text-brand-200">{way.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <OrderButton order={order} className="min-h-13 w-full max-w-xs px-9 text-base sm:w-auto" />
          <a href={telHref} className="btn-ghost-gold min-h-13 w-full max-w-xs px-9 text-base sm:w-auto">
            <span dir="ltr">{settings.business.phoneDisplay}</span>
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 border-t border-white/10 pt-10 sm:grid-cols-2">
          <div className="text-center sm:text-start">
            <h3 className="text-sm font-bold tracking-[0.18em] text-gold-500">כתובת</h3>
            <p className="mt-2 text-lg font-bold text-brand-50">{getAddressFull(settings)}</p>
            <p className="text-sm text-brand-300">{getLocationLabel(settings)}</p>
            <Link
              href="/contact"
              className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-gold-400 underline-offset-4 hover:underline"
            >
              ניווט ופרטי הגעה
            </Link>
          </div>
          <div className="text-center sm:text-start">
            <h3 className="text-sm font-bold tracking-[0.18em] text-gold-500">שעות פעילות</h3>
            <HoursList
              hours={settings.hours}
              note={settings.hoursNote}
              telHref={telHref}
              tone="dark"
              className="mt-2"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
