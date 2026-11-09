import Link from "next/link";
import { BookOpen, MessageCircle, Phone } from "lucide-react";
import type { OrderLink } from "@/lib/site-settings";
import { OrderButton } from "@/components/site/order-button";

type MobileActionBarProps = {
  order: OrderLink;
  telHref: string;
  whatsappHref: string | null;
};

/** פס פעולות קבוע בתחתית המסך במובייל: הזמנה + חיוג (+ וואטסאפ אם הוגדר) */
export function MobileActionBar({ order, telHref, whatsappHref }: MobileActionBarProps) {
  return (
    <div className="mobile-action-bar no-print fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/20 bg-brand-900/95 px-3 pt-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_30px_rgb(20_13_8/0.25)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch gap-2">
        <OrderButton
          order={order}
          className="min-h-12 flex-1 rounded-xl text-base"
          label={order.isPhoneFallback ? "להזמנה בטלפון" : order.label}
          showIcon
        />
        {order.isPhoneFallback ? (
          <Link
            href="/menu"
            className="inline-flex min-h-12 min-w-[6.5rem] items-center justify-center gap-1.5 rounded-xl border border-gold-500/40 px-3 text-sm font-bold text-gold-300 active:scale-[0.98]"
          >
            <BookOpen className="size-4" aria-hidden />
            התפריט
          </Link>
        ) : (
          <a
            href={telHref}
            className="inline-flex min-h-12 min-w-[6.5rem] items-center justify-center gap-1.5 rounded-xl border border-gold-500/40 px-3 text-sm font-bold text-gold-300 active:scale-[0.98]"
          >
            <Phone className="size-4" aria-hidden />
            חיוג
          </a>
        )}
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-12 items-center justify-center rounded-xl border border-gold-500/40 text-gold-300 active:scale-[0.98]"
            aria-label="שליחת הודעת וואטסאפ (נפתח בחלון חדש)"
          >
            <MessageCircle className="size-5" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}
