import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { Button } from "@/components/ui/button";
import { formatAdminPrice, isMissingTableError } from "@/lib/admin/format";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { deleteDeliveryZone, toggleDeliveryZoneActive } from "./actions";
import { DeliveryZoneForm, type DeliveryZoneFormValues } from "./delivery-zone-form";

export const metadata: Metadata = {
  title: "אזורי משלוח",
  robots: { index: false, follow: false },
};

type ZoneRow = {
  id: string;
  name: string;
  delivery_fee_agorot: number;
  min_order_agorot: number | null;
  estimated_minutes: number | null;
  sort_order: number;
  is_active: boolean;
};

export default async function AdminDeliveryZonesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const configured = isSupabaseConfigured();

  let zones: ZoneRow[] = [];
  let dbError: string | null = null;
  let editing: DeliveryZoneFormValues | undefined;

  if (configured) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("delivery_zones")
      .select(
        "id, name, delivery_fee_agorot, min_order_agorot, estimated_minutes, sort_order, is_active",
      )
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      dbError = isMissingTableError(error)
        ? "טבלת אזורי המשלוח עדיין לא קיימת. הריצו את המיגרציות."
        : "לא ניתן לטעון אזורי משלוח.";
    } else {
      zones = data ?? [];
      if (edit) {
        const row = zones.find((z) => z.id === edit);
        if (row) {
          editing = {
            id: row.id,
            name: row.name,
            deliveryFeeAgorot: row.delivery_fee_agorot,
            minOrderAgorot: row.min_order_agorot,
            estimatedMinutes: row.estimated_minutes,
            sortOrder: row.sort_order,
            isActive: row.is_active,
          };
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="אזורי משלוח"
        description="הגדרת אזורים, דמי משלוח ומינימום הזמנה."
      />

      {!configured ? <SupabaseNotice /> : null}
      {dbError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          {dbError}
        </div>
      ) : null}

      {configured && !dbError ? (
        <>
          <DeliveryZoneForm key={editing?.id ?? "new"} initial={editing} />

          <section className="rounded-md border border-border">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-bold text-ink">
                {zones.length === 0 ? "אין אזורים עדיין" : `${zones.length} אזורים`}
              </h2>
            </div>

            {zones.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ink-muted">
                הוסיפו אזור משלוח ראשון — למשל שכונות בנתניה שאליהן אתם מגיעים.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-50 text-start">
                      <th className="px-4 py-2 font-medium">שם</th>
                      <th className="px-4 py-2 font-medium">דמי משלוח</th>
                      <th className="px-4 py-2 font-medium">מינימום</th>
                      <th className="px-4 py-2 font-medium">זמן</th>
                      <th className="px-4 py-2 font-medium">סטטוס</th>
                      <th className="px-4 py-2 font-medium">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone) => (
                      <tr key={zone.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium">{zone.name}</td>
                        <td className="px-4 py-3">
                          {formatAdminPrice(zone.delivery_fee_agorot)}
                        </td>
                        <td className="px-4 py-3">
                          {zone.min_order_agorot != null && zone.min_order_agorot > 0
                            ? formatAdminPrice(zone.min_order_agorot)
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {zone.estimated_minutes != null
                            ? `${zone.estimated_minutes} דק׳`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <form action={toggleDeliveryZoneActive}>
                            <input type="hidden" name="id" value={zone.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={String(!zone.is_active)}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant={zone.is_active ? "secondary" : "outline"}
                            >
                              {zone.is_active ? "פעיל" : "מושבת"}
                            </Button>
                          </form>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/delivery-zones?edit=${zone.id}`}
                              className="text-sm text-brand-700 underline"
                            >
                              עריכה
                            </Link>
                            <form action={deleteDeliveryZone}>
                              <input type="hidden" name="id" value={zone.id} />
                              <Button type="submit" size="sm" variant="ghost" className="text-danger">
                                הסרה
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
