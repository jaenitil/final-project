import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPieces, loadPiecesByPrice, setPriceRange } from '../features/pieces/piecesSlice'
import { loadFavorites } from '../features/favorites/favoritesSlice'
import { loadCollections } from '../features/collections/collectionsSlice'
import PieceCard from '../components/PieceCard'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'
import { useDebounce } from '../hooks/useDebounce'
import { PIECE_TYPES, inferPieceType } from '../utils/pieceType'

const PAGE_SIZE = 12

export default function HomePage() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()
  const { items, status, priceRange, error } = useSelector((state) => state.pieces)
  const collections = useSelector((state) => state.collections.items)

  const [minInput, setMinInput] = useState(priceRange.min)
  const [maxInput, setMaxInput] = useState(priceRange.max)
  const [activeType, setActiveType] = useState('all')
  const [collectionId, setCollectionId] = useState('all')
  const [search, setSearch] = useState('')
  const [uiPage, setUiPage] = useState(1)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    dispatch(loadPieces())
    dispatch(loadCollections())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadFavorites())
    }
  }, [dispatch, isAuthenticated])

  // Рахуємо, скільки виробів у кожному відсіку — для лічильників на вкладках
  const typeCounts = useMemo(() => {
    const counts = { all: items.length }
    for (const piece of items) {
      const type = inferPieceType(piece)
      counts[type] = (counts[type] || 0) + 1
    }
    return counts
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter((piece) => {
      if (activeType !== 'all' && inferPieceType(piece) !== activeType) return false
      if (collectionId !== 'all' && String(piece.manufactureId) !== String(collectionId)) {
        return false
      }
      if (
        debouncedSearch &&
        !`${piece.name || ''} ${piece.description || ''}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [items, activeType, collectionId, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const pageItems = filteredItems.slice((uiPage - 1) * PAGE_SIZE, uiPage * PAGE_SIZE)

  useEffect(() => {
    setUiPage(1)
  }, [activeType, collectionId, debouncedSearch])

  function handleFilterSubmit(event) {
    event.preventDefault()
    dispatch(setPriceRange({ min: minInput, max: maxInput }))
    if (minInput || maxInput) {
      dispatch(
        loadPiecesByPrice({ minValue: minInput || undefined, maxValue: maxInput || undefined })
      )
    } else {
      dispatch(loadPieces())
    }
  }

  function resetPriceFilter() {
    setMinInput('')
    setMaxInput('')
    dispatch(setPriceRange({ min: '', max: '' }))
    dispatch(loadPieces())
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Кожен виріб — своя історія у металі й камені</h1>
          <p>
            Каталог авторських прикрас майстерні «Оправа». Обирайте за типом, колекцією чи
            ціною та зберігайте улюблені вироби в обраному.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="section-tabs">
          <button
            type="button"
            className={activeType === 'all' ? 'active' : ''}
            onClick={() => setActiveType('all')}
          >
            Усі ({typeCounts.all || 0})
          </button>
          {PIECE_TYPES.map((type) => (
            <button
              key={type.key}
              type="button"
              className={activeType === type.key ? 'active' : ''}
              onClick={() => setActiveType(type.key)}
            >
              {type.label} ({typeCounts[type.key] || 0})
            </button>
          ))}
        </div>

        <form className="toolbar" onSubmit={handleFilterSubmit}>
          <div className="field">
            <label htmlFor="search">Пошук</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="назва або опис…"
            />
          </div>

          <div className="field">
            <label htmlFor="collection">Колекція</label>
            <select
              id="collection"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
            >
              <option value="all">Усі колекції</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="min-price">Ціна від</label>
            <input
              id="min-price"
              type="number"
              min="0"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="field">
            <label htmlFor="max-price">Ціна до</label>
            <input
              id="max-price"
              type="number"
              min="0"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              placeholder="50000"
            />
          </div>
          <button className="btn" type="submit">
            Застосувати
          </button>
          {(priceRange.min || priceRange.max) && (
            <button className="btn btn--ghost" type="button" onClick={resetPriceFilter}>
              Скинути ціну
            </button>
          )}
        </form>

        {status === 'loading' && <Loader label="Завантажуємо вироби…" />}
        {status === 'failed' && (
          <div className="state-block">Не вдалося завантажити каталог. {String(error)}</div>
        )}
        {status === 'succeeded' && filteredItems.length === 0 && (
          <div className="state-block">Нічого не знайдено за цим фільтром.</div>
        )}

        {status === 'succeeded' && pageItems.length > 0 && (
          <>
            <div className="piece-grid">
              {pageItems.map((piece) => (
                <PieceCard key={piece.id} piece={piece} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn--ghost"
                  disabled={uiPage <= 1}
                  onClick={() => setUiPage((p) => Math.max(1, p - 1))}
                >
                  Назад
                </button>
                <span>
                  Сторінка {uiPage} з {totalPages}
                </span>
                <button
                  className="btn btn--ghost"
                  disabled={uiPage >= totalPages}
                  onClick={() => setUiPage((p) => Math.min(totalPages, p + 1))}
                >
                  Далі
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
