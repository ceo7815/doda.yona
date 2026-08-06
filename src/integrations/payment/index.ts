/**
 * Payment Provider Interface — חיבור עתידי ל-Cardcom / Tranzila וכו'.
 * מימוש נוכחי: Demo בלבד. אין לסמן הזמנה כמשולמת ללא אימות אמיתי.
 */

import type { PaymentStatus } from "@/types/domain";

export type CreatePaymentInput = {
  orderId: string;
  amountAgorot: number;
  currency?: "ILS";
  customerEmail?: string;
  customerPhone?: string;
  returnUrl: string;
  idempotencyKey: string;
};

export type CreatePaymentResult = {
  status: PaymentStatus;
  provider: string;
  externalId?: string;
  redirectUrl?: string;
  demo: boolean;
  message: string;
};

export type PaymentWebhookResult = {
  accepted: boolean;
  orderId?: string;
  status?: PaymentStatus;
  externalId?: string;
  duplicate?: boolean;
  message: string;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyWebhook(
    headers: Headers,
    rawBody: string,
  ): Promise<PaymentWebhookResult>;
}

export class DemoPaymentProvider implements PaymentProvider {
  readonly name = "demo";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return {
      status: "pending",
      provider: this.name,
      externalId: `demo_${input.idempotencyKey}`,
      demo: true,
      message:
        "מצב Demo: לא בוצע חיוב אמיתי. יש לחבר ספק סליקה לפני הפעלה בפרודקשן.",
    };
  }

  async verifyWebhook(): Promise<PaymentWebhookResult> {
    return {
      accepted: false,
      message: "מצב Demo: אין Webhook אמיתי לסליקה.",
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "demo";
  if (provider === "demo") {
    return new DemoPaymentProvider();
  }
  // ספקים נוספים יתווספו בשלב 7 לאחר בחירת ספק
  return new DemoPaymentProvider();
}
