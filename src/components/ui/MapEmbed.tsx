/**
 * Встраиваемая карта (Google Maps embed, без API-ключа).
 * Точку определяем по адресу из Strapi (`query`) — так метка точнее, чем по
 * приблизительным координатам. Если адреса нет — используем координаты
 * (`lat`/`lng`). Если нет ни того, ни другого — нейтральный плейсхолдер.
 */
export default function MapEmbed({
  lat,
  lng,
  query,
  title,
  className = '',
}: {
  lat?: number | null;
  lng?: number | null;
  query?: string | null;
  title: string;
  className?: string;
}) {
  const hasCoords = lat != null && lng != null;
  if (!query && !hasCoords) {
    return <div className={`bg-brand-soft ${className}`} aria-hidden />;
  }

  const q = query ? encodeURIComponent(query) : `${lat},${lng}`;
  const src = `https://www.google.com/maps?q=${q}&z=17&hl=ru&output=embed`;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`border-0 ${className}`}
    />
  );
}
