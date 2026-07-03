/** Простой рендер массива абзацев (из rich-полей Strapi или i18n). */
export default function Prose({
  paragraphs,
  className = '',
}: {
  paragraphs: string[];
  className?: string;
}) {
  if (!paragraphs.length) return null;
  return (
    <div className={`space-y-4 text-base leading-relaxed text-brand-gray ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
