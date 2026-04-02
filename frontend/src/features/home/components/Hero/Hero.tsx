import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero-container">
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
            Arrêtez d'oublier <br />
            <span>ce que vous avez.</span>
          </h1>
          <p className="hero-subtitle">
            Notez vos produits, lisez ce qu'il y a dedans, suivez votre routine. Sans streaks, sans
            pression, sans notifications inutiles.
          </p>
        </header>

        <div className="hero-actions">
          <Link to="/signup" className="btn-primary">
            Créer un compte
            <ArrowRight size={18} />
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Comment ça marche
          </button>
        </div>
      </div>
    </section>
  )
}
