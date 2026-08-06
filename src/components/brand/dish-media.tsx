import Image from "next/image";
import { cn } from "@/lib/utils";

type DishMediaProps = {
  name: string;
  imagePath?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** תמונת מנה אמיתית, או placeholder ממותג עד שתהיה תמונה */
export function DishMedia({
  name,
  imagePath,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw",
  priority = false,
}: DishMediaProps) {
  if (imagePath) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden bg-brand-100",
          className,
        )}
      >
        <Image
          src={imagePath}
          alt={name}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          quality={75}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden bg-brand-900",
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgb(212 168 75 / 0.35), transparent 50%), linear-gradient(145deg, #3c281a 0%, #1f140c 55%, #2a1c12 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a84b' fill-opacity='1'%3E%3Cpath d='M20 18.5c.8 1.6 2.4 2.4 4.8 3.2-2.4.8-4 1.6-4.8 3.2-.8-1.6-2.4-2.4-4.8-3.2 2.4-.8 4-1.6 4.8-3.2z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="text-[0.65rem] font-bold tracking-[0.25em] text-gold-500/80">
          דודה יונה
        </span>
        <span className="mt-2 max-w-[12ch] text-lg font-extrabold leading-tight text-gold-300/90">
          {name}
        </span>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l from-transparent via-gold-500/70 to-transparent"
        aria-hidden
      />
    </div>
  );
}
