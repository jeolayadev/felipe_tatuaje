import { useState } from 'react'
import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { Portafolio } from './components/Portafolio/Portafolio'
import { Agenda, type ViewMode } from './components/Agenda/Agenda'
import { Contacto } from './components/Contacto/Contacto'
import { Footer } from './components/Footer/Footer'
import './App.css'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('cliente')

  const toggleViewMode = () => {
    setViewMode((current) => (current === 'cliente' ? 'tatuador' : 'cliente'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // El wallpaper vive en public/. Lo referenciamos con BASE_URL para que
  // resuelva bien en el deploy (GitHub Pages bajo /felipe_tatuaje/), en vez
  // de la ruta relativa del CSS que apuntaba a /assets/ y daba 404.
  const wallpaper = `${import.meta.env.BASE_URL}bg-wallpaper.jpg`

  return (
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
          <Contacto />
        </>
      ) : (
        <Agenda viewMode={viewMode} />
      )}
      <Footer />
    </div>
  )
}

export default App
