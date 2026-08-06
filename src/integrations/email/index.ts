/**
 * Email Adapter — Demo עד בחירת ספק (Resend / SMTP וכו').
 */

export type EmailMessageInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  orderId?: string;
};

export type EmailSendResult = {
  ok: boolean;
  demo: boolean;
  provider: string;
  messageId?: string;
  loggedOnly: boolean;
  message: string;
};

export interface EmailProvider {
  readonly name: string;
  send(input: EmailMessageInput): Promise<EmailSendResult>;
}

export class DemoEmailProvider implements EmailProvider {
  readonly name = "demo";

  async send(input: EmailMessageInput): Promise<EmailSendResult> {
    return {
      ok: true,
      demo: true,
      provider: this.name,
      loggedOnly: true,
      message: `מצב Demo: מייל לא נשלח בפועל (אל ${input.to}): ${input.subject}`,
    };
  }
}

export function getEmailProvider(): EmailProvider {
  return new DemoEmailProvider();
}
