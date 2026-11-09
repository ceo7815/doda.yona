export function SupabaseNotice() {
  return (
    <div className="rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink" role="status">
      מסד הנתונים עדיין לא מחובר, ולכן אי אפשר לשמור שינויים. האתר מציג כרגע את התוכן
      הקבוע מהקוד. פנו למפתח המערכת לחיבור.
    </div>
  );
}
