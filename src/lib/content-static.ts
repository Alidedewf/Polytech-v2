/**
 * Статический контент сайта (лендинг без бэкенда).
 *
 * Раньше эти данные приходили из CMS. Для статического сайта они вшиты прямо
 * во фронт и локализованы на ru/kk/en. Источник текстов — демо-сиды бэкенда.
 * Правки контента делаются здесь и требуют пересборки.
 */

import type { Service, Partner, Leader, DocItem, ContactInfo } from './data';
import type { Locale } from './site';

/* --------------------------------- Услуги --------------------------------- */

export const SERVICES: Record<Locale, Service[]> = {
  ru: [
    {
      slug: 'research',
      category: 'research',
      title: 'Научные исследования и НИОКР',
      description:
        'Прикладные научно-исследовательские и опытно-конструкторские работы под задачи индустриальных партнёров.',
      paragraphs: [
        'Проводим прикладные научно-исследовательские и опытно-конструкторские работы под задачи индустриальных партнёров: от постановки задачи и лабораторных испытаний до создания опытных образцов и технической документации.',
      ],
    },
    {
      slug: 'commercialization',
      category: 'commercialization',
      title: 'Коммерциализация технологий',
      description:
        'Превращаем научную разработку в рыночный продукт: бизнес-модель, подготовка к рынку и инвестициям.',
      paragraphs: [
        'Помогаем превратить научную разработку в рыночный продукт: оцениваем потенциал технологии, выстраиваем бизнес-модель, готовим продукт к выходу на рынок и привлечению инвестиций.',
      ],
    },
    {
      slug: 'transfer',
      category: 'transfer',
      title: 'Технологический трансфер',
      description:
        'Передаём технологии и инженерную экспертизу бизнесу: подбор решений, внедрение и обучение персонала.',
      paragraphs: [
        'Передаём технологии и инженерную экспертизу бизнесу: подбираем готовые решения под потребности предприятия, сопровождаем внедрение и обучаем персонал заказчика.',
      ],
    },
  ],
  kk: [
    {
      slug: 'research',
      category: 'research',
      title: 'Ғылыми зерттеулер және ҒЗТКЖ',
      description:
        'Индустриялық серіктестердің міндеттері бойынша қолданбалы ғылыми-зерттеу және тәжірибелік-конструкторлық жұмыстар.',
      paragraphs: [
        'Индустриялық серіктестердің міндеттері бойынша қолданбалы ғылыми-зерттеу және тәжірибелік-конструкторлық жұмыстарды жүргіземіз: міндетті қоюдан және зертханалық сынақтардан тәжірибелік үлгілер мен техникалық құжаттаманы жасауға дейін.',
      ],
    },
    {
      slug: 'commercialization',
      category: 'commercialization',
      title: 'Технологияларды коммерцияландыру',
      description:
        'Ғылыми әзірлемені нарықтық өнімге айналдырамыз: бизнес-модель, нарыққа және инвестицияға дайындау.',
      paragraphs: [
        'Ғылыми әзірлемені нарықтық өнімге айналдыруға көмектесеміз: технологияның әлеуетін бағалаймыз, бизнес-модель құрамыз, өнімді нарыққа шығаруға және инвестиция тартуға дайындаймыз.',
      ],
    },
    {
      slug: 'transfer',
      category: 'transfer',
      title: 'Технологиялық трансфер',
      description:
        'Технологиялар мен инженерлік сараптаманы бизнеске береміз: шешімдерді таңдау, енгізу және оқыту.',
      paragraphs: [
        'Технологиялар мен инженерлік сараптаманы бизнеске береміз: кәсіпорын қажеттіліктеріне сай дайын шешімдерді таңдаймыз, енгізуді сүйемелдейміз және тапсырыс беруші қызметкерлерін оқытамыз.',
      ],
    },
  ],
  en: [
    {
      slug: 'research',
      category: 'research',
      title: 'Scientific research and R&D',
      description:
        'Applied research and development work for the needs of industrial partners.',
      paragraphs: [
        'We carry out applied research and development work for the needs of industrial partners: from defining the task and lab testing to creating prototypes and technical documentation.',
      ],
    },
    {
      slug: 'commercialization',
      category: 'commercialization',
      title: 'Technology commercialization',
      description:
        'We turn a scientific development into a market product: business model, market and investment readiness.',
      paragraphs: [
        'We help turn a scientific development into a market product: we assess the potential of the technology, build a business model, and prepare the product for market entry and investment.',
      ],
    },
    {
      slug: 'transfer',
      category: 'transfer',
      title: 'Technology transfer',
      description:
        'We transfer technology and engineering expertise to business: solution selection, rollout and training.',
      paragraphs: [
        'We transfer technology and engineering expertise to business: we select ready-made solutions for the enterprise, support implementation and train the client staff.',
      ],
    },
  ],
};

/* -------------------------------- Партнёры -------------------------------- */
/** Названия одинаковы во всех локалях; логотипов пока нет — показываем текст. */
const PARTNER_NAMES = [
  'Satbayev University',
  'АО «Казахмыс»',
  'KazMinerals',
  'Astana Hub',
  'QazTech',
];

export const PARTNERS: Partner[] = PARTNER_NAMES.map((name) => ({
  name,
  website: null,
  logoUrl: null,
}));

/* ------------------------------- Руководство ------------------------------ */

export const LEADERS: Record<Locale, Leader[]> = {
  ru: [
    {
      fullName: 'Айдар Сериков',
      position: 'Генеральный директор',
      photoUrl: null,
      bio: [
        'Отвечает за стратегическое развитие технопарка и взаимодействие с индустриальными партнёрами. Более 15 лет опыта в управлении технологическими проектами.',
      ],
    },
    {
      fullName: 'Гульнара Ахметова',
      position: 'Директор по науке',
      photoUrl: null,
      bio: [
        'Курирует научно-исследовательские проекты и работу лабораторий. Кандидат технических наук.',
      ],
    },
    {
      fullName: 'Тимур Калиев',
      position: 'Директор по коммерциализации',
      photoUrl: null,
      bio: [
        'Отвечает за вывод разработок на рынок и привлечение инвестиций в проекты резидентов.',
      ],
    },
  ],
  kk: [
    {
      fullName: 'Айдар Сериков',
      position: 'Бас директор',
      photoUrl: null,
      bio: [
        'Технопарктің стратегиялық дамуы мен индустриялық серіктестермен өзара әрекеттестікке жауапты. Технологиялық жобаларды басқаруда 15 жылдан астам тәжірибесі бар.',
      ],
    },
    {
      fullName: 'Гүлнара Ахметова',
      position: 'Ғылым жөніндегі директор',
      photoUrl: null,
      bio: [
        'Ғылыми-зерттеу жобалары мен зертханалардың жұмысын үйлестіреді. Техника ғылымдарының кандидаты.',
      ],
    },
    {
      fullName: 'Тимур Калиев',
      position: 'Коммерцияландыру жөніндегі директор',
      photoUrl: null,
      bio: [
        'Әзірлемелерді нарыққа шығаруға және резиденттер жобаларына инвестиция тартуға жауапты.',
      ],
    },
  ],
  en: [
    {
      fullName: 'Aidar Serikov',
      position: 'General Director',
      photoUrl: null,
      bio: [
        'Responsible for the strategic development of the technopark and engagement with industrial partners. Over 15 years of experience managing technology projects.',
      ],
    },
    {
      fullName: 'Gulnara Akhmetova',
      position: 'Director of Science',
      photoUrl: null,
      bio: [
        'Oversees research projects and the work of the laboratories. Candidate of Technical Sciences.',
      ],
    },
    {
      fullName: 'Timur Kaliyev',
      position: 'Director of Commercialization',
      photoUrl: null,
      bio: [
        'Responsible for bringing developments to market and attracting investment into resident projects.',
      ],
    },
  ],
};

/* -------------------------------- Документы ------------------------------- */
/** Реальные PDF пока не приложены — показываем «файл скоро будет добавлен». */
export const DOCUMENTS: Record<Locale, DocItem[]> = {
  ru: [
    { title: 'Устав АО «PolyTechPark»', category: 'Учредительные документы', fileUrl: null },
    { title: 'Политика в области качества', category: 'Политики', fileUrl: null },
    { title: 'Годовой отчёт за 2024 год', category: 'Отчётность', fileUrl: null },
  ],
  kk: [
    { title: '«PolyTechPark» АҚ Жарғысы', category: 'Құрылтай құжаттары', fileUrl: null },
    { title: 'Сапа саласындағы саясат', category: 'Саясаттар', fileUrl: null },
    { title: '2024 жылғы жылдық есеп', category: 'Есептілік', fileUrl: null },
  ],
  en: [
    { title: 'Charter of PolyTechPark JSC', category: 'Founding documents', fileUrl: null },
    { title: 'Quality policy', category: 'Policies', fileUrl: null },
    { title: 'Annual report for 2024', category: 'Reporting', fileUrl: null },
  ],
};

/* -------------------------------- Контакты -------------------------------- */

const CONTACT_ADDRESS: Record<Locale, string> = {
  ru: 'г. Алматы, Бостандыкский район, ул. Сатпаева, 22/5',
  kk: 'Алматы қ., Бостандық ауданы, Сәтбаев к-сі, 22/5',
  en: 'Almaty, Bostandyk district, Satbayev St, 22/5',
};

export const CONTACT: Record<Locale, ContactInfo> = {
  ru: {
    address: CONTACT_ADDRESS.ru,
    phone: '+7 7172 95 43 43',
    email: 'info@stsolutions.kz',
    mapLatitude: 43.2389,
    mapLongitude: 76.9302,
  },
  kk: {
    address: CONTACT_ADDRESS.kk,
    phone: '+7 7172 95 43 43',
    email: 'info@stsolutions.kz',
    mapLatitude: 43.2389,
    mapLongitude: 76.9302,
  },
  en: {
    address: CONTACT_ADDRESS.en,
    phone: '+7 7172 95 43 43',
    email: 'info@stsolutions.kz',
    mapLatitude: 43.2389,
    mapLongitude: 76.9302,
  },
};
