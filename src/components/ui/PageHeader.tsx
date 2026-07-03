import Container from '@/components/ui/Container';

/** Верхний баннер внутренних страниц: лейбл + заголовок на светлом фоне. */
export default function PageHeader({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-brand-soft">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <Container className="relative py-16 lg:py-20">
        {label ? (
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-blue">
            {label}
          </span>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-gray">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
