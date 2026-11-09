import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/brand/page-hero";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div>
      <PageHero title="תנאי שימוש" />
      <Container className="surface-paper max-w-3xl py-14">
        <p className="font-light leading-relaxed text-ink-muted">
          האתר מציג מידע על המסעדה ועל המנות. ההזמנות, המחירים והתשלום מתבצעים
          במערכת ההזמנות של המסעדה או בטלפון, וכפופים לתנאים המוצגים שם ולזמינות
          המנות. תמונות המנות להמחשה בלבד.
        </p>
      </Container>
    </div>
  );
}
