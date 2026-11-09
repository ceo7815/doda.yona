import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { MenuItem } from "@/data/catalog";
import { DishMedia } from "@/components/brand/dish-media";
import { cn } from "@/lib/utils";

type MenuItemCardProps = {
  item: MenuItem;
  className?: string;
  priority?: boolean;
};

/** כרטיס מנה לתצוגה — תמונה, שם ותיאור. בלי מחירים: ההזמנה והמחירים בקופה */
export function MenuItemCard({ item, className, priority = false }: MenuItemCardProps) {
  return (
    <article
      className={cn(
        "dish-card group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/70 bg-surface-elevated shadow-[var(--shadow-card)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <DishMedia
          name={item.name}
          imagePath={item.imagePath}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 290px"
          className="aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {item.badges?.length ? (
          <ul className="absolute top-2 start-2 flex flex-wrap gap-1">
            {item.badges.slice(0, 2).map((badge) => (
              <li
                key={badge}
                className="rounded-full bg-brand-900/80 px-2 py-0.5 text-[0.62rem] font-bold text-gold-300 backdrop-blur-sm sm:text-[0.68rem]"
              >
                {badge}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        <h3 className="text-[0.92rem] font-extrabold leading-snug tracking-tight text-brand-900 sm:text-[1.05rem]">
          <Link
            href={`/menu/${item.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {item.name}
          </Link>
        </h3>
        <p className="line-clamp-2 flex-1 text-[0.75rem] font-light leading-relaxed text-ink-muted sm:text-[0.82rem]">
          {item.description}
        </p>
        <span className="mt-1 inline-flex items-center gap-1 text-[0.72rem] font-bold text-gold-700 transition-[gap] duration-300 group-hover:gap-2 sm:text-xs">
          לפרטי המנה
          <ArrowLeft className="size-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
