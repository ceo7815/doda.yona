import { cn } from "@/lib/utils";

export function LegalProse({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-6 text-sm font-light leading-relaxed text-ink-muted sm:space-y-8 sm:text-base",
        "[&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-brand-900 sm:[&_h2]:text-xl",
        "[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-brand-900 sm:[&_h3]:text-lg",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-5",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:ps-5",
        "[&_strong]:font-semibold [&_strong]:text-brand-900",
        "[&_a]:font-semibold [&_a]:text-gold-700 [&_a]:underline [&_a]:underline-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
