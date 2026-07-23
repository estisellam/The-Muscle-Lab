import "./SectionTitle.css";

function SectionTitle({
  eyebrow,
  title,
  highlightedText,
  description,
  align = "center",
}) {
  const sectionClass =
    align === "left"
      ? "section-title section-title-left"
      : "section-title";

  return (
    <div className={sectionClass}>
      {eyebrow && (
        <p className="section-eyebrow">
          {eyebrow}
        </p>
      )}

      <h2 className="section-heading">
        {title}

        {highlightedText && (
          <span className="section-highlight">
            {" "}
            {highlightedText}
          </span>
        )}
      </h2>

      {description && (
        <p className="section-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;