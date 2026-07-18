'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type DocItem = { title: string; file?: string };
type DocGroup = { title: string; items: DocItem[] };

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

/** Раскрывающиеся категории документов. Внутри — список файлов. */
export default function DocumentsAccordion({
  groups,
  downloadLabel,
  noFileLabel,
}: {
  groups: DocGroup[];
  downloadLabel: string;
  noFileLabel: string;
}) {
  // По умолчанию все категории свёрнуты
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div className="max-w-3xl space-y-4">
      {groups.map((group, i) => {
        const isOpen = open.includes(i);
        return (
          <div
            key={group.title}
            className="overflow-hidden rounded-2xl border border-brand-line bg-white"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-brand-soft"
            >
              <span className="text-base font-bold text-brand-ink sm:text-lg">
                {group.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isOpen ? 'bg-brand-navy text-white' : 'bg-brand-tag text-brand-blue'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.span>
            </button>

            <motion.div
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <ul className="divide-y divide-brand-line border-t border-brand-line">
                {group.items.map((item, j) => (
                  <li key={`${item.title}-${j}`} className="flex items-center gap-4 px-6 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                      <DocIcon />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-brand-ink">
                      {item.title}
                    </span>
                    {item.file ? (
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
                      >
                        {downloadLabel}
                      </a>
                    ) : (
                      <span className="shrink-0 text-xs text-brand-muted">
                        {noFileLabel}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
