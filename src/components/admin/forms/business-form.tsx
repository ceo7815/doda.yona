"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveSiteSection, type SiteActionState } from "@/app/(admin)/admin/(dashboard)/site-actions";
import { AdminCard, Field, TextArea } from "@/components/admin/ui";
import { SaveBar } from "@/components/admin/forms/save-bar";
import type { HoursLine, SiteSettings } from "@/lib/site-settings";

const initial: SiteActionState = { ok: false };

let rowSeq = 0;
const withKey = (h: HoursLine) => ({ ...h, key: `r${rowSeq++}` });

export function BusinessForm({ settings, disabled }: { settings: SiteSettings; disabled?: boolean }) {
  const [state, action, pending] = useActionState(saveSiteSection, initial);
  const [hours, setHours] = useState(() => settings.hours.map(withKey));
  const e = state.fieldErrors ?? {};
  const b = settings.business;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="section" value="business" />

      <AdminCard title="פרטי קשר" description="מופיעים בכל האתר: בכותרת, בכפתורי החיוג, בתחתית ובעמוד צור קשר.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="טלפון המסעדה" name="phoneDisplay" defaultValue={b.phoneDisplay} required dir="ltr" error={e.phoneDisplay} hint="כפי שיוצג באתר, למשל 053-6206603" />
          <Field label="וואטסאפ (לא חובה)" name="whatsapp" defaultValue={b.whatsapp} dir="ltr" error={e.whatsapp} hint="אם יוזן — יופיע כפתור וואטסאפ באתר" />
          <Field label="מייל (לא חובה)" name="email" type="email" defaultValue={b.email} dir="ltr" error={e.email} />
          <Field label="כשרות" name="kashrut" defaultValue={b.kashrut} error={e.kashrut} />
        </div>
      </AdminCard>

      <AdminCard title="כתובת">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="רחוב ומספר" name="street" defaultValue={b.street} required error={e.street} />
          <Field label="עיר" name="city" defaultValue={b.city} required error={e.city} />
          <Field label="שכונה / אזור" name="neighborhood" defaultValue={b.neighborhood} error={e.neighborhood} />
        </div>
        <TextArea className="mt-4" label="הערה לאורחים" name="dineInNote" defaultValue={b.dineInNote} rows={2} error={e.dineInNote} hint="למשל: אפשרות לאכול במקום בהזמנה מראש" />
      </AdminCard>

      <AdminCard
        title="שעות פעילות"
        description="כל שורה: ימים ושעות. אם אין שורות — האתר מציג «לשעות הפעילות העדכניות התקשרו אלינו»."
      >
        <ul className="space-y-2.5">
          {hours.map((row, index) => (
            <li key={row.key} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <Field label={index === 0 ? "ימים" : ""} aria-label="ימים" name="hoursLabel" defaultValue={row.label} placeholder="למשל: א׳–ה׳" />
              <Field label={index === 0 ? "שעות" : ""} aria-label="שעות" name="hoursValue" defaultValue={row.value} placeholder="למשל: 11:00–22:00" dir="ltr" />
              <button
                type="button"
                onClick={() => setHours((h) => h.filter((r) => r.key !== row.key))}
                className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-danger hover:bg-danger/5"
                aria-label="מחיקת שורה"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setHours((h) => [...h, withKey({ label: "", value: "" })])}
          className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-dashed border-border-strong px-4 text-sm font-bold text-brand-800 hover:border-gold-500 hover:bg-gold-500/5"
        >
          <Plus className="size-4" aria-hidden />
          הוספת שורה
        </button>
        <Field className="mt-4" label="הערה לשעות (לא חובה)" name="hoursNote" defaultValue={settings.hoursNote} placeholder="למשל: בערבי חג — שעות מקוצרות" error={e.hoursNote} />
      </AdminCard>

      <AdminCard title="רשתות חברתיות" description="קישור מלא שמתחיל ב-https://. שדה ריק — האייקון לא יוצג.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="אינסטגרם" name="instagram" defaultValue={settings.social.instagram} dir="ltr" placeholder="https://instagram.com/…" error={e.instagram} />
          <Field label="פייסבוק" name="facebook" defaultValue={settings.social.facebook} dir="ltr" placeholder="https://facebook.com/…" error={e.facebook} />
          <Field label="טיקטוק" name="tiktok" defaultValue={settings.social.tiktok} dir="ltr" placeholder="https://tiktok.com/@…" error={e.tiktok} />
        </div>
      </AdminCard>

      <SaveBar pending={pending} ok={state.ok} message={state.message} disabled={disabled} />
    </form>
  );
}
