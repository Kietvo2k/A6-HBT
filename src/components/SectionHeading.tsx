type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignmentClassName =
    align === "center" ? "mx-auto items-center text-center" : "";

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignmentClassName}`}>
      <span className="sticker inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        {eyebrow}
      </span>
      <h2 className="text-3xl text-shadow-sm sm:text-4xl lg:text-[2.7rem]">
        {title}
      </h2>
      <p className="text-base leading-7 text-muted sm:text-lg">{description}</p>
    </div>
  );
}
