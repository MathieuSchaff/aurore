import { Link } from '@tanstack/react-router'

import { Hero } from '../Hero/Hero'
import { ObjDropper, ObjJar, ObjPerfume, ObjSpray, ObjTarget, ObjVial } from './FeatureObjects'
import './HomePage.css'

const features = [
  {
    id: 'collection',
    to: '/collection' as const,
    frontLabel: 'Collection',
    object: <ObjJar />,
    backTitle: 'Ma collection',
    backDesc: 'Tous vos produits au même endroit. Retrouvez-les en deux secondes.',
    backCta: 'Voir ma collection',
  },
  {
    id: 'ingredients',
    to: '/ingredients' as const,
    frontLabel: 'Ingrédients',
    object: <ObjDropper />,
    backTitle: 'Ingrédients',
    backDesc: "Lisez ce qu'il y a dans vos produits, en clair. Plus besoin de décoder l'INCI seul.",
    backCta: 'Explorer',
  },
  {
    id: 'habits',
    to: '/habits' as const,
    frontLabel: 'Routine',
    object: <ObjSpray />,
    backTitle: 'Habitudes',
    backDesc: 'Votre routine matin et soir. Cochez ce que vous avez fait, rien de plus.',
    backCta: 'Mes habitudes',
  },
  {
    id: 'wishlist',
    to: '/collection' as const,
    frontLabel: 'Wishlist',
    object: <ObjPerfume />,
    backTitle: 'Wishlist',
    backDesc:
      "Un produit vous intéresse ? Sauvegardez-le, vérifiez les ingrédients avant d'acheter.",
    backCta: 'Ma wishlist',
  },
  {
    id: 'tasks',
    to: '/tasks' as const,
    frontLabel: 'Tâches',
    object: <ObjTarget />,
    backTitle: 'Tâches',
    backDesc: "Ce que vous voulez faire aujourd'hui. Simple, sans score, sans pression.",
    backCta: 'Mes tâches',
  },
  {
    id: 'stock',
    to: '/collection' as const,
    frontLabel: 'Stock',
    object: <ObjVial />,
    backTitle: 'Suivi du stock',
    backDesc: 'Savoir ce qui est presque vide avant de se retrouver à court.',
    backCta: 'Bientôt',
    wip: true,
  },
]

const principles = [
  {
    label: 'Sans pression',
    desc: "Pas de streaks. Pas de score. Si vous ratez un jour, l'app s'en fiche — et vous devriez aussi.",
  },
  {
    label: 'Pensé pour le TDAH',
    desc: 'Une chose à la fois, interface sans bruit. Conçu pour un cerveau qui oublie facilement, pas pour le punir.',
  },
  {
    label: "Vos données, c'est tout",
    desc: 'Pas de pub, pas de revente, pas de gamification qui crée de la dépendance. Un outil, pas un produit.',
  },
]

export const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />

      <div className="home-content">
        <section className="home-section">
          <h2 className="home-section__title">Fonctionnalités</h2>
          <div className="home-features">
            {features.map((f) => {
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: touch-only flip, keyboard users navigate via the inner Link
                // biome-ignore lint/a11y/useKeyWithClickEvents: touch-only flip, keyboard users navigate via the inner Link
                <div
                  key={f.id}
                  className={`home-flip-card${f.wip ? ' home-flip-card--wip' : ''}`}
                  onClick={(e) => {
                    // on touch devices, tap flips the card instead of navigating
                    if (window.matchMedia('(hover: none)').matches) {
                      e.currentTarget.classList.toggle('flipped')
                    }
                  }}
                >
                  <div className="home-flip-inner">
                    <div className="home-flip-front">
                      {f.wip && <span className="home-flip-badge">bientôt</span>}
                      <div aria-hidden="true">{f.object}</div>
                      <span className="home-flip-card__name">{f.frontLabel}</span>
                    </div>
                    <div className="home-flip-back">
                      <div className="home-flip-back__title">{f.backTitle}</div>
                      <div className="home-flip-back__desc">{f.backDesc}</div>
                      {f.wip ? (
                        <span className="home-flip-back__cta">{f.backCta}</span>
                      ) : (
                        <Link
                          to={f.to}
                          className="home-flip-back__cta"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {f.backCta}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="home-section" id="philosophy">
          <h2 className="home-section__title">Pourquoi cet outil</h2>
          <div className="home-principles">
            {principles.map((p, i) => (
              <div
                key={p.label}
                className="home-principle"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="home-principle__label">{p.label}</h3>
                <p className="home-principle__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="home-privacy-link">
          <Link to="/privacy" className="home-privacy-link__text">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  )
}
