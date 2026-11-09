import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Rubik } from "next/font/google";
import "./globals.css";
import { getRestaurantName } from "@/lib/env";
import { RESTAURANT } from "@/data/catalog";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
  // גופן משתנה (variable) — קובץ אחד לכל המשקלים במקום 7 קבצים
});

const restaurantName = getRestaurantName();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f140c",
};

export const metadata: Metadata = {
  title: {
    default: `${restaurantName} — ${RESTAURANT.tagline}`,
    template: `%s | ${restaurantName}`,
  },
  description: `${RESTAURANT.tagline} ב${RESTAURANT.locationLabel}. ${RESTAURANT.kashrut}. משלוחים, איסוף עצמי וישיבה במקום.`,
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  openGraph: {
    locale: "he_IL",
    type: "website",
    siteName: restaurantName,
    title: `${restaurantName} — ${RESTAURANT.tagline}`,
    description: `מסעדה תימנית ב${RESTAURANT.locationLabel}. ${RESTAURANT.kashrutShort}.`,
    images: [{ url: "/brand/home-hero.webp", width: 1024, height: 524 }],
  },
  alternates: { canonical: "/" },
  robots:
    process.env.NEXT_PUBLIC_NOINDEX === "1"
      ? { index: false, follow: false }
      : undefined,
};

const a11yBootScript = `
document.documentElement.classList.add("js");
try {
  var raw = localStorage.getItem("doda-yona-a11y-v1");
  if (raw) {
    var s = JSON.parse(raw);
    var h = document.documentElement;
    if (s.fontStep) h.setAttribute("data-a11y-font", String(s.fontStep));
    if (s.contrast && s.contrast !== "default") h.setAttribute("data-a11y-contrast", s.contrast);
    if (s.highlightLinks) h.classList.add("a11y-highlight-links");
    if (s.underlineLinks) h.classList.add("a11y-underline-links");
    if (s.readableFont) h.classList.add("a11y-readable-font");
    if (s.stopAnimations) h.classList.add("a11y-stop-animations");
    if (s.bigCursor) h.classList.add("a11y-big-cursor");
    if (s.largeSpacing) h.classList.add("a11y-large-spacing");
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${rubik.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Script id="a11y-boot" strategy="beforeInteractive">
          {a11yBootScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
