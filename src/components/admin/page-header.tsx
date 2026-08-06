type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-rubik)] text-2xl font-bold text-ink">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      ) : null}
    </div>
  );
}
