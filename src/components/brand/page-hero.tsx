import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";

/** תמונת רקע נקייה לחלק העליון — לא בדף הבית */
export const PAGE_HERO_IMAGE = "/brand/page-hero.webp";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
};

/** Hero לעמודים הפנימיים: תמונת אווירה + כותרת העמוד */
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
        "relative isolate overflow-hidden bg-brand-900 page-pad-top pb-10 text-center sm:pb-14",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src={PAGE_HERO_IMAGE}
          alt=""
          fill
          priority={priority}
          className="scale-105 object-cover object-[center_40%] blur-[1.5px]"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/75 via-brand-900/55 to-brand-900/85" />
      </div>

      <Container className="hero-cta">
        {eyebrow ? <p className="eyebrow text-gold-400">{eyebrow}</p> : null}
        <h1
          className={cn(
            "text-balance text-[2.1rem] font-black leading-tight tracking-tight text-gold-gradient sm:text-5xl",
            eyebrow && "mt-2",
          )}
        >
          {title}
        </h1>
        <GoldFlourish className="mx-auto mt-3 text-gold-400" />
        {subtitle ? (
          <p className="mx-auto mt-3 max-w-xl text-pretty px-1 text-[0.95rem] font-light leading-relaxed text-brand-50/95 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {children}
      </Container>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-gold-500/60 to-transparent" aria-hidden />
    </header>
  );
}
