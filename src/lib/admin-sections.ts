/**
 * Конфигурация разделов админки. Каждый раздел = коллекция в бэкенде + набор
 * полей формы. Универсальный менеджер (CollectionManager) рендерит форму и
 * список по этому конфигу, поэтому новый раздел добавляется правкой одного
 * массива, без нового кода.
 */

export type FieldKind =
  | 'i18nText' // одна строка на трёх языках: base+Ru/Kk/En
  | 'i18nTextarea' // многострочный текст на трёх языках
  | 'text' // обычная строка (одна на все языки)
  | 'select' // выбор из вариантов
  | 'image' // загрузка изображения → URL
  | 'file'; // загрузка файла (PDF) → URL

export type Field = {
  kind: FieldKind;
  /** Для i18n-полей — база (title → titleRu/titleKk/titleEn). Иначе — имя поля. */
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  hint?: string;
  options?: { value: string; label: string }[]; // для select
  accept?: string; // для file
};

export type Section = {
  /** Имя коллекции в бэкенде (/api/c/:name). */
  collection: string;
  /** Пункт меню. */
  navLabel: string;
  /** Заголовок и описание страницы раздела. */
  title: string;
  subtitle: string;
  addLabel: string;
  /** Поля формы. */
  fields: Field[];
  /** Какое поле показывать заголовком строки списка. */
  listTitleKey: string;
  /** Подзаголовок строки (необязательно). */
  listSubtitleKey?: string;
  /** Картинка-превью строки (необязательно). */
  listImageKey?: string;
  /** Ссылка «Просмотр» на публичной странице раздела. */
  viewPath?: string;
};

const DOC_GROUPS = [
  { value: 'founding', label: 'Учредительные документы' },
  { value: 'permits', label: 'Разрешительные и подтверждающие' },
  { value: 'financial', label: 'Финансовая отчётность' },
  { value: 'anticorruption', label: 'Антикоррупционные документы' },
];

export const SECTIONS: Section[] = [
  {
    collection: 'projects',
    navLabel: 'Проекты',
    title: 'Проекты',
    subtitle: 'Проекты технопарка — карточки на странице «Проекты».',
    addLabel: 'Добавить проект',
    listTitleKey: 'titleRu',
    listSubtitleKey: 'descRu',
    listImageKey: 'imageUrl',
    viewPath: '/ru/projects',
    fields: [
      { kind: 'i18nText', key: 'title', label: 'Название проекта', required: true, placeholder: 'Например: Инновационный кластер' },
      { kind: 'i18nTextarea', key: 'desc', label: 'Описание проекта', required: true, rows: 4 },
      {
        kind: 'select', key: 'category', label: 'Категория',
        options: [
          { value: 'industry', label: 'Промышленность' },
          { value: 'ecology', label: 'Экология' },
          { value: 'construction', label: 'Строительство' },
        ],
      },
      {
        kind: 'select', key: 'status', label: 'Статус',
        options: [
          { value: 'active', label: 'В работе' },
          { value: 'completed', label: 'Завершён' },
        ],
      },
      { kind: 'image', key: 'imageUrl', label: 'Обложка проекта' },
    ],
  },
  {
    collection: 'vacancies',
    navLabel: 'Вакансии',
    title: 'Вакансии',
    subtitle: 'Открытые позиции на странице «Вакансии». Пусто — покажется приглашение прислать резюме.',
    addLabel: 'Добавить вакансию',
    listTitleKey: 'titleRu',
    listSubtitleKey: 'departmentRu',
    viewPath: '/ru/about/vacancies',
    fields: [
      { kind: 'i18nText', key: 'title', label: 'Должность', required: true, placeholder: 'Например: Инженер-исследователь' },
      { kind: 'i18nText', key: 'department', label: 'Отдел / направление' },
      { kind: 'i18nTextarea', key: 'description', label: 'Описание (каждый абзац с новой строки)', rows: 4 },
      { kind: 'i18nTextarea', key: 'requirements', label: 'Требования (каждое с новой строки)', rows: 4 },
    ],
  },
  {
    collection: 'documents',
    navLabel: 'Документы',
    title: 'Документы',
    subtitle: 'PDF-документы в разделе «Документы»: устав, отчёты, антикоррупционные и др.',
    addLabel: 'Добавить документ',
    listTitleKey: 'titleRu',
    listSubtitleKey: 'group',
    viewPath: '/ru/about/documents',
    fields: [
      { kind: 'select', key: 'group', label: 'Категория', required: true, options: DOC_GROUPS },
      { kind: 'i18nText', key: 'title', label: 'Название документа', required: true, placeholder: 'Например: Финансовая отчётность за 2025 год' },
      { kind: 'file', key: 'file', label: 'PDF-файл', accept: 'application/pdf', hint: 'Загрузите PDF (до 25 МБ).' },
    ],
  },
  {
    collection: 'board',
    navLabel: 'Совет директоров',
    title: 'Совет директоров',
    subtitle: 'Состав совета директоров — карточки на странице «Совет директоров».',
    addLabel: 'Добавить члена совета',
    listTitleKey: 'nameRu',
    listSubtitleKey: 'positionRu',
    listImageKey: 'photo',
    viewPath: '/ru/about/board',
    fields: [
      { kind: 'i18nText', key: 'name', label: 'ФИО', required: true, placeholder: 'Фамилия Имя Отчество' },
      { kind: 'i18nTextarea', key: 'position', label: 'Должность', rows: 2 },
      { kind: 'image', key: 'photo', label: 'Фотография' },
    ],
  },
  {
    collection: 'management',
    navLabel: 'Правление',
    title: 'Правление',
    subtitle: 'Состав правления — карточки на странице «Правление».',
    addLabel: 'Добавить члена правления',
    listTitleKey: 'nameRu',
    listSubtitleKey: 'positionRu',
    listImageKey: 'photo',
    viewPath: '/ru/about/management',
    fields: [
      { kind: 'i18nText', key: 'name', label: 'ФИО', required: true, placeholder: 'Фамилия Имя Отчество' },
      { kind: 'i18nTextarea', key: 'position', label: 'Должность', rows: 2 },
      { kind: 'image', key: 'photo', label: 'Фотография' },
    ],
  },
  {
    collection: 'partners',
    navLabel: 'Партнёры',
    title: 'Партнёры',
    subtitle: 'Логотипы партнёров на странице «Партнёры».',
    addLabel: 'Добавить партнёра',
    listTitleKey: 'name',
    listImageKey: 'logoUrl',
    viewPath: '/ru/partners',
    fields: [
      { kind: 'text', key: 'name', label: 'Название партнёра', required: true },
      { kind: 'text', key: 'website', label: 'Сайт (ссылка)', placeholder: 'https://...' },
      { kind: 'image', key: 'logoUrl', label: 'Логотип' },
    ],
  },
];

/** Языки для i18n-полей. */
export const LANG_TABS: { code: 'Ru' | 'Kk' | 'En'; label: string }[] = [
  { code: 'Ru', label: 'Русский' },
  { code: 'Kk', label: 'Қазақша' },
  { code: 'En', label: 'English' },
];
