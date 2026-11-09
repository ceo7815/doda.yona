import type { SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

const LABELS: Record<keyof SiteSettings["social"], string> = {
  instagram: "אינסטגרם",
  facebook: "פייסבוק",
  tiktok: "טיקטוק",
};

function Icon({ name }: { name: keyof SiteSettings["social"] }) {
  const common = { className: "size-[1.15rem]", "aria-hidden": true, fill: "currentColor", viewBox: "0 0 24 24" } as const;
  if (name === "instagram")
    return (
      <svg {...common}>
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
      </svg>
    );
  if (name === "facebook")
    return (
      <svg {...common}>
        <path d="M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.2-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.7h3.1z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z" />
    </svg>
  );
}

/** קישורי רשתות — מוצגים רק אם הבעלים הזין אותם באדמין */
export function SocialLinks({
  social,
  className,
}: {
  social: SiteSettings["social"];
  className?: string;
}) {
  const entries = (Object.keys(LABELS) as (keyof SiteSettings["social"])[]).filter(
    (key) => social[key],
  );
  if (entries.length === 0) return null;
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {entries.map((key) => (
        <li key={key}>
          <a
            href={social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LABELS[key]} (נפתח בחלון חדש)`}
            className="inline-flex size-10 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 transition-colors hover:border-gold-400 hover:bg-gold-500/10"
          >
            <Icon name={key} />
          </a>
        </li>
      ))}
    </ul>
  );
}
