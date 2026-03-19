import { Activity, BookMarked, CheckSquare, Droplets, FlaskConical, Package, Sparkles } from 'lucide-react'
import './HomePage.css'

type Feature = {
  icon: React.ReactNode
  title: string
  desc: string
  status?: 'en cours'
}

const features: Feature[] = [
  {
    icon: <Droplets size={22} />,
    title: 'Collection skincare',
    desc: "Ton inventaire de produits, consultable en quelques secondes. Vérifie les ingrédients, explore les actifs, ajoute un produit à ta wishlist.",
  },
  {
    icon: <FlaskConical size={22} />,
    title: 'Base ingrédients',
    desc: "Recherche un actif, lis son profil dermo, compare les risques et bénéfices. INCI rendu lisible.",
  },
  {
    icon: <CheckSquare size={22} />,
    title: 'Habitudes quotidiennes',
    desc: "Routine matin/soir, eau, méditation, sommeil... Suivi souple, sans streaks, sans culpabilité.",
  },
  {
    icon: <BookMarked size={22} />,
    title: 'Wishlist',
    desc: "Sauvegarde les produits qui t'intéressent avant d'acheter. Consulte leurs ingrédients avant de te décider.",
  },
  {
    icon: <Package size={22} />,
    title: 'Suivi du stock',
    desc: "Voir ce qui est presque vide, éviter les ruptures. Les alertes automatiques arrivent.",
    status: 'en cours',
  },
  {
    icon: <Activity size={22} />,
    title: 'Journal bien-être',
    desc: "Énergie, sommeil, brouillard mental. Un journal léger pour suivre comment tu vas au fil du temps.",
    status: 'en cours',
  },
]

const principles = [
  {
    label: 'Sans pression',
    desc: "Pas de streaks, pas de notifications agressives, pas de score de performance. L'outil s'adapte à toi.",
  },
  {
    label: 'Pour cerveau TDAH',
    desc: "Interface simple, une chose à la fois, feedback positif. Conçu pour fonctionner avec le TDAH, pas contre.",
  },
  {
    label: 'Entièrement personnel',
    desc: "Pas de publicités, pas de tracking, pas de gamification toxique. Juste ton outil, tes données.",
  },
]

export const HomePage = () => {
  return (
    <div className="home-page">
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero__eyebrow">
          <span className="home-hero__badge">
            <Sparkles size={11} aria-hidden="true" />
            En construction
          </span>
        </div>
        <h1 className="home-hero__title">Aurore</h1>
        <p className="home-hero__tagline">Compagnon bienveillant pour cerveau TDAH</p>
        <p className="home-hero__desc">
          Un outil personnel — pour voir ses produits skincare, vérifier les ingrédients, suivre ses
          habitudes. Pas de pubs, pas de gamification toxique. Conçu pour s'adapter à ton rythme.
        </p>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="home-section">
        <h2 className="home-section__title">Fonctionnalités</h2>
        <div className="home-features">
          {features.map((f) => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-card__header">
                <div className="home-feature-card__icon">{f.icon}</div>
                {f.status && (
                  <span className="home-feature-card__status">{f.status}</span>
                )}
              </div>
              <h3 className="home-feature-card__title">{f.title}</h3>
              <p className="home-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Philosophy ─────────────────────────────────── */}
      <section className="home-section">
        <h2 className="home-section__title">Philosophie</h2>
        <div className="home-principles">
          {principles.map((p) => (
            <div key={p.label} className="home-principle">
              <h3 className="home-principle__label">{p.label}</h3>
              <p className="home-principle__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack ──────────────────────────────────────── */}
      <section className="home-section home-stack">
        <h2 className="home-section__title">Stack technique</h2>
        <p className="home-stack__desc">
          Monorepo Bun · Hono API · PostgreSQL 16 + Drizzle ORM · React 19 + TanStack Router ·
          Auth JWT cookies HttpOnly
        </p>
        <div className="home-stack__tags">
          {['Bun', 'Hono', 'PostgreSQL', 'Drizzle', 'React 19', 'TanStack Router', 'Zod'].map(
            (t) => (
              <span key={t} className="home-stack__tag">
                {t}
              </span>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
