import { cn } from "@/lib/utils";

export function AdminCard({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-surface-elevated shadow-[0_1px_2px_rgb(31_20_12/0.04),0_8px_24px_rgb(31_20_12/0.04)]",
        className,
      )}
    >
      {title ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-extrabold text-brand-900">{title}</h2>
            {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

const fieldBase =
  "w-full rounded-xl border border-border bg-white px-3.5 text-[0.95rem] text-ink shadow-[inset_0_1px_2px_rgb(31_20_12/0.04)] transition-[border-color,box-shadow] placeholder:text-ink-muted/60 focus:border-gold-500 focus:shadow-[var(--focus-ring)] focus:outline-none";

export function Field({
  label,
  name,
  hint,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  hint?: string;
  error?: string;
}) {
  const id = props.id ?? `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-bold text-brand-900">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, "min-h-11", error && "border-danger")}
        {...props}
      />
      {error ? (
        <p className="text-xs font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  name,
  hint,
  error,
  className,
  rows = 3,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  hint?: string;
  error?: string;
}) {
  const id = props.id ?? `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-bold text-brand-900">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, "py-2.5 leading-relaxed", error && "border-danger")}
        {...props}
      />
      {error ? (
        <p className="text-xs font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border/80 bg-white px-4 py-3">
      <span>
        <span className="block text-sm font-bold text-brand-900">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-ink-muted">{description}</span> : null}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-brand-200 transition-colors peer-checked:bg-success peer-focus-visible:shadow-[var(--focus-ring)]" />
        <span className="absolute top-0.5 right-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:-translate-x-5" />
      </span>
    </label>
  );
}

export function FormMessage({ ok, message }: { ok: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p
      className={cn(
        "rounded-xl px-4 py-3 text-sm font-semibold",
        ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
      )}
      role={ok ? "status" : "alert"}
    >
      {message}
    </p>
  );
}

export function StatusPill({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        on ? "bg-success/10 text-success" : "bg-brand-100 text-ink-muted",
      )}
    >
      <span className={cn("size-1.5 rounded-full", on ? "bg-success" : "bg-ink-muted/50")} aria-hidden />
      {on ? onLabel : offLabel}
    </span>
  );
}
