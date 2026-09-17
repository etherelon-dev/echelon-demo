type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <h2 className="font-display text-3xl font-semibold leading-tight text-bone sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-bone-dim sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
