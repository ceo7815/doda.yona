/**
 * Layout בסיסי לאזור /admin — ללא מעטפת ניהול.
 * מסך ההתחברות משתמש בזה ישירות; דפי הדשבורד עוטפים ב-(dashboard).
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
