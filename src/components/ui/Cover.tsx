import Image from 'next/image';

/**
 * Обложка карточки: фото из Strapi (next/image) либо серый плейсхолдер
 * с лёгким градиентом, если изображения ещё нет.
 */
export default function Cover({
  url,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  url?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[var(--brand-placeholder)] ${className}`}
    >
      {url ? (
        <Image src={url} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent" />
      )}
    </div>
  );
}
