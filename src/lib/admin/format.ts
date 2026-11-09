export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0590-\u05FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isMissingTableError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("does not exist")) ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}
