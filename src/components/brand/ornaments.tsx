import { cn } from "@/lib/utils";

export function GoldFlourish({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-36 text-gold-500", className)}
      viewBox="0 0 180 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 10h52M118 10h52"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M90 3.5c1.6 3.2 4.8 4.8 9.5 6.5-4.7 1.7-7.9 3.3-9.5 6.5-1.6-3.2-4.8-4.8-9.5-6.5 4.7-1.7 7.9-3.3 9.5-6.5Z"
        fill="currentColor"
      />
      <circle cx="68" cy="10" r="1.6" fill="currentColor" />
      <circle cx="112" cy="10" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function SectionBanner({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative inline-flex max-w-full min-w-[12rem] items-center justify-center rounded-2xl bg-brand-900 px-8 py-3.5 shadow-[var(--shadow-md)] sm:px-10">
        <span
          className="absolute start-2 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gold-500"
          aria-hidden
        />
        <span
          className="absolute end-2 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gold-500"
          aria-hidden
        />
        <h2 className="px-2 text-center text-lg font-extrabold leading-snug tracking-wide text-gold-400 sm:text-2xl">
          {title}
        </h2>
      </div>
      <GoldFlourish />
    </div>
  );
}
