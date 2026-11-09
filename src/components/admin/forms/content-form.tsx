"use client";

import { useActionState } from "react";
import { saveSiteSection, type SiteActionState } from "@/app/(admin)/admin/(dashboard)/site-actions";
import { AdminCard, Field, TextArea } from "@/components/admin/ui";
import { SaveBar } from "@/components/admin/forms/save-bar";
import type { SiteSettings } from "@/lib/site-settings";

const initial: SiteActionState = { ok: false };

export function ContentForm({ settings, disabled }: { settings: SiteSettings; disabled?: boolean }) {
  const [state, action, pending] = useActionState(saveSiteSection, initial);
  const e = state.fieldErrors ?? {};
  const h = settings.home;
  const a = settings.about;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="section" value="content" />

      <AdminCard title="דף הבית — מנות מומלצות">
        <div className="grid gap-4">
          <Field label="כותרת" name="featuredTitle" defaultValue={h.featuredTitle} required error={e.featuredTitle} />
          <TextArea label="תת־כותרת" name="featuredSubtitle" defaultValue={h.featuredSubtitle} rows={2} error={e.featuredSubtitle} />
        </div>
      </AdminCard>

      <AdminCard title="דף הבית — הסיפור שלנו">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="כותרת" name="storyTitle" defaultValue={h.storyTitle} error={e.storyTitle} />
          <Field label="שורה מודגשת" name="storyHighlight" defaultValue={h.storyHighlight} error={e.storyHighlight} />
        </div>
        <TextArea className="mt-4" label="טקסט" name="storyTeaser" defaultValue={h.storyTeaser} rows={3} error={e.storyTeaser} />
      </AdminCard>

      <AdminCard title="דף הבית — איך מזמינים">
        <div className="grid gap-4">
          <Field label="כותרת" name="orderTitle" defaultValue={h.orderTitle} error={e.orderTitle} />
          <TextArea label="טקסט" name="orderSubtitle" defaultValue={h.orderSubtitle} rows={2} error={e.orderSubtitle} />
        </div>
      </AdminCard>

      <AdminCard title="עמוד «הסיפור שלנו»">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="כותרת עליונה" name="aboutHeroTitle" defaultValue={a.heroTitle} error={e.heroTitle} />
          <Field label="שורת פתיחה" name="aboutSubtitle" defaultValue={a.subtitle} error={e.subtitle} />
        </div>
        <Field className="mt-4" label="כותרת ראשית" name="aboutTagline" defaultValue={a.tagline} required error={e.aboutTagline ?? e.tagline} />
        <TextArea className="mt-4" label="טקסט פתיחה" name="aboutIntro" defaultValue={a.intro} rows={5} error={e.intro} />

        <div className="mt-6 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
          <div className="space-y-4">
            <Field label="כותרת רשימת המרקים" name="soupsTitle" defaultValue={a.soupsTitle} />
            <TextArea label="מרקים — שורה לכל פריט" name="soupsItems" defaultValue={a.soupsItems.join("\n")} rows={8} />
            <TextArea label="הערה מתחת למרקים" name="soupsNote" defaultValue={a.soupsNote} rows={2} />
          </div>
          <div className="space-y-4">
            <Field label="כותרת רשימת המאפים" name="pastriesTitle" defaultValue={a.pastriesTitle} />
            <TextArea label="מאפים ומאכלים — שורה לכל פריט" name="pastriesItems" defaultValue={a.pastriesItems.join("\n")} rows={8} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-border/70 pt-6">
          <Field label="כותרת קייטרינג" name="cateringTitle" defaultValue={a.cateringTitle} />
          <TextArea label="טקסט קייטרינג" name="cateringBody" defaultValue={a.cateringBody} rows={3} />
          <Field label="כותרת סיום" name="closingTitle" defaultValue={a.closingTitle} />
          <TextArea label="טקסט סיום" name="closingBody" defaultValue={a.closingBody} rows={2} />
        </div>
      </AdminCard>

      <SaveBar pending={pending} ok={state.ok} message={state.message} disabled={disabled} />
    </form>
  );
}
