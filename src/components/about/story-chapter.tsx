"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FloatingFeatureImage } from "@/components/home/floating-feature-image";

type StoryChapterProps = {
  index: number;
  title: string;
  body: string;
  imagePath: string;
  imageAlt: string;
  /** כשהתמונה בצד ההפוך (פרקים זוגיים) */
  reverse?: boolean;
  /** תמונה צפה מונפשת — רק לפרק אחד כדי לא להעמיס */
  floating?: boolean;
};

export function StoryChapter({
  index,
  title,
  body,
  imagePath,
  imageAlt,
  reverse = false,
  floating = false,
}: StoryChapterProps) {
  return (
    <article
      className={cn(
        "grid items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16",
        reverse && "lg:[&>*:first-child]:order-2",
      )}
    >
      <div className="text-center lg:text-start">
        <div className="flex items-baseline justify-center gap-3 lg:justify-start">
          <span className="text-sm font-bold tracking-[0.2em] text-gold-700">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">
            {title}
          </h3>
        </div>
        <div className="gold-rule mx-auto mt-3 sm:mt-4 lg:mx-0" />
        <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-[1.85] text-ink-muted sm:mt-5 sm:text-lg lg:mx-0">
          {body}
        </p>
      </div>

      <div className="relative">
        {floating ? (
          <FloatingFeatureImage src={imagePath} alt={imageAlt} />
        ) : (
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-gold-500/20 shadow-[var(--shadow-md)] sm:rounded-[1.75rem]">
            <Image
              src={imagePath}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 92vw, 480px"
              quality={75}
            />
          </div>
        )}
      </div>
    </article>
  );
}
