/**
 * Мини-API для админки PolyTech Park.
 *  - POST /api/auth/login        — вход (email+пароль → JWT)
 *  - GET  /api/projects          — список проектов (публично, читает сборка сайта)
 *  - POST /api/projects          — создать проект (нужен токен)
 *  - DELETE /api/projects/:id     — удалить проект (нужен токен)
 *
 * Хранилище — простой JSON-файл (server/data/projects.json).
 * Настройки через переменные окружения (см. .env.example).
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@polytech.kz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'projects.json');

function readProjects() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function writeProjects(list) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
}

/** Транслитерация кириллицы + приведение к slug. */
function slugify(input) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
    щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    ә: 'a', ғ: 'g', қ: 'q', ң: 'n', ө: 'o', ұ: 'u', ү: 'u', һ: 'h', і: 'i',
  };
  return (input || '')
    .toLowerCase()
    .split('')
    .map((ch) => (ch in map ? map[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'project';
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

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

// --- Авторизация ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Неверный логин или пароль' });
});

// --- Проекты ---
app.get('/api/projects', (req, res) => {
  res.json(readProjects());
});

app.post('/api/projects', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.titleRu || !b.descRu) {
    return res.status(400).json({ error: 'Заполните заголовок и описание (RU)' });
  }
  const list = readProjects();
  const project = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    slug: slugify(b.slug || b.titleRu),
    titleRu: b.titleRu,
    titleKk: b.titleKk || '',
    titleEn: b.titleEn || '',
    descRu: b.descRu,
    descKk: b.descKk || '',
    descEn: b.descEn || '',
    imageUrl: b.imageUrl || '',
    category: b.category || 'industry',
    status: b.status || 'active',
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
  list.unshift(project);
  writeProjects(list);
  res.status(201).json(project);
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const list = readProjects();
  const next = list.filter((p) => p.id !== req.params.id);
  if (next.length === list.length) {
    return res.status(404).json({ error: 'Проект не найден' });
  }
  writeProjects(next);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Admin backend: http://localhost:${PORT}/api`);
});
