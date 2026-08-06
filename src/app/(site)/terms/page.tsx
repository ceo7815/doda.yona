import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/brand/page-hero";

export const metadata: Metadata = {
  title: "תנאי שימוש",
};

export default function TermsPage() {
  return (
    <div>
      <PageHero title="תנאי שימוש" />
      <Container className="surface-paper max-w-3xl py-14">
        <p className="font-light leading-relaxed text-ink-muted">
          טיוטה: השימוש באתר וביצוע הזמנות כפופים לאישור פרטי ההזמנה, זמינות מנות
          ותנאי המשלוח. נוסח משפטי מלא יוחלף באישור הלקוח.
        </p>
      </Container>
    </div>
  );
}
