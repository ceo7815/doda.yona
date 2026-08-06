/**
 * POS Adapter — חיבור עתידי לקופה רושמת.
 * אין מימוש אמיתי לפני קבלת ספק, API וסביבת בדיקות.
 * כשל בהעברה חייב להישמר ב-Log ולא לגרום לאובדן הזמנה.
 */

export type PosSyncOrderInput = {
  orderId: string;
  publicId: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPriceAgorot: number;
    sku?: string;
  }>;
  totalAgorot: number;
  customerName?: string;
  customerPhone?: string;
};

export type PosSyncResult = {
  ok: boolean;
  demo: boolean;
  provider: string;
  externalId?: string;
  loggedOnly: boolean;
  message: string;
};

export interface PosProvider {
  readonly name: string;
  syncOrder(input: PosSyncOrderInput): Promise<PosSyncResult>;
}

export class DemoPosProvider implements PosProvider {
  readonly name = "demo";

  async syncOrder(input: PosSyncOrderInput): Promise<PosSyncResult> {
    return {
      ok: true,
      demo: true,
      provider: this.name,
      loggedOnly: true,
      message: `מצב Demo: הזמנה ${input.publicId} לא הועברה לקופה רושמת.`,
    };
  }
}

export function getPosProvider(): PosProvider {
  const provider = process.env.POS_PROVIDER ?? "demo";
  if (provider === "demo") {
    return new DemoPosProvider();
  }
  return new DemoPosProvider();
}
