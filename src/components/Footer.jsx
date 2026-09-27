import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <nav className="footer-links">
          <Link to="/delivery">Доставка та замовлення</Link>
          <Link to="/terms">Умови користування</Link>
          <Link to="/contacts">Контакти</Link>
        </nav>
        
      </div>
    </footer>
  )
}
