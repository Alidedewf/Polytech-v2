import { DirectionKey, FactKey } from '@/lib/data';

type IconProps = { className?: string };

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* --- Иконки направлений деятельности (4 блока) --- */

function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <path d="M9 3h6M10 3v6.5L5.2 17a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}

function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <path d="M3 3v18h18" />
      <rect x="7" y="11" width="3" height="6" />
      <rect x="12" y="7" width="3" height="10" />
      <rect x="17" y="13" width="3" height="4" />
    </svg>
  );
}

function TransferIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </svg>
  );
}

function BuildingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <rect x="4" y="3" width="10" height="18" rx="1" />
      <path d="M14 8h6v13h-6" />
      <path d="M7 7h2M7 11h2M7 15h2M17 12h0M17 16h0" />
    </svg>
  );
}

export const DIRECTION_ICONS: Record<
  DirectionKey,
  (p: IconProps) => React.JSX.Element
> = {
  research: FlaskIcon,
  commercialization: ChartIcon,
  transfer: TransferIcon,
  innovation: BuildingIcon,
};

/* --- Иконки блока статистики «О компании» --- */

function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M18 20a6 6 0 0 0-3-5.2" />
    </svg>
  );
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

export const FACT_ICONS: Record<FactKey, (p: IconProps) => React.JSX.Element> = {
  direction: BuildingIcon,
  university: GlobeIcon,
  transfer: TransferIcon,
  research: FlaskIcon,
};

export { CalendarIcon };

/* --- Утилитарная стрелка для ссылок-«Подробнее» --- */
export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
