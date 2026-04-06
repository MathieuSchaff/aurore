import { ArrowRight } from 'lucide-react'

import { Button } from '../../../../component/Button/Button'
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
          <Button to="/auth/signup" size="lg" className="hero-btn">
            Créer un compte
            <ArrowRight size={18} />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="hero-btn"
            onClick={() =>
              document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Comment ça marche
          </Button>
        </div>
      </div>
    </section>
  )
}
