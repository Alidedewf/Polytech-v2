import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';

/** Заглушка для разделов, контент которых придёт из Strapi (этап 2). */
export default function ComingSoon() {
  const t = useTranslations('common');
  return (
    <Container className="py-24 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-tag text-brand-blue">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
        <p className="mt-6 text-lg font-medium text-brand-muted">
          {t('inDevelopment')}
        </p>
      </div>
    </Container>
  );
}
