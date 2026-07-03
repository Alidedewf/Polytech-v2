import { ReactNode } from 'react';

/** Центрирующий контейнер с единой максимальной шириной и отступами. */
export default function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
