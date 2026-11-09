import type { HoursLine } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

type HoursListProps = {
  hours: HoursLine[];
  note?: string;
  telHref: string;
  tone?: "light" | "dark";
  className?: string;
};

/** שעות פעילות כפי שהוזנו באדמין. אם עוד לא הוזנו — מפנה לטלפון, בלי להמציא שעות */
export function HoursList({ hours, note, telHref, tone = "light", className }: HoursListProps) {
  const dark = tone === "dark";
  if (hours.length === 0) {
    return (
      <p className={cn("text-sm", dark ? "text-brand-200" : "text-ink-muted", className)}>
        לשעות הפעילות העדכניות{" "}
        <a
          href={telHref}
          className={cn(
            "font-bold underline-offset-4 hover:underline",
            dark ? "text-gold-300" : "text-gold-700",
          )}
        >
          התקשרו אלינו
        </a>
      </p>
    );
  }
  return (
    <div className={className}>
      <dl className="space-y-2 text-sm">
        {hours.map((line, index) => (
          <div
            key={`${line.label}-${index}`}
            className={cn(
              "flex items-baseline justify-between gap-4 border-b pb-2 last:border-0",
              dark ? "border-white/10" : "border-border/70",
            )}
          >
            <dt className={dark ? "text-brand-200" : "text-ink-muted"}>{line.label}</dt>
            <dd className={cn("font-bold", dark ? "text-brand-50" : "text-brand-900")}>
              {line.value}
            </dd>
          </div>
        ))}
      </dl>
      {note ? (
        <p className={cn("mt-3 text-xs", dark ? "text-brand-300" : "text-ink-muted")}>{note}</p>
      ) : null}
    </div>
  );
}
