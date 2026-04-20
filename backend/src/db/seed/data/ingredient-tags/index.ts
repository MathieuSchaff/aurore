// ─── Règles strictes pour tagger un ingrédient ──────────────────────
//
// Depuis le refactor de la taxonomie (avril 2026), chaque slug porte un
// `scope` dans TAG_TAXONOMY (`ingredient` | `product` | `both`). Le test
// `shared-schemas-vs-tags` vérifie automatiquement que tout slug utilisé
// ici a un scope compatible avec une molécule — plus besoin de tenir une
// liste noire à la main, TAG_TAXONOMY est la source de vérité.
//
// Catégories interdites sur un ingrédient (scope = 'product') :
//   ❌ product_type   (ex: serum, creme-hydratante)
//   ❌ routine_step   (ex: matin, hydratation, emollience)
//   ❌ skin_zone      (ex: zone-visage, zone-yeux)
//   ❌ la plupart des product_label (sans-parfum, vegan, hypoallergenique…)
//   ❌ skin_effect "produit fini" (texture-riche, texture-legere)
//
// Scope = 'both' : autorisés ici parce qu'ils décrivent AUSSI une
// propriété intrinsèque de molécule :
//   ✅ ingredient_attribute  (actif, humectant, filtre-uv, tensioactif…)
//   ✅ skin_effect (OCCLUSIF, REPULPANT, MATIFIANT, PROTECTION_CUTANEE)
//   ✅ product_label (FILTRES_CHIMIQUES, FILTRES_MINERAUX)
//   ✅ shared_label  (COMEDOGENE, NON_COMEDOGENE)
//   ✅ concern, skin_type
//
// Règle `avoid` (voir idee/tags/tags-associations.md) :
//   ✅ uniquement skin_type ou concern.
//   ❌ jamais d'attribut, de label, de product_type ni de routine_step.
//   ⚠️  exception conventionnelle : `grossesse-compatible` (scope=product)
//       est toléré dans `avoid` pour signifier "contre-indiqué pendant
//       la grossesse" — le test le sait.
//
// Convention comédogénicité :
//   - `comedogene` / `non-comedogene` sont des FAITS moléculaires →
//     ils vont en `secondary`, jamais en `avoid`.
//   - La contre-indication clinique correspondante se traduit par
//     `avoid: [peau-grasse, anti-acne]` sur l'ingrédient concerné.
//
// Documentation complète : idee/tags/tags.md (section 3) et
// idee/tags/tags-associations.md.

import {
  INGREDIENT_SLUGS,
  SUPPLEMENTS_ACIDES_AMINES,
  SUPPLEMENTS_ACIDES_GRAS,
  SUPPLEMENTS_ANTIOXYDANTS,
  SUPPLEMENTS_CAROTENOIDES,
  SUPPLEMENTS_DIVERS,
  SUPPLEMENTS_MINERAUX,
  SUPPLEMENTS_NEUROACTIFS,
  SUPPLEMENTS_PLANTES,
  SUPPLEMENTS_VITAMINES,
} from '../ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../tags'
import { skincareTagMap } from '../ingredients/skincare/ingredient-tags'

export interface IngredientAssociation {
  /** Tags principaux : bénéfices majeurs prouvés de l'actif */
  primary: string[]
  /** Tags secondaires : bénéfices d'accompagnement ou cibles spécifiques */
  secondary: string[]
  /** Tags d'exclusion : types de peau ou conditions où l'actif est déconseillé */
  avoid: string[]
}

export type IngredientTagMap = Record<string, IngredientAssociation>

export const ingredientTagMap: IngredientTagMap = {

  // ─── SUPPLEMENTS (voie orale) ────────────────────────────────────
  // Use SUPPLEMENTS_* directly: three keys (ASTAXANTHINE, ERGOTHIONEINE,
  // GLYCINE) collide with skincare molecule slugs, and INGREDIENT_SLUGS
  // resolves the collision to the skincare side.
  [SUPPLEMENTS_CAROTENOIDES.ASTAXANTHINE_SUPPLEMENT]: {
    primary: [TAG_SLUGS.ANTIOXYDANT, TAG_SLUGS.LONGEVITE, TAG_SLUGS.VISION],
    secondary: [TAG_SLUGS.AVEC_REPAS, TAG_SLUGS.PEAU_ORALE],
    avoid: [],
  },
  [SUPPLEMENTS_PLANTES.BERBERINE]: {
    primary: [TAG_SLUGS.DIGESTION, TAG_SLUGS.CARDIOVASCULAIRE],
    secondary: [TAG_SLUGS.AVEC_REPAS],
    avoid: [TAG_SLUGS.GROSSESSE_INCOMPATIBLE, TAG_SLUGS.ALLAITEMENT_INCOMPATIBLE],
  },
  [SUPPLEMENTS_CAROTENOIDES.BETA_CAROTENE]: {
    primary: [TAG_SLUGS.ANTIOXYDANT, TAG_SLUGS.VISION],
    secondary: [TAG_SLUGS.AVEC_REPAS, TAG_SLUGS.PEAU_ORALE],
    avoid: [],
  },
  [SUPPLEMENTS_NEUROACTIFS.CDP_CHOLINE]: {
    primary: [TAG_SLUGS.COGNITION, TAG_SLUGS.MEMOIRE, TAG_SLUGS.FOCUS],
    secondary: [TAG_SLUGS.NOOTROPE, TAG_SLUGS.PRECURSEUR_NEUROTRANSMETTEUR, TAG_SLUGS.MATIN],
    avoid: [],
  },
  [SUPPLEMENTS_NEUROACTIFS.CHOLINE]: {
    primary: [TAG_SLUGS.COGNITION, TAG_SLUGS.MEMOIRE],
    secondary: [TAG_SLUGS.PRECURSEUR_NEUROTRANSMETTEUR, TAG_SLUGS.DONNEUR_METHYLE, TAG_SLUGS.AVEC_REPAS],
    avoid: [],
  },
  [SUPPLEMENTS_ACIDES_AMINES.CREATINE]: {
    primary: [TAG_SLUGS.SPORT_PERFORMANCE, TAG_SLUGS.SPORT_RECUPERATION, TAG_SLUGS.ENERGIE],
    secondary: [TAG_SLUGS.COGNITION, TAG_SLUGS.PRE_ENTRAINEMENT, TAG_SLUGS.POST_ENTRAINEMENT],
    avoid: [TAG_SLUGS.INSUFFISANCE_RENALE],
  },
  [SUPPLEMENTS_ANTIOXYDANTS.ERGOTHIONEINE_SUPPLEMENT]: {
    primary: [TAG_SLUGS.ANTIOXYDANT, TAG_SLUGS.LONGEVITE],
    secondary: [TAG_SLUGS.ANTI_INFLAMMATOIRE],
    avoid: [],
  },
  [SUPPLEMENTS_ACIDES_AMINES.GAA]: {
    primary: [TAG_SLUGS.SPORT_PERFORMANCE, TAG_SLUGS.ENERGIE],
    secondary: [TAG_SLUGS.PRECURSEUR_NEUROTRANSMETTEUR],
    avoid: [],
  },
  [SUPPLEMENTS_ACIDES_AMINES.GLUCOSAMINE]: {
    primary: [TAG_SLUGS.ARTICULATIONS],
    secondary: [TAG_SLUGS.AVEC_REPAS],
    avoid: [],
  },
  [SUPPLEMENTS_ACIDES_AMINES.GLYCINE_SUPPLEMENT]: {
    primary: [TAG_SLUGS.SOMMEIL, TAG_SLUGS.CALMANT, TAG_SLUGS.STRESS],
    secondary: [TAG_SLUGS.PRECURSEUR_NEUROTRANSMETTEUR, TAG_SLUGS.SOIR],
    avoid: [],
  },
  [SUPPLEMENTS_CAROTENOIDES.LUTEINE]: {
    primary: [TAG_SLUGS.VISION, TAG_SLUGS.ANTIOXYDANT],
    secondary: [TAG_SLUGS.AVEC_REPAS],
    avoid: [],
  },
  [SUPPLEMENTS_MINERAUX.MAGNESIUM]: {
    primary: [
      TAG_SLUGS.SOMMEIL,
      TAG_SLUGS.STRESS,
      TAG_SLUGS.SPORT_RECUPERATION,
      TAG_SLUGS.CARDIOVASCULAIRE,
    ],
    secondary: [TAG_SLUGS.CALMANT, TAG_SLUGS.SOIR],
    avoid: [TAG_SLUGS.INSUFFISANCE_RENALE],
  },
  [SUPPLEMENTS_DIVERS.NAC]: {
    primary: [TAG_SLUGS.ANTIOXYDANT, TAG_SLUGS.DETOX, TAG_SLUGS.LONGEVITE],
    secondary: [TAG_SLUGS.IMMUNITE],
    avoid: [],
  },
  [SUPPLEMENTS_ACIDES_GRAS.OMEGA_3]: {
    primary: [TAG_SLUGS.CARDIOVASCULAIRE, TAG_SLUGS.COGNITION, TAG_SLUGS.ANTI_INFLAMMATOIRE],
    secondary: [TAG_SLUGS.AVEC_REPAS],
    avoid: [TAG_SLUGS.INTERACTION_ANTICOAGULANTS],
  },
  [SUPPLEMENTS_DIVERS.PHOSPHATIDYLETHANOLAMINE]: {
    primary: [TAG_SLUGS.COGNITION, TAG_SLUGS.PRECURSEUR_NEUROTRANSMETTEUR],
    secondary: [TAG_SLUGS.LONGEVITE],
    avoid: [],
  },
  [SUPPLEMENTS_DIVERS.PHOSPHATIDYLINOSITOL]: {
    primary: [TAG_SLUGS.STRESS, TAG_SLUGS.ANXIETE, TAG_SLUGS.HORMONAL],
    secondary: [TAG_SLUGS.COGNITION],
    avoid: [],
  },
  [SUPPLEMENTS_DIVERS.PHOSPHATIDYLSERINE]: {
    primary: [TAG_SLUGS.COGNITION, TAG_SLUGS.MEMOIRE, TAG_SLUGS.STRESS],
    secondary: [TAG_SLUGS.NOOTROPE, TAG_SLUGS.SOIR],
    avoid: [],
  },
  [SUPPLEMENTS_DIVERS.PSYLLIUM]: {
    primary: [TAG_SLUGS.DIGESTION],
    secondary: [TAG_SLUGS.AVEC_REPAS],
    avoid: [],
  },
  [SUPPLEMENTS_DIVERS.SPIRULINE]: {
    primary: [TAG_SLUGS.ENERGIE, TAG_SLUGS.IMMUNITE],
    secondary: [TAG_SLUGS.ANTIOXYDANT, TAG_SLUGS.IMMUNO_MODULATEUR, TAG_SLUGS.MATIN],
    avoid: [],
  },
  [SUPPLEMENTS_DIVERS.TAURINE]: {
    primary: [TAG_SLUGS.SPORT_RECUPERATION, TAG_SLUGS.CARDIOVASCULAIRE, TAG_SLUGS.SOMMEIL],
    secondary: [TAG_SLUGS.CALMANT],
    avoid: [],
  },
  [SUPPLEMENTS_DIVERS.TMG]: {
    primary: [TAG_SLUGS.CARDIOVASCULAIRE, TAG_SLUGS.DONNEUR_METHYLE],
    secondary: [TAG_SLUGS.ENERGIE],
    avoid: [],
  },
  [SUPPLEMENTS_VITAMINES.VITAMINE_B12]: {
    primary: [TAG_SLUGS.ENERGIE, TAG_SLUGS.COGNITION],
    secondary: [TAG_SLUGS.COFACTEUR_ENZYMATIQUE, TAG_SLUGS.DONNEUR_METHYLE, TAG_SLUGS.MATIN],
    avoid: [],
  },
  [SUPPLEMENTS_VITAMINES.VITAMINE_C]: {
    primary: [TAG_SLUGS.IMMUNITE, TAG_SLUGS.PEAU_ORALE, TAG_SLUGS.ANTIOXYDANT],
    secondary: [TAG_SLUGS.COFACTEUR_ENZYMATIQUE, TAG_SLUGS.MATIN],
    avoid: [],
  },
  [SUPPLEMENTS_VITAMINES.VITAMINE_D3]: {
    primary: [TAG_SLUGS.IMMUNITE, TAG_SLUGS.OS, TAG_SLUGS.HORMONAL],
    secondary: [TAG_SLUGS.AVEC_REPAS, TAG_SLUGS.MATIN],
    avoid: [],
  },
  [SUPPLEMENTS_VITAMINES.VITAMINE_K2]: {
    primary: [TAG_SLUGS.OS, TAG_SLUGS.CARDIOVASCULAIRE],
    secondary: [TAG_SLUGS.COFACTEUR_ENZYMATIQUE, TAG_SLUGS.AVEC_REPAS],
    avoid: [TAG_SLUGS.INTERACTION_ANTICOAGULANTS],
  },
  [SUPPLEMENTS_CAROTENOIDES.ZEAXANTHINE]: {
    primary: [TAG_SLUGS.VISION, TAG_SLUGS.ANTIOXYDANT],
    secondary: [TAG_SLUGS.AVEC_REPAS],
    avoid: [],
  },
  ...skincareTagMap,
}
