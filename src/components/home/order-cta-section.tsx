import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { RESTAURANT } from "@/data/catalog";

const ORDER_STEPS = [
  {
    label: "משלוחים",
    detail: "עד הבית באזורי המשלוח",
  },
  {
    label: "לקחת",
    detail: "איסוף מהמסעדה בזמן שנוח לכם",
  },
  {
    label: "אכילה במקום",
    detail: "בהזמנה מראש",
  },
] as const;

export function OrderCtaSection() {
  return (
    <section className="surface-paper border-t border-border py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[1.5rem] border border-brand-900/10 bg-brand-900/[0.03] px-4 py-7 shadow-[var(--shadow-sm)] sm:rounded-[1.75rem] sm:px-10 sm:py-9">
          <div className="flex flex-col items-center text-center">
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold-700">
              איך מזמינים
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-brand-900 sm:text-3xl">
              משלוח · איסוף · שולחן
            </h2>
            <GoldFlourish className="mt-3" />
          </div>

          <ul className="mt-6 grid gap-4 divide-y divide-brand-900/10 sm:mt-7 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0 sm:divide-brand-900/10">
            {ORDER_STEPS.map((step, index) => (
              <li
                key={step.label}
                className="flex flex-col items-center px-2 py-3 text-center first:pt-0 last:pb-0 sm:px-5 sm:py-0"
              >
                <span className="text-[0.65rem] font-bold tracking-[0.18em] text-gold-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 text-base font-extrabold text-brand-900 sm:text-lg">
                  {step.label}
                </h3>
                <p className="mt-1 text-sm font-light leading-snug text-ink-muted">
                  {step.detail}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col items-center gap-3 text-center sm:mt-8">
            <Link href="/menu" className="btn-deep w-full max-w-xs px-9">
              הזמינו עכשיו
            </Link>
            <p className="text-xs font-medium text-ink-muted sm:text-sm">
              {RESTAURANT.locationLabel}
              <span className="mx-2 text-gold-600" aria-hidden>
                ·
              </span>
              <Link
                href="/contact"
                className="text-gold-700 underline-offset-4 transition-colors hover:text-brand-900 hover:underline"
              >
                איך מגיעים
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
