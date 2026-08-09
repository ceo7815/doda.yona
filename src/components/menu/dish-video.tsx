import { cn } from "@/lib/utils";

type DishVideoProps = {
  url: string;
  title: string;
  className?: string;
};

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function getVimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.at(-1) ?? null;
  } catch {
    return null;
  }
}

export function DishVideo({ url, title, className }: DishVideoProps) {
  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  if (youtubeId) {
    return (
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-2xl border border-gold-500/25 bg-brand-900 shadow-[var(--shadow-md)]",
          className,
        )}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vimeoId) {
    return (
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-2xl border border-gold-500/25 bg-brand-900 shadow-[var(--shadow-md)]",
          className,
        )}
      >
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title}
          className="absolute inset-0 size-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gold-500/25 bg-brand-900 shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <video
        src={url}
        controls
        playsInline
        className="aspect-video w-full bg-black"
        aria-label={title}
      />
    </div>
  );
}
