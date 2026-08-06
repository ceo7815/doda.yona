export function SupabaseNotice() {
  return (
    <div
      className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink"
      role="status"
    >
      מסד הנתונים עדיין לא מחובר. מלאו את פרטי Supabase בקובץ{" "}
      <code className="rounded bg-brand-100 px-1" dir="ltr">
        .env.local
      </code>{" "}
      והריצו את המיגרציות.
    </div>
  );
}
