import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <NavLink to="/" className="site-header__logo">
          ОПРАВА
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end>
            Каталог
          </NavLink>
          <NavLink to="/collections">Колекції</NavLink>
          <NavLink to="/about">Про нас</NavLink>
          <NavLink to="/contacts">Контакти</NavLink>
          {isAuthenticated && <NavLink to="/favorites">Обране</NavLink>}
          {isAuthenticated && <NavLink to="/add-piece">Додати виріб</NavLink>}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile">Кабінет</NavLink>
              <button className="site-nav__cta" onClick={logout} type="button">
                Вийти
              </button>
            </>
          ) : (
            <NavLink to="/login" className="site-nav__cta">
              Увійти
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
