type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-brand-900 sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
