import { revalidatePath, updateTag } from "next/cache";
import { PUBLIC_CONTENT_TAG } from "@/lib/supabase/public";

/** מרענן מיד את האתר הציבורי אחרי שמירה באדמין (נקרא רק מתוך Server Actions) */
export function refreshPublicSite() {
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/", "layout");
}
