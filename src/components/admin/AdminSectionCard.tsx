type AdminSectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function AdminSectionCard({
  title,
  description,
  children,
}: AdminSectionCardProps) {
  return (
    <section className="paper-card rounded-[2rem] p-5 sm:p-6">
      <div className="mb-5 space-y-2">
        <h2 className="text-2xl">{title}</h2>
        {description ? (
          <p className="text-sm leading-7 text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
