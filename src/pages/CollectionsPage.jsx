import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadCollections } from '../features/collections/collectionsSlice'
import Loader from '../components/Loader'

export default function CollectionsPage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.collections)

  useEffect(() => {
    dispatch(loadCollections())
  }, [dispatch])

  return (
    <div className="container">
      <section className="hero" style={{ padding: '48px 0 24px', border: 'none' }}>
        <h1>Колекції майстерні</h1>
        <p>Лінійки виробів, обʼєднані спільною темою чи технікою.</p>
      </section>

      {status === 'loading' && <Loader label="Завантажуємо колекції…" />}
      {status === 'failed' && <div className="state-block">Помилка: {String(error)}</div>}
      {status === 'succeeded' && items.length === 0 && (
        <div className="state-block">Колекції ще не додані.</div>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 56 }}>
          {items.map((collection) => (
            <li
              key={collection.id}
              style={{
                padding: '18px 0',
                borderBottom: '1px solid var(--line)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
              }}
            >
              {collection.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
