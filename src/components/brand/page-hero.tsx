import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";

/** תמונת רקע נקייה לחלק העליון — לא בדף הבית */
export const PAGE_HERO_IMAGE = "/brand/inner-hero.png";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
};

/** Hero צר לכל העמודים הפנימיים: תמונה נקייה + כותרת העמוד בלבד */
export function PageHero({
  title,
  subtitle,
  eyebrow,
  className,
  children,
  priority = false,
}: PageHeroProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden page-pad-top px-1 pb-6 pt-5 text-center sm:pb-9 sm:pt-7",
        className,
      )}
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={PAGE_HERO_IMAGE}
          alt=""
          fill
          priority={priority}
          className="object-cover object-[center_40%] sm:object-center"
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-brand-900/50 sm:bg-brand-900/45" />
      </div>

      <Container className="relative">
        {eyebrow ? (
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold-400 sm:text-xs sm:tracking-[0.28em]">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "text-[clamp(1.75rem,7vw,2.25rem)] font-black tracking-tight text-gold-400 sm:text-4xl",
            eyebrow && "mt-1.5 sm:mt-2",
          )}
        >
          {title}
        </h1>
        <GoldFlourish className="mx-auto mt-2.5 text-gold-400 sm:mt-3" />
        {subtitle ? (
          <p className="mx-auto mt-2.5 max-w-lg px-1 text-sm font-light leading-relaxed text-white sm:mt-3 sm:text-base">
            {subtitle}
          </p>
        ) : null}
        {children}
      </Container>
    </header>
  );
}
