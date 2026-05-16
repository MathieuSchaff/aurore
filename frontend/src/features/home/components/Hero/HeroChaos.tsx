import { ArrowRight } from 'lucide-react'

import { ChaosTab, ProductCard } from '../primitives'
import { HeroShell } from './HeroShell'

export function HeroChaos() {
  return (
    <HeroShell
      badge="Bêta ouverte"
      title={
        <>
          <span className="aur-hero__title-line">Onze onglets,</span>
          <span className="aur-hero__title-line">trois comparaisons,</span>
          <span className="aur-hero__title-line">
            <em>une seule décision gardée.</em>
          </span>
        </>
      }
      subtitle="Vous comparez. Vous hésitez. Puis vous oubliez pourquoi vous aviez dit non. Aurore conserve le raisonnement produit, pour éviter de relancer la même boucle."
      primary={{ label: 'Créer mon compte', to: '/auth/signup' }}
      secondary={{ label: 'Comment ça marche', href: '#how-it-works' }}
      meta={['Product-first', 'Décisions mémorisées', 'Sans tracking']}
    >
      <div className="aur-hero-chaos">
        <div className="aur-hero-chaos__cols">
          <div className="aur-hero-chaos__col" style={{ transform: 'rotate(-1deg)' }}>
            <ChaosTab title="theordinary.com — Niacinamide" strike />
            <ChaosTab title="inci-decoder · pentylene…" strike />
            <ChaosTab title="reddit.com/r/SkincareAddiction" strike />
            <ChaosTab title="ChatGPT — analyse ma routine" strike />
            <ChaosTab title="Notes.app · sérum essayé en mars" note />
          </div>
          <div className="aur-hero-chaos__col">
            <ChaosTab title="paula's choice · BHA 2 %" strike />
            <ChaosTab title="beautypedia · review acide" strike />
            <ChaosTab title="Notes — formules à éviter" note />
            <ChaosTab title="amazon.fr · panier abandonné" strike />
            <ChaosTab title="capture-Decran-12.png" strike />
          </div>
        </div>

        <div className="aur-hero-chaos__divider">
          <span>après</span>
          <span className="aur-hero-chaos__arrow">
            <ArrowRight size={14} />
          </span>
          <span>Aurore</span>
        </div>

        <ProductCard
          brand="Paula's Choice"
          name="2 % BHA Liquid Exfoliant"
          type="Exfoliant chimique · 118 ml"
          status="rejected"
          statusLabel="Rejected"
          inci="Aqua, Methylpropanediol, Butylene Glycol, Salicylic Acid 2 %, Polysorbate 20, Camellia Oleifera, Sodium Hydroxide…"
          highlight={['Salicylic Acid', 'Polysorbate']}
          stats={[
            { label: 'Décidé le', value: '21 juin 2026' },
            { label: 'Raison clé', value: 'Trop irritant en usage fréquent' },
          ]}
        />
      </div>
    </HeroShell>
  )
}
