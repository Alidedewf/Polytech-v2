import Link from 'next/link';
import Container from '@/components/ui/Container';

/** Кастомная страница 404 в стиле сайта. */
export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-brand-soft">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative py-28 text-center">
        <span className="block text-7xl font-bold leading-none tracking-tight text-brand-blue sm:text-8xl">
          404
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
          Страница не найдена
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-gray">
          Возможно, страница была перемещена или удалена. Проверьте адрес или
          вернитесь на главную.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/ru"
            className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-7 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-brand-navy/20 transition-colors hover:bg-brand-blue"
          >
            На главную
          </Link>
          <Link
            href="/ru/contacts"
            className="inline-flex items-center gap-2 rounded-md border border-brand-line bg-white px-7 py-3.5 text-[15px] font-semibold text-brand-ink transition-colors hover:border-brand-navy hover:text-brand-navy"
          >
            Контакты
          </Link>
        </div>
      </Container>
    </section>
  );
}
