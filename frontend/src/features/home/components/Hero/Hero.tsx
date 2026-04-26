import { ArrowRight } from 'lucide-react'

import { Button } from '../../../../component/Button/Button'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero-container">
      <div className="hero-visuals" aria-hidden="true">
        <div className="hcard hcard--ingredient">
          <div className="hcard__header">
            <span className="hcard__dot" />
            <span className="hcard__name">Niacinamide</span>
            <span className="hcard__badge hcard__badge--safe">Sûr</span>
          </div>
          <div className="hcard__inci">Pyridine-3-carboxamide</div>
          <div className="hcard__tags">
            <span className="hcard__tag">Humectant</span>
            <span className="hcard__tag">Anti-acné</span>
            <span className="hcard__tag">Anti-âge</span>
          </div>
        </div>

        <div className="hcard hcard--product">
          <div className="hcard__header">
            <span className="hcard__dot hcard__dot--accent" />
            <span className="hcard__name">Hydra Boost Sérum</span>
          </div>
          <div className="hcard__score">
            <div className="hcard__score-bar">
              <div className="hcard__score-fill" />
            </div>
            <span className="hcard__score-label">8 / 10</span>
          </div>
          <div className="hcard__meta">
            18 ingrédients · <span className="hcard__warn">2 à surveiller</span>
          </div>
        </div>

        <div className="hcard hcard--profile">
          <div className="hcard__header">
            <span className="hcard__name">Mon profil peau</span>
          </div>
          <div className="hcard__tags">
            <span className="hcard__tag hcard__tag--active">Mixte</span>
            <span className="hcard__tag">Sensible</span>
            <span className="hcard__tag">Anti-âge</span>
          </div>
        </div>
      </div>

      <div className="hero-content">
        <header className="hero-header">
          <div className="hero-brand">
            <span className="hero-brand-name">Aurore</span>
            <span className="hero-badge">Bêta Ouverte</span>
          </div>
          <h1 className="hero-title">
            Votre skincare, <br />
            <span>sans mystère.</span>
          </h1>
          <p className="hero-subtitle">
            Gérez votre collection, décryptez les ingrédients, échangez avec la communauté. Sans
            pression, sans publicité, sans données vendues.
          </p>
        </header>

        <div className="hero-actions">
          <Button to="/auth/signup" size="lg" className="hero-btn">
            Créer un compte
            <ArrowRight size={16} />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="hero-btn"
            onClick={() =>
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Comment ça marche
          </Button>
        </div>
      </div>
    </section>
  )
}
