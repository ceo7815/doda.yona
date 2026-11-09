import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { RestaurantJsonLd } from "@/components/seo/restaurant-json-ld";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { AccessibilityFab } from "@/components/accessibility/accessibility-fab";
import { getRestaurantName } from "@/lib/env";
import { getOrderLink, toTelHref, toWhatsAppHref } from "@/lib/site-settings";
import { getSiteSettings } from "@/services/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = settings.seo.description;
  return description
    ? { description, openGraph: { description } }
    : {};
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurantName = getRestaurantName();
  const settings = await getSiteSettings();
  const order = getOrderLink(settings);
  const telHref = toTelHref(settings.business.phoneDisplay);
  const whatsappHref = settings.business.whatsapp
    ? toWhatsAppHref(settings.business.whatsapp)
    : null;

  return (
    <AccessibilityProvider>
      <div className="site-shell flex min-h-full flex-1 flex-col">
        <a href="#main-content" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <SiteHeader
          restaurantName={restaurantName}
          order={order}
          telHref={telHref}
          phoneDisplay={settings.business.phoneDisplay}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter restaurantName={restaurantName} settings={settings} />
        <MobileActionBar
          order={order}
          telHref={telHref}
          whatsappHref={whatsappHref}
        />
      </div>
      <AccessibilityFab />
      <RestaurantJsonLd settings={settings} restaurantName={restaurantName} />
    </AccessibilityProvider>
  );
}
