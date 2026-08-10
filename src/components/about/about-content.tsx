import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { ABOUT_PAGE } from "@/data/catalog";

type AboutContentProps = {
  content: typeof ABOUT_PAGE;
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-10 text-lg font-extrabold tracking-tight text-brand-900 first:mt-0 sm:mt-12 sm:text-xl">
      {children}
    </h3>
  );
}

function CenteredList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mx-auto mt-4 max-w-lg space-y-2 sm:mt-5">
      {items.map((item) => (
        <li
          key={item}
          className="text-sm leading-relaxed text-ink-muted sm:text-base"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AboutContent({ content }: AboutContentProps) {
  return (
    <section className="surface-paper py-10 sm:py-14">
      <Container>
        <article className="story-prose mx-auto max-w-2xl rounded-[1.75rem] border border-border/80 bg-surface-elevated px-5 py-8 text-center shadow-[var(--shadow-sm)] sm:px-10 sm:py-12">
          <p className="text-sm font-bold tracking-[0.16em] text-gold-700 sm:text-base">
            {content.heroSubtitle}
          </p>

          <h2 className="mt-3 text-xl font-black leading-snug tracking-tight text-brand-900 sm:text-2xl">
            {content.tagline}
          </h2>

          <GoldFlourish className="mx-auto mt-4" />

          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-[1.9] text-ink-muted sm:mt-6 sm:text-base">
            {content.intro}
          </p>

          <div className="gold-rule mx-auto mt-8 w-16 sm:mt-10" aria-hidden />

          <SectionHeading>{content.soups.title}</SectionHeading>
          <CenteredList items={content.soups.items} />
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-brand-800 sm:mt-5 sm:text-base">
            {content.soups.note}
          </p>

          <SectionHeading>{content.pastries.title}</SectionHeading>
          <CenteredList items={content.pastries.items} />

          {content.infoSections.map((section) => (
            <div key={section.title}>
              <SectionHeading>{section.title}</SectionHeading>
              <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-ink-muted sm:text-base">
                {section.body}
              </p>
            </div>
          ))}

          <SectionHeading>{content.onlineOrdering.title}</SectionHeading>
          <ul className="mx-auto mt-4 inline-flex flex-col items-center gap-2 sm:mt-5">
            {content.onlineOrdering.items.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-900 sm:text-base"
              >
                <Check className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <SectionHeading>{content.catering.title}</SectionHeading>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-ink-muted sm:text-base">
            {content.catering.body}
          </p>

          <div className="gold-rule mx-auto mt-10 w-16 sm:mt-12" aria-hidden />

          <p className="mt-8 text-xl font-black text-brand-900 sm:mt-10 sm:text-2xl">
            {content.closingTitle}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-ink-muted sm:text-base">
            {content.closingBody}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
            <Link href="/menu" className="btn-gold min-h-12 w-full max-w-xs px-8 sm:w-auto">
              לתפריט והזמנה
            </Link>
            <Link
              href="/contact"
              className="btn-ghost-gold min-h-12 w-full max-w-xs px-8 sm:w-auto"
            >
              צרו קשר
            </Link>
          </div>
        </article>
      </Container>
    </section>
  );
}
