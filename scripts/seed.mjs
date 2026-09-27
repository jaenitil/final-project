

import axios from 'axios'

const BASE_URL = process.env.VITE_API_BASE_URL || 'https://frontend53.somee.com/api'

const [, , email, password] = process.argv

if (!email || !password) {
  console.error('Використання: node scripts/seed.mjs <email> <пароль>')
  process.exit(1)
}

const api = axios.create({ baseURL: BASE_URL })

const COLLECTIONS = ['Ранкова роса', 'Місячне сяйво', 'Земні барви', 'Морська глибина']

const PIECES = [
  {
    name: 'Каблучка «Ранкова роса»',
    year: 2024,
    volume: 3.2,
    price: 4200,
    color: 'жовте золото',
    description: 'Тонка каблучка з крапельним діамантом, натхненна вранішньою росою на траві.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Ring',
  },
  {
    name: 'Каблучка «Місячна доріжка»',
    year: 2024,
    volume: 4.1,
    price: 5600,
    color: 'біле золото',
    description: 'Широка каблучка з доріжкою дрібних камінців — відблиск місяця на воді.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Ring',
  },
  {
    name: 'Каблучка «Земляний слід»',
    year: 2023,
    volume: 5.0,
    price: 3800,
    color: 'рожеве золото',
    description: 'Масивна каблучка з матовою фактурою, схожа на слід на теплій землі.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Ring',
  },
  {
    name: 'Сережки «Крапельки роси»',
    year: 2024,
    volume: 2.4,
    price: 3100,
    color: 'срібло',
    description: 'Маленькі сережки-пусети у формі краплі — легкі, на щодень.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Earrings',
  },
  {
    name: 'Сережки «Місячні півмісяці»',
    year: 2024,
    volume: 3.6,
    price: 4700,
    color: 'жовте золото',
    description: 'Довгі сережки у формі півмісяця з мінімальним оздобленням.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Earrings',
  },
  {
    name: 'Сережки «Глибина»',
    year: 2023,
    volume: 4.8,
    price: 5200,
    color: 'чорне родіювання',
    description: 'Контрастні сережки з темним покриттям і одним акцентним каменем.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Earrings',
  },
  {
    name: 'Кулон «Крапля роси»',
    year: 2024,
    volume: 2.9,
    price: 3600,
    color: 'жовте золото',
    description: 'Кулон-крапля на тонкому ланцюжку, носиться і окремо, і в комплекті.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Pendant',
  },
  {
    name: 'Кулон «Повня»',
    year: 2024,
    volume: 3.3,
    price: 4400,
    color: 'біле золото',
    description: 'Круглий кулон-медальйон з гравіюванням у формі повного місяця.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Pendant',
  },
  {
    name: 'Намисто «Земні барви»',
    year: 2023,
    volume: 8.5,
    price: 6300,
    color: 'бронза',
    description: 'Багатошарове намисто з натуральним камінням теплих відтінків.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Necklace',
  },
  {
    name: 'Браслет «Морська хвиля»',
    year: 2024,
    volume: 6.2,
    price: 3900,
    color: 'срібло',
    description: 'Гнучкий браслет-ланцюжок із хвилястою текстурою.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Bracelet',
  },
  {
    name: 'Браслет «Прибій»',
    year: 2024,
    volume: 5.7,
    price: 4100,
    color: 'жовте золото',
    description: 'Браслет із дрібним плетінням, що нагадує піну морської хвилі.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Bracelet',
  },
  {
    name: 'Браслет «Глибина»',
    year: 2023,
    volume: 7.0,
    price: 5100,
    color: 'чорне родіювання',
    description: 'Масивний браслет з темним покриттям для вечірнього образу.',
    image: 'https://placehold.co/600x600/ece5d6/6e5228?text=Bracelet',
  },
]

function extractId(data) {
  if (typeof data === 'number') return data
  return data?.id ?? data?.Id ?? null
}

async function login() {
  const { data } = await api.post('/auth/login', { email, password })
  const token = typeof data === 'string' ? data : data?.token || data?.accessToken || data?.jwt
  if (!token) {
    throw new Error('Не вдалося отримати токен. Перевір email/пароль (реєструвався через /register?).')
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`
  console.log('✓ Увійшли успішно')
}

async function seedCollections() {
  const ids = []
  for (const name of COLLECTIONS) {
    try {
      const { data } = await api.post('/manufactures', { name })
      const id = extractId(data)
      console.log(`✓ Колекція «${name}» створена${id ? ` (id ${id})` : ''}`)
      ids.push(id)
    } catch (err) {
      console.warn(`… колекцію «${name}» не створено (можливо, вже існує):`, err.response?.status)
      ids.push(null)
    }
  }
  return ids.filter((id) => id != null)
}

async function seedPieces(collectionIds) {
  for (let i = 0; i < PIECES.length; i++) {
    const piece = PIECES[i]
    const manufactureId = collectionIds.length
      ? collectionIds[i % collectionIds.length]
      : null

    try {
      await api.post('/cars', { ...piece, manufactureId })
      console.log(`✓ Додано: ${piece.name}`)
    } catch (err) {
      console.error(`✗ Не вдалося додати «${piece.name}»:`, err.response?.status, err.response?.data)
    }
  }
}

async function main() {
  console.log(`Заповнюємо каталог на ${BASE_URL} …`)
  await login()
  const collectionIds = await seedCollections()
  await seedPieces(collectionIds)
  console.log('Готово! Онови сторінку каталогу в застосунку.')
}

main().catch((err) => {
  console.error('Помилка seed-скрипта:', err.message)
  process.exit(1)
})
