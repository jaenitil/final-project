import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadFavorites } from '../features/favorites/favoritesSlice'
import PieceCard from '../components/PieceCard'
import Loader from '../components/Loader'

export default function FavoritesPage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.favorites)

  useEffect(() => {
    dispatch(loadFavorites())
  }, [dispatch])

  return (
    <div className="container">
      <section className="hero" style={{ padding: '48px 0 24px', border: 'none' }}>
        <h1>Обране</h1>
        <p>Вироби, які ви зберегли для себе.</p>
      </section>

      {status === 'loading' && <Loader label="Завантажуємо обране…" />}
      {status === 'failed' && <div className="state-block">Помилка: {String(error)}</div>}
      {status === 'succeeded' && items.length === 0 && (
        <div className="state-block">Ви ще нічого не додали в обране.</div>
      )}

      {items.length > 0 && (
        <div className="piece-grid">
          {items.map((piece) => (
            <PieceCard key={piece.id ?? piece.carId} piece={piece} />
          ))}
        </div>
      )}
    </div>
  )
}
