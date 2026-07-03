import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Статический экспорт: сайт без сервера/бэкенда, весь HTML — в out/
  output: "export",
  // Каждый маршрут — отдельная папка с index.html (удобно для статик-хостинга)
  trailingSlash: true,
  // Закрепляем корень проекта за этой папкой (в дереве несколько lockfile)
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Оптимизатор картинок недоступен в статическом экспорте — отдаём как есть
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);

