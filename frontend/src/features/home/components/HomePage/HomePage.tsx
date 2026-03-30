import { Link } from '@tanstack/react-router'
import {
  Activity,
  BookMarked,
  CheckSquare,
  Droplets,
  FlaskConical,
  ListChecks,
  Package,
} from 'lucide-react'

import { ShelvingUnit } from '@/component/Header/NavItem/NavItem'
import { Hero } from '../Hero/Hero'
import './HomePage.css'

const navItems = [
  { to: '/collection', icon: <ShelvingUnit size={22} />, label: 'Collection' },
  { to: '/products', icon: <Package size={22} />, label: 'Produits' },
  { to: '/ingredients', icon: <FlaskConical size={22} />, label: 'Ingrédients' },
  { to: '/habits', icon: <ListChecks size={22} />, label: 'Habitudes' },
  { to: '/tasks', icon: <CheckSquare size={22} />, label: 'Tâches' },
]

const features = [
  // ... (rest of features remains same)
  {
    icon: <Droplets size={26} />,
    title: 'Collection skincare',
    desc: 'Votre inventaire de produits, consultable en quelques secondes. Vérifiez les ingrédients, explorez les actifs, ajoutez un produit à votre wishlist.',
    to: '/collection',
    featured: true,
  },
  {
    icon: <FlaskConical size={26} />,
    title: 'Base ingrédients',
    desc: 'Recherchez un actif, lisez son profil dermo, comparez les risques et bénéfices. INCI rendu lisible.',
    to: '/ingredients',
    featured: false,
  },
  {
    icon: <ListChecks size={26} />,
    title: 'Habitudes quotidiennes',
    desc: 'Routine matin/soir, eau, méditation, sommeil. Suivi souple, sans streaks, sans culpabilité.',
    to: '/habits',
    featured: false,
  },
  {
    icon: <BookMarked size={26} />,
    title: 'Wishlist',
    desc: "Sauvegardez les produits qui vous intéressent avant d'acheter. Vérifiez les ingrédients avant de vous décider.",
    to: '/collection',
    featured: true,
  },
  {
    icon: <Package size={26} />,
    title: 'Suivi du stock',
    desc: 'Voir ce qui est presque vide, éviter les ruptures.',
    to: '/collection',
    featured: false,
    status: 'en cours' as const,
  },
  {
    icon: <Activity size={26} />,
    title: 'Journal bien-être',
    desc: 'Énergie, sommeil, brouillard mental. Un journal léger pour suivre comment vous allez.',
    to: '/habits',
    featured: false,
    status: 'en cours' as const,
  },
]

const principles = [
  {
    label: 'Sans pression',
    desc: "Pas de streaks, pas de notifications agressives, pas de score de performance. L'outil s'adapte à vous.",
  },
  {
    label: 'Pour cerveau TDAH',
    desc: 'Interface simple, une chose à la fois, feedback positif. Conçu pour fonctionner avec le TDAH, pas contre.',
  },
  {
    label: 'Entièrement personnel',
    desc: 'Pas de publicités, pas de tracking, pas de gamification toxique. Juste votre outil, vos données.',
  },
]

export const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />

      {/* Glass nav moved below Hero */}
      <div className="home-nav-container">
        <nav className="home-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="home-nav__card">
              <div className="home-nav__icon">{item.icon}</div>
              <span className="home-nav__label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Features ────────────────────────────────────────────── */}
      <div className="home-content">
        <section className="home-section">
          <h2 className="home-section__title">Fonctionnalités</h2>
          <div className="home-features">
            {features.map((f, i) => (
              <Link
                key={f.title}
                to={f.to}
                className={`home-feature-card ${f.featured ? 'home-feature-card--featured' : ''} ${f.status ? 'home-feature-card--wip' : ''}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="home-feature-card__icon">{f.icon}</div>
                <div className="home-feature-card__body">
                  <div className="home-feature-card__header">
                    <h3 className="home-feature-card__title">{f.title}</h3>
                    {f.status && <span className="home-feature-card__status">{f.status}</span>}
                  </div>
                  <p className="home-feature-card__desc">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Philosophy ──────────────────────────────────────────── */}
        <section className="home-section" id="philosophy">
          <h2 className="home-section__title">Philosophie</h2>
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
      </div>
    </div>
  )
}
