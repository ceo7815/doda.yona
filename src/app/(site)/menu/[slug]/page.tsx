import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { DishMedia } from "@/components/brand/dish-media";
import { GoldFlourish, SectionHeading } from "@/components/brand/ornaments";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { OrderButton } from "@/components/site/order-button";
import { getServedWith } from "@/data/catalog";
import { getOrderLink, toTelHref } from "@/lib/site-settings";
import { getCatalog, getMenuItemBySlug } from "@/services/catalog";
import { getSiteSettings } from "@/services/content";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { items } = await getCatalog();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);
  if (!item) return { title: "מנה לא נמצאה" };
  return {
    title: item.name,
    description: item.description,
    alternates: { canonical: `/menu/${item.slug}` },
    openGraph: item.imagePath ? { images: [{ url: item.imagePath }] } : undefined,
  };
}

export default async function MenuItemPage({ params }: PageProps) {
  const { slug } = await params;
  const [catalog, item, settings] = await Promise.all([
    getCatalog(),
    getMenuItemBySlug(slug),
    getSiteSettings(),
  ]);
  if (!item) notFound();

  const order = getOrderLink(settings);
  const category = catalog.categories.find((c) => c.id === item.categoryId) ?? null;
  const servedWith = getServedWith(category?.slug ?? String(item.categoryId));
  const related = catalog.items
    .filter((i) => i.categoryId === item.categoryId && i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="surface-paper">
      <Container className="page-pad-top pb-14">
        <nav aria-label="פירורי לחם" className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/menu"
            className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-gold-700 transition-colors hover:text-brand-900"
          >
            <ArrowRight className="size-4" aria-hidden />
            התפריט
          </Link>
          {category ? (
            <>
              <span className="text-border-strong" aria-hidden>/</span>
              <Link href={`/menu#${category.slug}`} className="text-ink-muted hover:text-brand-900">
                {category.name}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:order-2">
            <DishMedia
              name={item.name}
              imagePath={item.imagePath}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="aspect-[4/3] rounded-[1.5rem] shadow-[var(--shadow-lg)] sm:aspect-[5/4]"
            />
          </div>

          <div className="lg:order-1 lg:pt-4">
            {category ? <p className="eyebrow text-gold-700">{category.name}</p> : null}
            <h1 className="mt-2 text-balance text-3xl font-black tracking-tight text-brand-900 sm:text-5xl">
              {item.name}
            </h1>
            <GoldFlourish className="mt-4" />
            {item.badges?.length ? (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.badges.map((badge) => (
                  <li key={badge} className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">
                    {badge}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-5 max-w-prose text-pretty text-base font-light leading-[1.9] text-ink-muted sm:text-lg">
              {item.longDescription ?? item.description}
            </p>

            {servedWith.length > 0 ? (
              <section className="mt-7 rounded-2xl border border-border bg-surface-elevated p-5">
                <h2 className="text-sm font-extrabold text-brand-900">מוגש עם — על חשבון הבית</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {servedWith.map((name) => (
                    <li
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/12 px-3 py-1.5 text-sm font-semibold text-brand-800"
                    >
                      <Check className="size-3.5 text-gold-700" aria-hidden />
                      {name}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrderButton order={order} className="min-h-13 px-9 text-base" />
              {order.isPhoneFallback ? null : (
                <a
                  href={toTelHref(settings.business.phoneDisplay)}
                  className="btn-outline-deep min-h-13 gap-2 px-7 text-base"
                >
                  <Phone className="size-4" aria-hidden />
                  <span dir="ltr">{settings.business.phoneDisplay}</span>
                </a>
              )}
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              {order.isPhoneFallback
                ? "ההזמנות מתקבלות בטלפון — משלוח, איסוף או ישיבה במקום."
                : "ההזמנה והמחיר המעודכן — במערכת ההזמנות של המסעדה."}
            </p>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20" aria-labelledby="related-title">
            <SectionHeading id="related-title" title={`עוד ${category?.name ?? "מנות"}`} />
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.id}>
                  <MenuItemCard item={r} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
