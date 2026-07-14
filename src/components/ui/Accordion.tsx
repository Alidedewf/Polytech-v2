'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export type AccordionItem = {
  key: string;
  title: string;
  desc?: string;
  content: ReactNode;
};

/** Раскрывающийся список: клик по теме плавно разворачивает её содержимое. */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (key: string) =>
    setOpen((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  return (
    <div className="divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
      {items.map((item) => {
        const isOpen = open.includes(item.key);
        return (
          <div key={item.key}>
            <button
              type="button"
              onClick={() => toggle(item.key)}
              aria-expanded={isOpen}
              aria-controls={`section-${item.key}`}
              className="flex w-full items-center gap-5 px-6 py-6 text-left transition-colors hover:bg-brand-soft sm:px-7"
            >
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-lg font-bold transition-colors ${
                    isOpen ? 'text-brand-navy' : 'text-brand-ink'
                  }`}
                >
                  {item.title}
                </span>
                {item.desc ? (
                  <span className="mt-1 block text-sm text-brand-muted">
                    {item.desc}
                  </span>
                ) : null}
              </span>

              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isOpen
                    ? 'bg-brand-navy text-white'
                    : 'bg-brand-tag text-brand-blue'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.span>
            </button>

            <motion.div
              id={`section-${item.key}`}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-brand-line px-6 pb-8 pt-6 sm:px-7">
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
