import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero-container">
      {/* Abstract 3D Shapes Background */}
      <div className="hero-visuals" aria-hidden="true">
        <div className="shape sphere frosted" />
        <div className="shape cube quartz" />
        <div className="shape ring ceramic" />
      </div>

      <div className="hero-content">
        <header className="hero-header">
          <div className="hero-brand">
            <span className="hero-brand-name">Aurore</span>
            <span className="hero-badge">Bêta Ouverte</span>
          </div>
          <h1 className="hero-title">
            Votre collection skincare, <br />
            <span>enfin sous contrôle.</span>
          </h1>
          <p className="hero-subtitle">
            Gérez votre inventaire, décryptez les ingrédients et optimisez votre routine. Un outil
            multifonction, conçu pour la clarté et sans distraction.
          </p>
        </header>

        <div className="hero-actions">
          <Link to="/signup" className="btn-primary">
            Commencer mon voyage
            <ArrowRight size={18} />
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Découvrir la philosophie
          </button>
        </div>
      </div>
    </section>
  )
}
