/**
 * WhatsApp Adapter — Demo עד בחירת ספק.
 * אין להציג למשתמש כאילו ההודעה נשלחה אם הספק לא הוגדר.
 */

export type WhatsAppMessageInput = {
  toPhone: string;
  body: string;
  orderId?: string;
  templateName?: string;
};

export type WhatsAppSendResult = {
  ok: boolean;
  demo: boolean;
  provider: string;
  messageId?: string;
  loggedOnly: boolean;
  message: string;
};

export interface WhatsAppProvider {
  readonly name: string;
  send(input: WhatsAppMessageInput): Promise<WhatsAppSendResult>;
}

export class DemoWhatsAppProvider implements WhatsAppProvider {
  readonly name = "demo";

  async send(input: WhatsAppMessageInput): Promise<WhatsAppSendResult> {
    // בשלב 4 יישמר גם ל-notification_logs
    return {
      ok: true,
      demo: true,
      provider: this.name,
      loggedOnly: true,
      message: `מצב Demo: הודעת WhatsApp לא נשלחה בפועל (אל ${input.toPhone}).`,
    };
  }
}

export function getWhatsAppProvider(): WhatsAppProvider {
  const provider = process.env.WHATSAPP_PROVIDER ?? "demo";
  if (provider === "demo") {
    return new DemoWhatsAppProvider();
  }
  return new DemoWhatsAppProvider();
}
