"use client";

import { useActionState } from "react";
import { saveSiteSection, type SiteActionState } from "@/app/(admin)/admin/(dashboard)/site-actions";
import { AdminCard, Field, TextArea } from "@/components/admin/ui";
import { SaveBar } from "@/components/admin/forms/save-bar";
import type { SiteSettings } from "@/lib/site-settings";

const initial: SiteActionState = { ok: false };

export function SettingsForm({ settings, disabled }: { settings: SiteSettings; disabled?: boolean }) {
  const [state, action, pending] = useActionState(saveSiteSection, initial);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="section" value="settings" />

      <AdminCard
        title="קישור להזמנות (הקופה)"
        description="כל כפתורי «להזמנה» באתר יובילו לכתובת הזו. כל עוד השדה ריק — הכפתורים מחייגים למסעדה."
      >
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field
            label="כתובת דף ההזמנות"
            name="orderUrl"
            type="url"
            defaultValue={settings.ordering.orderUrl}
            placeholder="https://…"
            dir="ltr"
            error={e.orderUrl}
            hint="את הכתובת מקבלים מספק הקופה / מערכת ההזמנות"
          />
          <Field label="טקסט הכפתור" name="orderLabel" defaultValue={settings.ordering.orderLabel} error={e.orderLabel} hint="למשל: להזמנה, להזמנה אונליין" />
        </div>
      </AdminCard>

      <AdminCard title="מנועי חיפוש" description="התיאור שמופיע בגוגל מתחת לשם האתר.">
        <TextArea label="תיאור האתר" name="seoDescription" defaultValue={settings.seo.description} rows={3} maxLength={300} error={e.seoDescription} />
      </AdminCard>

      <SaveBar pending={pending} ok={state.ok} message={state.message} disabled={disabled} />
    </form>
  );
}
