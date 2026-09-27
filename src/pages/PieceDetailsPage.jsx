import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadPieceDetails, clearCurrentPiece } from '../features/pieces/piecesSlice'
import { toggleFavorite } from '../features/favorites/favoritesSlice'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'

export default function PieceDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { currentPiece, detailsStatus, error } = useSelector((state) => state.pieces)
  const favoriteIds = useSelector((state) => state.favorites.ids)

  useEffect(() => {
    dispatch(loadPieceDetails(id))
    return () => dispatch(clearCurrentPiece())
  }, [dispatch, id])

  function handleFavorite() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(toggleFavorite(Number(id)))
  }

  if (detailsStatus === 'loading') return <Loader label="Завантажуємо виріб…" />
  if (detailsStatus === 'failed') {
    return <div className="state-block">Не вдалося завантажити виріб. {String(error)}</div>
  }
  if (!currentPiece) return null

  const isFavorite = favoriteIds.includes(currentPiece.id)

  return (
    <div className="container piece-details">
      <div className="piece-details__image">
        {currentPiece.image ? (
          <img src={currentPiece.image} alt={currentPiece.name} />
        ) : (
          'Фото відсутнє'
        )}
      </div>
      <div>
        <h1>{currentPiece.name}</h1>
        <div className="piece-details__price">
          {currentPiece.price != null ? `${currentPiece.price} грн` : 'Ціна за запитом'}
        </div>
        <p>{currentPiece.description || 'Опис для цього виробу поки не додано.'}</p>

        <dl>
          {currentPiece.color && (
            <>
              <dt>Колір</dt>
              <dd>{currentPiece.color}</dd>
            </>
          )}
          {currentPiece.year != null && (
            <>
              <dt>Рік колекції</dt>
              <dd>{currentPiece.year}</dd>
            </>
          )}
          {currentPiece.volume != null && (
            <>
              <dt>Вага, г</dt>
              <dd>{currentPiece.volume}</dd>
            </>
          )}
        </dl>

        <button className="btn" onClick={handleFavorite} type="button">
          {isFavorite ? '♥ В обраному' : '♡ Додати в обране'}
        </button>
      </div>
    </div>
  )
}
