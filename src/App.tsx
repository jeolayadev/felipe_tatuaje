import { useState } from 'react'
import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { Portafolio } from './components/Portafolio/Portafolio'
import { Agenda, type ViewMode } from './components/Agenda/Agenda'
import { Cuidados } from './components/Cuidados/Cuidados'
import { Contacto } from './components/Contacto/Contacto'
import { Footer } from './components/Footer/Footer'
import { FloatingContact } from './components/ui/FloatingContact'
import { ArtistLogin } from './components/Auth/ArtistLogin'
import { useArtistAuth } from './hooks/useArtistAuth'
import './App.css'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('cliente')
  const { authed, isAdmin, email, ready, login, register, logout } = useArtistAuth()

  const toggleViewMode = () => {
    setViewMode((current) => (current === 'cliente' ? 'tatuador' : 'cliente'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToClient = () => {
    setViewMode('cliente')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    logout()
    goToClient()
  }

  // El wallpaper vive en public/. Lo referenciamos con BASE_URL para que
  // resuelva bien en el deploy (GitHub Pages bajo /felipe_tatuaje/), en vez
  // de la ruta relativa del CSS que apuntaba a /assets/ y daba 404.
  const wallpaper = `${import.meta.env.BASE_URL}bg-wallpaper.jpg`

  return (
    <>
    <div className="app">
      <div
        className="site-bg"
        aria-hidden
        style={{ backgroundImage: `url('${wallpaper}')` }}
      />
      <Navbar viewMode={viewMode} onToggleView={toggleViewMode} />
      {viewMode === 'cliente' ? (
        <>
          <Hero />
          <Portafolio />
          <Agenda viewMode={viewMode} />
          <Cuidados />
          <Contacto />
        </>
      ) : !ready ? (
        <div className="auth-loading" aria-live="polite">Cargando…</div>
      ) : authed && isAdmin ? (
        <Agenda viewMode={viewMode} onLogout={handleLogout} />
      ) : authed ? (
        <div className="auth-loading auth-noaccess" aria-live="polite">
          <p>
            Sesión iniciada como <strong>{email}</strong>.
            <br />
            Esta cuenta no tiene acceso al panel del tatuador.
          </p>
          <div>
            <button type="button" onClick={goToClient}>Volver al sitio</button>
            <button type="button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      ) : (
        <ArtistLogin onSubmit={login} onRegister={register} onBack={goToClient} />
      )}
      <Footer />
    </div>
    {viewMode === 'cliente' && <FloatingContact />}
    </>
  )
}

export default App
