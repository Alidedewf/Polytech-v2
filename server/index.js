/**
 * Мини-API для админки PolyTech Park.
 *
 *  Аутентификация:
 *   - POST   /api/auth/login            — вход (email+пароль → JWT)
 *
 *  Универсальные коллекции (name из белого списка COLLECTIONS):
 *   - GET    /api/c/:name               — список (публично, читает сборка сайта)
 *   - POST   /api/c/:name               — создать запись (нужен токен)
 *   - PUT    /api/c/:name/:id           — изменить запись (нужен токен)
 *   - DELETE /api/c/:name/:id           — удалить запись (нужен токен)
 *
 *  Загрузка файлов (картинки/PDF, base64 в JSON):
 *   - POST   /api/upload                — { filename, dataUrl } → { url } (нужен токен)
 *   - GET    /uploads/<file>            — отдача загруженных файлов (публично)
 *
 *  Проекты — совместимость со старым фронтом (алиасы к коллекции "projects"):
 *   - GET/POST /api/projects, PUT/DELETE /api/projects/:id
 *
 * Хранилище — JSON-файлы по одному на коллекцию (server/data/<name>.json).
 * Загруженные файлы — server/uploads/. Обе папки живут на сервере (в git не идут).
 * Настройки — через переменные окружения (см. .env.example).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@polytech.kz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
// Токен с правом записи (Contents: write) для запуска пересборки сайта на GitHub
const GH_DISPATCH_TOKEN = process.env.GH_DISPATCH_TOKEN || '';
const GH_REPO = process.env.GH_REPO || 'Alidedewf/Polytech-v2';
// Публичный адрес самого бэкенда — на него будут ссылаться загруженные файлы
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || 'https://api.polytechpark.kz').replace(/\/+$/, '');

// Белый список коллекций (защита от произвольных имён файлов / мусора)
const COLLECTIONS = new Set([
  'projects',    // проекты
  'vacancies',   // вакансии
  'documents',   // документы (устав, отчёты, антикор — различаются полем group)
  'board',       // совет директоров
  'management',  // правление
  'partners',    // партнёры
]);

/** Просит GitHub пересобрать сайт (repository_dispatch). Тихо ничего не делает,
 *  если токен не задан. Ошибки не роняют запрос — только лог. */
function triggerRebuild() {
  if (!GH_DISPATCH_TOKEN) return;
  const body = JSON.stringify({ event_type: 'content-updated' });
  const req = https.request(
    {
      hostname: 'api.github.com',
      path: `/repos/${GH_REPO}/dispatches`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GH_DISPATCH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'polytech-admin',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    (res) => {
      if (res.statusCode >= 300) {
        console.error('Пересборка: GitHub ответил', res.statusCode);
      }
      res.resume();
    },
  );
  req.on('error', (e) => console.error('Пересборка: ошибка', e.message));
  req.write(body);
  req.end();
}

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

function fileFor(name) {
  return path.join(DATA_DIR, `${name}.json`);
}
function readCollection(name) {
  try {
    return JSON.parse(fs.readFileSync(fileFor(name), 'utf8'));
  } catch {
    return [];
  }
}
function writeCollection(name, list) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(fileFor(name), JSON.stringify(list, null, 2));
}

function genId() {
  return Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
}

/** Заготовки контента (то, что сейчас на сайте) — чтобы при первом запуске
 *  база наполнилась и редактор сразу увидел всё в админке. Встроены прямо
 *  в файл, чтобы деплой оставался заменой одного index.js. */
const SEED = {
  board: [
    { id: 'seed-board-1', nameRu: 'Утешев Нурлан Сулейменович', nameKk: 'Утешев Нурлан Сулейменович', nameEn: 'Uteshev Nurlan Suleimenovich', positionRu: 'Председатель Совета директоров, Заместитель Председателя Федерации профсоюзов РК, независимый директор', positionKk: 'Директорлар кеңесінің төрағасы, ҚР Кәсіподақтар федерациясы төрағасының орынбасары, тәуелсіз директор', positionEn: 'Chairman of the Board of Directors; Deputy Chairman of the Federation of Trade Unions of the Republic of Kazakhstan; independent director', photo: '/team/uteshev.jpg' },
    { id: 'seed-board-2', nameRu: 'Шаймерденов Жомарт Маратович', nameKk: 'Шаймерденов Жомарт Маратович', nameEn: 'Shaimerdenov Zhomart Maratovich', positionRu: 'Руководитель ТОО «TB Technologies»', positionKk: '«TB Technologies» ЖШС басшысы', positionEn: 'Head of TB Technologies LLP', photo: '/team/shaimerdenov.jpg' },
    { id: 'seed-board-3', nameRu: 'Айтжанова Динара Нуржановна', nameKk: 'Айтжанова Динара Нуржановна', nameEn: 'Aitzhanova Dinara Nurzhanovna', positionRu: 'Эксперт Международной организации труда, проектный менеджер IPMA, независимый директор', positionKk: 'Халықаралық еңбек ұйымының сарапшысы, IPMA жобалық менеджері, тәуелсіз директор', positionEn: 'Expert of the International Labour Organization; IPMA project manager; independent director', photo: '/team/aitzhanova.jpg' },
    { id: 'seed-board-4', nameRu: 'Кульдеев Ержан Итеменович', nameKk: 'Кульдеев Ержан Итеменович', nameEn: 'Kuldeev Yerzhan Itemenovich', positionRu: 'Член Правления — проректор по науке и корпоративному развитию НАО «КазНИТУ имени К.И. Сатпаева»', positionKk: 'Басқарма мүшесі — «Қ.И. Сәтбаев атындағы ҚазҰТЗУ» КеАҚ ғылым және корпоративтік даму жөніндегі проректоры', positionEn: 'Member of the Management Board — Vice-Rector for Science and Corporate Development, Satbayev University', photo: '/team/kuldeev.png' },
    { id: 'seed-board-5', nameRu: 'Мадиева Дана', nameKk: 'Мадиева Дана', nameEn: 'Madieva Dana', positionRu: 'Руководитель МЦРиАМ НАО «КазНИТУ имени К.И. Сатпаева»', positionKk: '«Қ.И. Сәтбаев атындағы ҚазҰТЗУ» КеАҚ МЦРиАМ басшысы', positionEn: 'Head of the MTsRiAM, Satbayev University', photo: '/team/madieva.jpg' },
    { id: 'seed-board-6', nameRu: 'Джаманова Ажар Болатовна', nameKk: 'Джаманова Ажар Болатовна', nameEn: 'Dzhamanova Azhar Bolatovna', positionRu: 'Старший советник АО «Авиационная администрация Казахстана», независимый директор', positionKk: '«Қазақстан авиация әкімшілігі» АҚ аға кеңесшісі, тәуелсіз директор', positionEn: 'Senior Advisor, Aviation Administration of Kazakhstan JSC; independent director', photo: '' },
    { id: 'seed-board-7', nameRu: 'Жакипбеков Жандос Нурланович', nameKk: 'Жакипбеков Жандос Нурланович', nameEn: 'Zhakipbekov Zhandos Nurlanovich', positionRu: 'И.О. Председателя Правления АО «PolyTechPark»', positionKk: '«PolyTechPark» АҚ Басқарма Төрағасының міндетін атқарушы', positionEn: 'Acting Chairman of the Management Board of PolyTechPark JSC', photo: '' },
  ],
  management: [
    { id: 'seed-mgmt-1', nameRu: 'Жакипбеков Жандос Нурланович', nameKk: 'Жакипбеков Жандос Нурланович', nameEn: 'Zhakipbekov Zhandos Nurlanovich', positionRu: 'Исполняющий обязанности Председателя Правления, член Правления', positionKk: 'Басқарма Төрағасының міндетін атқарушы, Басқарма мүшесі', positionEn: 'Acting Chairman of the Management Board, member of the Management Board', photo: '' },
    { id: 'seed-mgmt-2', nameRu: 'Нетаев Даулет Жолдыбаевич', nameKk: 'Нетаев Даулет Жолдыбаевич', nameEn: 'Netaev Daulet Zholdybaevich', positionRu: 'Заместитель Председателя Правления, член Правления', positionKk: 'Басқарма Төрағасының орынбасары, Басқарма мүшесі', positionEn: 'Deputy Chairman of the Management Board, member of the Management Board', photo: '/team/netaev.jpg' },
  ],
  documents: [
    { id: 'seed-doc-1', group: 'founding', titleRu: 'Устав', titleKk: 'Жарғы', titleEn: 'Charter', file: '/docs/ustav.pdf' },
    { id: 'seed-doc-2', group: 'permits', titleRu: 'Аккредитация субъекта научной и (или) научно-технической деятельности', titleKk: 'Ғылыми және (немесе) ғылыми-техникалық қызмет субъектісін аккредиттеу', titleEn: 'Accreditation as a subject of scientific and (or) scientific-technical activity', file: '/docs/akkreditaciya.pdf' },
    { id: 'seed-doc-3', group: 'permits', titleRu: 'Сертификат соответствия СТ РК ISO 9001-2016', titleKk: 'СТ РК ISO 9001-2016 сәйкестік сертификаты', titleEn: 'Certificate of conformity ST RK ISO 9001-2016', file: '/docs/sertifikat-iso-9001.pdf' },
    { id: 'seed-doc-4', group: 'financial', titleRu: 'Финансовая отчётность за 2025 год', titleKk: '2025 жылғы қаржылық есептілік', titleEn: 'Financial statements for 2025', file: '/docs/otchet-2025.pdf' },
    { id: 'seed-doc-5', group: 'financial', titleRu: 'Финансовая отчётность за 2024 год', titleKk: '2024 жылғы қаржылық есептілік', titleEn: 'Financial statements for 2024', file: '/docs/otchet-2024.pdf' },
    { id: 'seed-doc-6', group: 'financial', titleRu: 'Финансовая отчётность за 2023 год', titleKk: '2023 жылғы қаржылық есептілік', titleEn: 'Financial statements for 2023', file: '/docs/otchet-2023.pdf' },
  ],
};

/** Первичное наполнение: коллекции без данных заполняем из SEED.
 *  Уже существующие data/<name>.json не трогаем. */
function seedIfMissing() {
  for (const name of Object.keys(SEED)) {
    if (fs.existsSync(fileFor(name))) continue; // уже есть данные — не трогаем
    try {
      writeCollection(name, SEED[name]);
      console.log(`Сид: ${name} наполнен (${SEED[name].length})`);
    } catch (e) {
      console.error(`Сид: не удалось наполнить ${name}:`, e.message);
    }
  }
}

/** Готовит тело записи: отбрасываем служебные поля, оставляем присланные данные. */
function cleanBody(body) {
  const b = body && typeof body === 'object' ? { ...body } : {};
  delete b.id;
  delete b.createdAt;
  return b;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' })); // с запасом под base64-файлы
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Не авторизован' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Сессия истекла — войдите заново' });
  }
}

/** Middleware: проверяет, что :name — разрешённая коллекция. */
function requireCollection(req, res, next) {
  if (!COLLECTIONS.has(req.params.name)) {
    return res.status(404).json({ error: 'Неизвестный раздел' });
  }
  next();
}

// --- Авторизация ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Неверный логин или пароль' });
});

// --- Универсальные коллекции ---
app.get('/api/c/:name', requireCollection, (req, res) => {
  res.json(readCollection(req.params.name));
});

app.post('/api/c/:name', requireAuth, requireCollection, (req, res) => {
  const list = readCollection(req.params.name);
  const item = { id: genId(), ...cleanBody(req.body), createdAt: new Date().toISOString() };
  list.unshift(item);
  writeCollection(req.params.name, list);
  triggerRebuild();
  res.status(201).json(item);
});

app.put('/api/c/:name/:id', requireAuth, requireCollection, (req, res) => {
  const list = readCollection(req.params.name);
  const idx = list.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Запись не найдена' });
  list[idx] = { ...list[idx], ...cleanBody(req.body), id: list[idx].id };
  writeCollection(req.params.name, list);
  triggerRebuild();
  res.json(list[idx]);
});

app.delete('/api/c/:name/:id', requireAuth, requireCollection, (req, res) => {
  const list = readCollection(req.params.name);
  const next = list.filter((x) => x.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: 'Запись не найдена' });
  writeCollection(req.params.name, next);
  triggerRebuild();
  res.json({ ok: true });
});

// --- Загрузка файлов (base64) ---
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf']);

app.post('/api/upload', requireAuth, (req, res) => {
  const { filename, dataUrl } = req.body || {};
  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'Нет данных файла' });
  }
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!m) return res.status(400).json({ error: 'Неверный формат файла' });

  // Расширение берём из имени файла, при отсутствии — из mime
  let ext = (String(filename || '').split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    const mime = m[1];
    const byMime = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'application/pdf': 'pdf' };
    ext = byMime[mime] || '';
  }
  if (!ALLOWED_EXT.has(ext)) {
    return res.status(400).json({ error: 'Тип файла не поддерживается (только изображения и PDF)' });
  }

  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 25 * 1024 * 1024) {
    return res.status(413).json({ error: 'Файл слишком большой (максимум 25 МБ)' });
  }

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const name = `${genId()}.${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, name), buf);
  res.status(201).json({ url: `${PUBLIC_BASE_URL}/uploads/${name}` });
});

// --- Проекты: алиасы к коллекции "projects" (совместимость со старым фронтом) ---
app.get('/api/projects', (req, res) => {
  res.json(readCollection('projects'));
});
app.post('/api/projects', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.titleRu || !b.descRu) {
    return res.status(400).json({ error: 'Заполните заголовок и описание (RU)' });
  }
  const list = readCollection('projects');
  const item = {
    id: genId(),
    ...cleanBody(b),
    category: b.category || 'industry',
    status: b.status || 'active',
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
  list.unshift(item);
  writeCollection('projects', list);
  triggerRebuild();
  res.status(201).json(item);
});
app.put('/api/projects/:id', requireAuth, (req, res) => {
  const list = readCollection('projects');
  const idx = list.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Проект не найден' });
  list[idx] = { ...list[idx], ...cleanBody(req.body), id: list[idx].id };
  writeCollection('projects', list);
  triggerRebuild();
  res.json(list[idx]);
});
app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const list = readCollection('projects');
  const next = list.filter((x) => x.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: 'Проект не найден' });
  writeCollection('projects', next);
  triggerRebuild();
  res.json({ ok: true });
});

seedIfMissing();

app.listen(PORT, () => {
  console.log(`✅ Admin backend: http://localhost:${PORT}/api`);
});
