import Image from "next/image";
import { GoldFlourish } from "@/components/brand/ornaments";

const MENU_BOARD = {
  src: "/brand/home-menu-board.png",
  width: 1024,
  height: 573,
} as const;

type HeroMenuTransitionProps = {
  restaurantName: string;
};

export function HeroMenuTransition({ restaurantName }: HeroMenuTransitionProps) {
  return (
    <>
      <div
        className="flex items-center justify-center bg-brand-900 py-3 sm:py-3.5"
        aria-hidden
      >
        <GoldFlourish className="h-4 w-40 text-gold-400 sm:h-5 sm:w-48" />
      </div>

      <section className="leading-none" aria-label="תפריט המרקים, מאפים וקייטרינג">
        <Image
          src={MENU_BOARD.src}
          alt={`${restaurantName} — תפריט המרקים, מאפים ומאכלים תימניים, קייטרינג והזמנה אונליין`}
          width={MENU_BOARD.width}
          height={MENU_BOARD.height}
          className="h-auto w-full"
          sizes="100vw"
          quality={90}
        />
      </section>
    </>
  );
}
