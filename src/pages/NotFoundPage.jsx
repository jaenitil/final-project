import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="state-block">
      <h1 style={{ fontFamily: 'var(--font-display)' }}>404</h1>
      <p>Такої сторінки не існує.</p>
      <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: 16 }}>
        На головну
      </Link>
    </div>
  )
}
