import { Link } from '@/i18n/routing';
import { ArrowIcon } from '@/components/ui/icons';

/** Ссылка-возврат к родительскому разделу (со стрелкой влево). */
export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-navy"
    >
      <ArrowIcon className="h-4 w-4 rotate-180" />
      {label}
    </Link>
  );
}
