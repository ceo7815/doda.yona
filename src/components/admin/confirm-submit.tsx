"use client";

/** כפתור submit שמבקש אישור לפני פעולה בלתי הפיכה */
export function ConfirmSubmit({
  message,
  className,
  label,
  children,
}: {
  message: string;
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={label}
      title={label}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
