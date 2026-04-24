type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">
        {eyebrow}
      </p>
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
        {description}
      </p>
    </div>
  );
}
