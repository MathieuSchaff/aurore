import { ComparisonStrip, IngredientCard } from '../primitives'
import { HeroShell } from './HeroShell'

export function HeroWiki() {
  return (
    <HeroShell
      badge="Mémoire de décision"
      title={
        <>
          <span className="aur-hero__title-line">Comprendre la formule,</span>
          <span className="aur-hero__title-line">
            <em>décider le produit.</em>
          </span>
        </>
      }
      subtitle="Les fiches ingrédients servent à expliquer vos candidats produit. Vous comparez, vous tranchez, puis vous gardez la raison de votre choix."
      primary={{ label: 'Voir les produits', to: '/products' }}
      secondary={{ label: 'Ouvrir une fiche ingrédient', to: '/ingredients' }}
      meta={[
        'Considering · Wishlist · Owned · Rejected',
        '2 800 produits référencés',
        'Sources citées',
      ]}
    >
      <div className="aur-hero-wiki">
        <IngredientCard
          name="Acide salicylique"
          inci="Salicylic Acid (2-Hydroxybenzoic Acid)"
          rating="Repère"
          ratingLabel="lecture"
          roles={[
            { label: 'Exfoliant', variant: 'active' },
            { label: 'À contextualiser', variant: 'warn' },
            { label: 'BHA' },
            { label: '< 2 % en cosmétique', variant: 'warn' },
          ]}
          description="Souvent utilisé dans des formules anti-imperfections. À contextualiser selon fréquence d'usage, sensibilité personnelle et reste de la formule."
          rows={[
            { key: 'Origine', value: 'Saule blanc · synthétique' },
            { key: 'Concentration observée', value: '0,5 à 2 %' },
            { key: 'Trouvé dans', value: '23 produits Aurore' },
          ]}
        />

        <ComparisonStrip
          left={{ label: 'Produit A', name: 'BHA 2 % Liquid' }}
          right={{ label: 'Produit B', name: 'Effaclar Duo+' }}
          rows={[
            { key: 'Acide salicylique', a: '2 %', b: '0,4 %', aHint: 'ok', bHint: 'warn' },
            { key: 'Parfum', a: 'Non', b: 'Oui', aHint: 'ok', bHint: 'warn' },
            { key: 'pH estimé', a: '3,2', b: '5,5' },
            { key: 'Alcool dénaturé', a: 'Non', b: 'Non', aHint: 'ok', bHint: 'ok' },
          ]}
        />
      </div>
    </HeroShell>
  )
}
