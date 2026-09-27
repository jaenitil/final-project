import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../features/favorites/favoritesSlice'
import { useAuth } from '../hooks/useAuth'
import { inferPieceType, pieceTypeLabel } from '../utils/pieceType'

export default function PieceCard({ piece }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const favoriteIds = useSelector((state) => state.favorites.ids)
  const isFavorite = favoriteIds.includes(piece.id)

  function handleToggleFavorite(event) {
    event.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(toggleFavorite(piece.id))
  }

  return (
    <Link to={`/pieces/${piece.id}`} className="piece-card">
      <button
        type="button"
        className="fav-toggle"
        data-active={isFavorite}
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
        title={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <div className="piece-card__image">
        {piece.image ? <img src={piece.image} alt={piece.name} /> : 'Фото відсутнє'}
      </div>
      <h3 className="piece-card__name">{piece.name || 'Без назви'}</h3>
      <div className="piece-card__meta">
        {pieceTypeLabel(inferPieceType(piece))}
        {piece.color ? ` · ${piece.color}` : ''}
        {piece.year ? ` · ${piece.year}` : ''}
      </div>
      <div className="piece-card__price">
        {piece.price != null ? `${piece.price} грн` : 'Ціна за запитом'}
      </div>
    </Link>
  )
}
