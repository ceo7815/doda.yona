import { Phone, ShoppingBag } from "lucide-react";
import type { OrderLink } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

type OrderButtonProps = {
  order: OrderLink;
  variant?: "gold" | "deep" | "ghost";
  className?: string;
  /** טקסט מותאם; ברירת מחדל: התווית מההגדרות */
  label?: string;
  showIcon?: boolean;
};

/**
 * כפתור «להזמנה» אחיד — מוביל לדף ההזמנות של הקופה,
 * ואם עוד לא הוגדר קישור — מחייג למסעדה.
 */
export function OrderButton({
  order,
  variant = "gold",
  className,
  label,
  showIcon = true,
}: OrderButtonProps) {
  const Icon = order.isPhoneFallback ? Phone : ShoppingBag;
  return (
    <a
      href={order.href}
      {...(order.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        variant === "gold" && "btn-gold",
        variant === "deep" && "btn-deep",
        variant === "ghost" && "btn-ghost-gold",
        "gap-2",
        className,
      )}
      data-order-cta
    >
      {showIcon ? <Icon className="size-[1.1em] shrink-0" aria-hidden /> : null}
      <span>{label ?? order.label}</span>
      {order.external ? <span className="sr-only">(נפתח בחלון חדש)</span> : null}
    </a>
  );
}
