import type { Metadata } from "next";
import { BadgeCheck, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/brand/page-hero";
import { SectionHeading } from "@/components/brand/ornaments";
import { OrderButton } from "@/components/site/order-button";
import { HoursList } from "@/components/site/hours-list";
import { SocialLinks } from "@/components/site/social-links";
import { MapEmbed } from "@/components/site/map-embed";
import { Reveal } from "@/components/site/reveal";
import { RESTAURANT } from "@/data/catalog";
import {
  getAddressFull,
  getLocationLabel,
  getOrderLink,
  toTelHref,
  toWhatsAppHref,
} from "@/lib/site-settings";
import { getSiteSettings } from "@/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "צרו קשר",
  description: `צרו קשר עם ${RESTAURANT.name} — ${RESTAURANT.addressFull}. טלפון ${RESTAURANT.phoneDisplay}.`,
  alternates: { canonical: "/contact" },
};

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full gap-4 rounded-2xl border border-border/80 bg-surface-elevated p-5 shadow-[var(--shadow-card)]">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-900 text-gold-400">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-bold tracking-[0.16em] text-gold-700">{title}</h3>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const order = getOrderLink(settings);
  const address = getAddressFull(settings);
  const mapsQuery = encodeURIComponent(address || RESTAURANT.mapsQuery);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${mapsQuery}&navigate=yes`;
  const telHref = toTelHref(settings.business.phoneDisplay);
  const whatsappHref = settings.business.whatsapp ? toWhatsAppHref(settings.business.whatsapp) : null;

  return (
    <div>
      <PageHero priority eyebrow={RESTAURANT.name} title="צרו קשר" subtitle={`${address} · ${getLocationLabel(settings)}`} />

      <div className="surface-paper section-y">
        <Container className="max-w-5xl">
          <Reveal>
            <SectionHeading
              title="נשמח לארח אתכם"
              subtitle={`בכרם התימנים — למשלוח, לאיסוף, או לאכילה במקום. ${settings.business.dineInNote}`}
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Reveal>
              <Card icon={MapPin} title="כתובת">
                <p className="text-lg font-extrabold text-brand-900">{address}</p>
                <p className="text-sm text-ink-muted">{getLocationLabel(settings)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="chip-link">
                    <Navigation className="size-3.5" aria-hidden />
                    Waze
                  </a>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="chip-link">
                    <MapPin className="size-3.5" aria-hidden />
                    Google Maps
                  </a>
                </div>
              </Card>
            </Reveal>
            <Reveal delay={80}>
              <Card icon={Phone} title="טלפון">
                <a href={telHref} className="text-2xl font-black tracking-wide text-brand-900 hover:text-gold-700" dir="ltr">
                  {settings.business.phoneDisplay}
                </a>
                <div className="mt-3 flex flex-wrap gap-2">
                  {whatsappHref ? (
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="chip-link">
                      <MessageCircle className="size-3.5" aria-hidden />
                      וואטסאפ
                    </a>
                  ) : null}
                  {settings.business.email ? (
                    <a href={`mailto:${settings.business.email}`} className="chip-link" dir="ltr">
                      <Mail className="size-3.5" aria-hidden />
                      {settings.business.email}
                    </a>
                  ) : null}
                </div>
              </Card>
            </Reveal>
            <Reveal delay={120}>
              <Card icon={BadgeCheck} title="כשרות ושירותים">
                <p className="font-extrabold text-brand-900">{settings.business.kashrut}</p>
                <p className="mt-1 text-sm text-ink-muted">{RESTAURANT.services.join(" · ")}</p>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card icon={Clock} title="שעות פעילות">
                <HoursList hours={settings.hours} note={settings.hoursNote} telHref={telHref} />
              </Card>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <MapEmbed query={address || RESTAURANT.mapsQuery} title={`מפה — ${address}`} />
          </Reveal>

          <Reveal className="mt-12">
            <div className="mx-auto max-w-2xl rounded-[1.75rem] bg-brand-900 px-6 py-9 text-center shadow-[var(--shadow-lg)] sm:px-10">
              <p className="eyebrow text-gold-500">רוצים להזמין?</p>
              <h2 className="mt-2 text-2xl font-black text-gold-300 sm:text-3xl">משלוח · איסוף · שולחן</h2>
              <div className="mt-6 flex justify-center">
                <OrderButton order={order} className="min-h-12 w-full max-w-xs px-9" />
              </div>
              <SocialLinks social={settings.social} className="mt-6 justify-center" />
            </div>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}
