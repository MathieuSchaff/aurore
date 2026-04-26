import { Link } from '@tanstack/react-router'

import { Hero } from '../Hero/Hero'
import {
  ObjCompare,
  ObjDiscussion,
  ObjDropper,
  ObjJar,
  ObjSpray,
  ObjTarget,
} from './FeatureObjects'
import './HomePage.css'

const features = [
  {
    id: 'collection',
    to: '/collection' as const,
    frontLabel: 'Collection',
    object: <ObjJar />,
    backTitle: 'Ma collection',
    backDesc:
      'Tous vos produits en un seul endroit. Ajoutez, retrouvez, organisez en deux secondes.',
    backCta: 'Voir ma collection',
  },
  {
    id: 'ingredients',
    to: '/ingredients' as const,
    frontLabel: 'Ingrédients',
    object: <ObjDropper />,
    backTitle: 'Ingrédients',
    backDesc:
      "Explorez les formulations en clair. Filtrez par fonction, actif, profil de peau. Plus besoin de décoder l'INCI seul.",
    backCta: 'Explorer',
  },
  {
    id: 'products',
    to: '/products' as const,
    frontLabel: 'Produits',
    object: <ObjSpray />,
    backTitle: 'Catalogue produits',
    backDesc:
      'Parcourez des milliers de produits, consultez leurs compositions, ajoutez-les à votre wishlist.',
    backCta: 'Parcourir',
  },
  {
    id: 'discussions',
    to: '/products' as const,
    frontLabel: 'Discussions',
    object: <ObjDiscussion />,
    backTitle: 'Discussions & avis',
    backDesc:
      'Échangez sur les produits et ingrédients. Partagez vos avis, posez vos questions à la communauté.',
    backCta: 'Voir les discussions',
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
    id: 'compare',
    to: '/collection' as const,
    frontLabel: 'Comparatif',
    object: <ObjCompare />,
    backTitle: 'Comparer des produits',
    backDesc: 'Sélectionnez plusieurs produits et comparez leurs compositions côte à côte.',
    backCta: 'Bientôt',
    wip: true,
  },
]

const howItWorks = [
  {
    num: '01',
    title: 'Construisez votre collection',
    desc: 'Ajoutez les produits que vous possédez, votre wishlist et ceux à tester. Retrouvez-les en deux secondes.',
  },
  {
    num: '02',
    title: 'Comprenez les ingrédients',
    desc: "Lisez les formulations en clair, filtrez par fonction ou actif. Plus besoin de décoder l'INCI seul.",
  },
  {
    num: '03',
    title: 'Échangez avec la communauté',
    desc: 'Lisez les avis, partagez les vôtres, posez vos questions sur les produits et ingrédients.',
  },
]

const principles = [
  {
    label: "L'info, pas le marketing",
    desc: "Les ingrédients en clair, sans jargon de marque. Vous voyez ce qui est dans le flacon — pas ce qu'on veut vous faire croire.",
  },
  {
    label: 'Conçu pour les cerveaux TDAH',
    desc: 'Interface épurée, une chose à la fois. Retrouvez un produit, lisez une fiche, comprenez une formule — sans vous perdre en route.',
  },
  {
    label: "Vos données, c'est tout",
    desc: 'Pas de pub, pas de revente, pas de recommandations sponsorisées. Un outil qui sert vos intérêts, pas ceux des marques.',
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

        <section className="home-section" id="how-it-works">
          <h2 className="home-section__title">Comment ça marche</h2>
          <div className="home-how__steps">
            {howItWorks.map((step, i) => (
              <div
                key={step.num}
                className="home-how__step"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="home-how__num">{step.num}</span>
                <h3 className="home-how__title">{step.title}</h3>
                <p className="home-how__desc">{step.desc}</p>
              </div>
            ))}
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
