import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { OrderButton } from "@/components/site/order-button";
import { Reveal } from "@/components/site/reveal";
import { ABOUT_PAGE } from "@/data/catalog";
import type { OrderLink, SiteSettings } from "@/lib/site-settings";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="border-t border-border/70 pt-9 first:border-0 first:pt-0">
      <h3 className="text-xl font-extrabold tracking-tight text-brand-900 sm:text-2xl">{title}</h3>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="mx-auto grid max-w-xl gap-2 text-start sm:grid-cols-2 sm:gap-x-8">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AboutContent({
  about,
  order,
}: {
  about: SiteSettings["about"];
  order: OrderLink;
}) {
  return (
    <section className="surface-paper section-y">
      <Container>
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-border/80 bg-surface-elevated px-5 py-10 text-center shadow-[var(--shadow-card)] sm:px-14 sm:py-16">
          <Reveal>
            <p className="eyebrow text-gold-700">{about.subtitle}</p>
            <h2 className="mt-3 text-balance text-2xl font-black leading-snug tracking-tight text-brand-900 sm:text-4xl">
              {about.tagline}
            </h2>
            <GoldFlourish className="mx-auto mt-5" />
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base font-light leading-[2] text-ink-muted sm:text-lg">
              {about.intro}
            </p>
          </Reveal>

          <div className="mt-12 space-y-9">
            {about.soupsItems.length > 0 ? (
              <Block title={about.soupsTitle}>
                <ItemList items={about.soupsItems} />
                {about.soupsNote ? (
                  <p className="mx-auto mt-5 max-w-xl rounded-xl bg-gold-500/10 px-4 py-3 text-sm font-medium leading-relaxed text-brand-800 sm:text-base">
                    {about.soupsNote}
                  </p>
                ) : null}
              </Block>
            ) : null}

            {about.pastriesItems.length > 0 ? (
              <Block title={about.pastriesTitle}>
                <ItemList items={about.pastriesItems} />
              </Block>
            ) : null}

            <Block title="שירותים">
              <dl className="mx-auto grid max-w-2xl gap-3 text-start sm:grid-cols-2">
                {ABOUT_PAGE.infoSections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-border/80 bg-surface px-4 py-3.5">
                    <dt className="font-extrabold text-brand-900">{section.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{section.body}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            {about.cateringBody ? (
              <div id="catering" className="scroll-mt-[calc(var(--header-height)+1.5rem)]">
                <Block title={about.cateringTitle}>
                  <p className="mx-auto max-w-xl text-[0.95rem] font-light leading-relaxed text-ink-muted sm:text-base">
                    {about.cateringBody}
                  </p>
                </Block>
              </div>
            ) : null}
          </div>

          <Reveal className="mt-14 border-t border-border/70 pt-10">
            <p className="text-2xl font-black text-brand-900 sm:text-3xl">{about.closingTitle}</p>
            <p className="mx-auto mt-3 max-w-xl text-base font-light leading-relaxed text-ink-muted">
              {about.closingBody}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <OrderButton order={order} variant="deep" className="min-h-12 w-full max-w-xs px-8 sm:w-auto" />
              <Link href="/menu" className="btn-outline-deep min-h-12 w-full max-w-xs px-8 sm:w-auto">
                לתפריט
              </Link>
            </div>
          </Reveal>
        </article>
      </Container>
    </section>
  );
}
