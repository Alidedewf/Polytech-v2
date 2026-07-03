import { ReactNode } from 'react';

/**
 * Заголовок секции: маленький синий лейбл (англ.) сверху + крупный заголовок,
 * как в макете «Main 2». Опционально — действие справа (напр. «Все проекты»).
 */
export default function SectionHeading({
  label,
  title,
  action,
}: {
  label: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-blue">
          {label}
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      {action ? <div className="hidden shrink-0 sm:block">{action}</div> : null}
    </div>
  );
}
