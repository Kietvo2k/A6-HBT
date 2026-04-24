type AdminEmptyStateProps = {
  title: string;
  description: string;
};

export default function AdminEmptyState({
  title,
  description,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-line bg-white/60 px-5 py-10 text-center">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
