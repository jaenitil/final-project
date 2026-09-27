import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './routes/ProtectedRoute'

import HomePage from './pages/HomePage'
import PieceDetailsPage from './pages/PieceDetailsPage'
import CollectionsPage from './pages/CollectionsPage'
import AboutPage from './pages/AboutPage'
import ContactsPage from './pages/ContactsPage'
import DeliveryPage from './pages/DeliveryPage'
import TermsPage from './pages/TermsPage'
import FavoritesPage from './pages/FavoritesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import AddPiecePage from './pages/AddPiecePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pieces/:id" element={<PieceDetailsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-piece"
            element={
              <ProtectedRoute>
                <AddPiecePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
