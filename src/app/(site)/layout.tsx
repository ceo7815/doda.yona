import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { AccessibilityFab } from "@/components/accessibility/accessibility-fab";
import { CartProvider } from "@/stores/cart";
import { getRestaurantName } from "@/lib/env";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurantName = getRestaurantName();

  return (
    <CartProvider>
      <AccessibilityProvider>
        <div className="site-shell flex min-h-full flex-1 flex-col">
          <a href="#main-content" className="skip-link">
            דלג לתוכן הראשי
          </a>
          <SiteHeader restaurantName={restaurantName} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter restaurantName={restaurantName} />
        </div>
        <AccessibilityFab />
      </AccessibilityProvider>
    </CartProvider>
  );
}
