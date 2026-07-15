import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import { getProjects } from '@/lib/content';
import type { Project } from '@/lib/data';

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L5 21" />
    </svg>
  );
}

function StatusBadge({ status, label }: { status: Project['status']; label: string }) {
  const active = status === 'active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {label}
    </span>
  );
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const projects = await getProjects(locale);

  return (
    <>
      <PageHeader label={t('label')} title={t('title')} description={t('intro')} />
      <Container className="py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.length > 0
            ? projects.map((p) => (
                <article
                  key={p.slug}
                  className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white sm:flex-row"
                >
                  {/* Фото */}
                  <div className="relative flex aspect-[16/10] items-center justify-center bg-brand-soft text-brand-blue/50 sm:aspect-auto sm:w-2/5">
                    {p.coverUrl ? (
                      <Image
                        src={p.coverUrl}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 260px"
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon />
                    )}
                  </div>
                  {/* Контент */}
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-brand-tag px-3 py-1 text-xs font-semibold text-brand-blue">
                        {t(`categories.${p.category}`)}
                      </span>
                      <StatusBadge status={p.status} label={t(`status.${p.status}`)} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-brand-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))
            : /* Шаблон-образец (пока проектов нет) */
              [0, 1].map((i) => (
                <article
                  key={i}
                  className="flex flex-col overflow-hidden rounded-2xl border border-dashed border-brand-line bg-white sm:flex-row"
                >
                  <div className="flex aspect-[16/10] items-center justify-center bg-brand-soft text-brand-blue/40 sm:aspect-auto sm:w-2/5">
                    <ImageIcon />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-brand-tag px-3 py-1 text-xs font-semibold text-brand-blue/70">
                        {t('categories.construction')}
                      </span>
                      <StatusBadge
                        status={i === 0 ? 'active' : 'completed'}
                        label={t(i === 0 ? 'status.active' : 'status.completed')}
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-brand-muted">
                      {t('templateTitle')}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                      {t('templateDesc')}
                    </p>
                  </div>
                </article>
              ))}
        </div>
      </Container>
    </>
  );
}
