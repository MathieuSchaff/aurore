// ─── Tag Taxonomy (Source de vérité pour catégorie + scope) ─────────
//
// Chaque slug de tag appartient à :
//   - une `category` sémantique (concern, skin_type, product_type, …)
//   - un `scope` qui dit quelle entité peut porter ce tag
//     * 'ingredient'  → uniquement sur un ingrédient
//     * 'product'     → uniquement sur un produit
//     * 'both'        → sur les deux
//
// Les deux axes sont orthogonaux. Toute la validation (runtime + types)
// se dérive de cette table. Voir idee/tags/tags.md pour les règles.

import { TAG_SLUGS, type TagSlug } from './tag-slugs'

export const TAG_CATEGORIES = [
  'concern',
  'skin_type',
  'skin_zone',
  'product_type',
  'routine_step',
  'ingredient_attribute',
  'skin_effect',
  'product_label',
  'shared_label',
] as const
export type TagCategory = (typeof TAG_CATEGORIES)[number]

export type TagScope = 'ingredient' | 'product' | 'both'

export interface TagMeta {
  category: TagCategory
  scope: TagScope
}

// ─── Groupes par (category, scope) ─────────────────────────────────
// On liste d'abord par groupe, puis on dérive la map ci-dessous.

const CONCERN: TagSlug[] = [
  TAG_SLUGS.ANTI_ROUGEURS,
  TAG_SLUGS.ROSACEE,
  TAG_SLUGS.COUPEROSE,
  TAG_SLUGS.FLUSHS,
  TAG_SLUGS.BARRIERE_CUTANEE,
  TAG_SLUGS.ANTI_TACHES,
  TAG_SLUGS.ANTI_ACNE,
  TAG_SLUGS.ANTI_AGE,
  TAG_SLUGS.HYPERPIGMENTATION,
  TAG_SLUGS.DESHYDRATATION,
  TAG_SLUGS.PORES_DILATES,
  TAG_SLUGS.CERNES_POCHES,
  TAG_SLUGS.BRILLANCE,
  TAG_SLUGS.ECLAT,
  TAG_SLUGS.POST_ACNE,
  TAG_SLUGS.CICATRISATION,
  TAG_SLUGS.MICROBIOME,
  TAG_SLUGS.PHOTO_VIEILLISSEMENT,
  TAG_SLUGS.TEINT_TERNE,
  TAG_SLUGS.LUMIERE_BLEUE,
  TAG_SLUGS.POLLUTION,
  TAG_SLUGS.ECZEMA,
  TAG_SLUGS.GRAIN_PEAU,
  TAG_SLUGS.KERATOSE_PILAIRE,
  TAG_SLUGS.PHOTO_PROTECTION,
  TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
]

const SKIN_TYPE: TagSlug[] = [
  TAG_SLUGS.PEAU_SECHE,
  TAG_SLUGS.PEAU_MIXTE,
  TAG_SLUGS.PEAU_GRASSE,
  TAG_SLUGS.PEAU_REACTIVE,
  TAG_SLUGS.PEAU_SENSIBLE,
  TAG_SLUGS.PEAU_NORMALE,
  TAG_SLUGS.PEAU_ATOPIQUE,
  TAG_SLUGS.PEAU_RUGUEUSE,
  TAG_SLUGS.PEAU_TOUS_TYPES,
]

const SKIN_ZONE: TagSlug[] = [
  TAG_SLUGS.ZONE_VISAGE,
  TAG_SLUGS.ZONE_CORPS,
  TAG_SLUGS.ZONE_YEUX,
  TAG_SLUGS.ZONE_LEVRES,
  TAG_SLUGS.ZONE_MAINS,
]

const PRODUCT_TYPE: TagSlug[] = [
  // Nettoyage
  TAG_SLUGS.BAUME_DEMAQUILLANT,
  TAG_SLUGS.HUILE_DEMAQUILLANTE,
  TAG_SLUGS.HUILE_NETTOYANTE,
  TAG_SLUGS.GEL_NETTOYANT,
  TAG_SLUGS.MOUSSE_NETTOYANTE,
  TAG_SLUGS.LAIT_NETTOYANT,
  TAG_SLUGS.CREME_NETTOYANTE,
  TAG_SLUGS.EAU_MICELLAIRE,
  // Préparation
  TAG_SLUGS.TONIQUE,
  TAG_SLUGS.ESSENCE,
  TAG_SLUGS.LOTION,
  TAG_SLUGS.BRUME,
  TAG_SLUGS.PRIMER,
  // Traitements
  TAG_SLUGS.SERUM,
  TAG_SLUGS.AMPOULE,
  TAG_SLUGS.HUILE_VISAGE,
  TAG_SLUGS.SPOT_TREATMENT,
  // Hydratation / Soin
  TAG_SLUGS.CREME_HYDRATANTE,
  TAG_SLUGS.GEL_CREME,
  TAG_SLUGS.CREME_DE_NUIT,
  TAG_SLUGS.BAUME,
  TAG_SLUGS.SLEEPING_MASK,
  TAG_SLUGS.CONTOUR_YEUX,
  TAG_SLUGS.SOIN_LEVRES,
  // Exfoliants
  TAG_SLUGS.EXFOLIANT_CHIMIQUE,
  TAG_SLUGS.EXFOLIANT_PHYSIQUE,
  // Masques
  TAG_SLUGS.MASQUE_ARGILE,
  TAG_SLUGS.MASQUE_TISSU,
  TAG_SLUGS.MASQUE_HYDRATANT,
  // Solaires
  TAG_SLUGS.CREME_SOLAIRE,
  TAG_SLUGS.CREME_SOLAIRE_TEINTEE,
  TAG_SLUGS.APRES_SOLEIL,
  TAG_SLUGS.AUTO_BRONZANT,
  // Corps
  TAG_SLUGS.LAIT_CORPS,
  TAG_SLUGS.CREME_CORPS,
  TAG_SLUGS.CREME_MAINS,
  TAG_SLUGS.HUILE_CORPS,
  TAG_SLUGS.GOMMAGE_CORPS,
  TAG_SLUGS.NETTOYANT_CORPS,
  TAG_SLUGS.DEODORANT,
  TAG_SLUGS.CREME_PIEDS,
  // Cheveux
  TAG_SLUGS.SHAMPOING,
  TAG_SLUGS.APRES_SHAMPOING,
  TAG_SLUGS.MASQUE_CHEVEUX,
  TAG_SLUGS.SERUM_CHEVEUX,
  TAG_SLUGS.HUILE_CHEVEUX,
  TAG_SLUGS.PRODUIT_COIFFANT,
  // Bucco-dentaire
  TAG_SLUGS.DENTIFRICE,
  TAG_SLUGS.BAIN_DE_BOUCHE,
  TAG_SLUGS.BLANCHIMENT_DENTAIRE,
  TAG_SLUGS.FIL_DENTAIRE,
  // Compléments
  TAG_SLUGS.GELULE,
  TAG_SLUGS.CAPSULE,
  TAG_SLUGS.POUDRE,
  TAG_SLUGS.SIROP,
  TAG_SLUGS.GUMMY,
  // Accessoires
  TAG_SLUGS.PATCH,
  TAG_SLUGS.OUTIL_MASSAGE,
]

const ROUTINE_STEP: TagSlug[] = [
  TAG_SLUGS.MATIN,
  TAG_SLUGS.SOIR,
  TAG_SLUGS.NETTOYANT,
  TAG_SLUGS.DOUBLE_NETTOYAGE_1,
  TAG_SLUGS.DOUBLE_NETTOYAGE_2,
  TAG_SLUGS.PREPARATION,
  TAG_SLUGS.TRAITEMENT,
  TAG_SLUGS.HYDRATATION,
  TAG_SLUGS.EMOLLIENCE,
  TAG_SLUGS.PROTECTION_SOLAIRE,
  TAG_SLUGS.OCCLUSION,
  TAG_SLUGS.SOIN_YEUX,
  TAG_SLUGS.SOIN_LOCALISE,
  TAG_SLUGS.EXFOLIATION,
  TAG_SLUGS.MASQUE_HEBDO,
]

// Propriétés fonctionnelles de molécule — décrivent le rôle chimique
// ou biologique d'un ingrédient, jamais d'un produit fini.
const INGREDIENT_ATTRIBUTE: TagSlug[] = [
  TAG_SLUGS.ANTI_OXYDANT,
  TAG_SLUGS.HUMECTANT,
  TAG_SLUGS.EMOLLIENT,
  TAG_SLUGS.REPARATEUR,
  TAG_SLUGS.ANTISEPTIQUE,
  TAG_SLUGS.KERATOLYTIQUE,
  TAG_SLUGS.SEBO_REGULATEUR,
  TAG_SLUGS.ASTRINGENT,
  TAG_SLUGS.ANTI_BACTERIEN,
  TAG_SLUGS.BIOMIMETIQUE,
  TAG_SLUGS.APAISANT,
  TAG_SLUGS.PREBIOTIQUE,
  TAG_SLUGS.ANTI_INFLAMMATOIRE,
  TAG_SLUGS.PURIFIANT,
  TAG_SLUGS.FILTRE_UV,
  TAG_SLUGS.TENSIOACTIF,
  TAG_SLUGS.EXCIPIENT,
  TAG_SLUGS.ACTIF,
]

// Rendu / effet perçu sur la peau. La plupart ne sont définis qu'au
// niveau d'un produit fini (texture), mais certains correspondent aussi
// à une propriété intrinsèque de molécule (ex: petrolatum est occlusif,
// silice est matifiante) — ceux-là sont scope=both.
const SKIN_EFFECT_PRODUCT_ONLY: TagSlug[] = [TAG_SLUGS.TEXTURE_RICHE, TAG_SLUGS.TEXTURE_LEGERE]
const SKIN_EFFECT_BOTH: TagSlug[] = [
  TAG_SLUGS.OCCLUSIF, // déplacé depuis product_type — "effet filmogène"
  TAG_SLUGS.REPULPANT, // déplacé depuis concern
  TAG_SLUGS.MATIFIANT,
  TAG_SLUGS.PROTECTION_CUTANEE,
]

// Labels de formulation / certifications — qualifient un produit fini.
const PRODUCT_LABEL: TagSlug[] = [
  TAG_SLUGS.SANS_PARFUM,
  TAG_SLUGS.BIO_NATUREL,
  TAG_SLUGS.VEGAN,
  TAG_SLUGS.CRUELTY_FREE,
  TAG_SLUGS.HYPOALLERGENIQUE,
  TAG_SLUGS.PIGMENTS_VERTS,
  TAG_SLUGS.SANS_SAVON,
  TAG_SLUGS.GROSSESSE_COMPATIBLE,
]

// Product labels qui correspondent aussi à une propriété intrinsèque
// de molécule : un ingrédient "est" un filtre chimique/minéral (pas
// seulement un produit qui en contient).
const PRODUCT_LABEL_BOTH: TagSlug[] = [TAG_SLUGS.FILTRES_CHIMIQUES, TAG_SLUGS.FILTRES_MINERAUX]

// Labels partagés — les seuls labels qui s'appliquent à la fois à
// une molécule (propriété intrinsèque mesurée) et à un produit fini
// (revendication). Typiquement : (non) comédogénicité.
const SHARED_LABEL: TagSlug[] = [TAG_SLUGS.COMEDOGENE, TAG_SLUGS.NON_COMEDOGENE]

// ─── Map dérivée ───────────────────────────────────────────────────
// Construction vérifiée à l'exécution : tout slug connu doit être ici,
// tout slug ici doit être connu (voir test shared-schemas-vs-tags).

const entries: [TagSlug, TagMeta][] = [
  ...CONCERN.map((s): [TagSlug, TagMeta] => [s, { category: 'concern', scope: 'both' }]),
  ...SKIN_TYPE.map((s): [TagSlug, TagMeta] => [s, { category: 'skin_type', scope: 'both' }]),
  ...SKIN_ZONE.map((s): [TagSlug, TagMeta] => [s, { category: 'skin_zone', scope: 'product' }]),
  ...PRODUCT_TYPE.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'product_type', scope: 'product' },
  ]),
  ...ROUTINE_STEP.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'routine_step', scope: 'product' },
  ]),
  ...INGREDIENT_ATTRIBUTE.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'ingredient_attribute', scope: 'ingredient' },
  ]),
  ...SKIN_EFFECT_PRODUCT_ONLY.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'skin_effect', scope: 'product' },
  ]),
  ...SKIN_EFFECT_BOTH.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'skin_effect', scope: 'both' },
  ]),
  ...PRODUCT_LABEL.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'product_label', scope: 'product' },
  ]),
  ...PRODUCT_LABEL_BOTH.map((s): [TagSlug, TagMeta] => [
    s,
    { category: 'product_label', scope: 'both' },
  ]),
  ...SHARED_LABEL.map((s): [TagSlug, TagMeta] => [s, { category: 'shared_label', scope: 'both' }]),
]

export const TAG_TAXONOMY = Object.fromEntries(entries) as Record<TagSlug, TagMeta>

// ─── Helpers ───────────────────────────────────────────────────────

export function canTagEntity(slug: TagSlug, entity: 'ingredient' | 'product'): boolean {
  const meta = TAG_TAXONOMY[slug]
  if (!meta) return false
  return meta.scope === 'both' || meta.scope === entity
}

export function getTagCategory(slug: TagSlug): TagCategory | undefined {
  return TAG_TAXONOMY[slug]?.category
}

// Slugs autorisés dans une association `avoid` (ingrédient ou produit).
// Règle : skin_type | concern (+ 'grossesse-compatible' en exception).
export function isValidAvoidTag(slug: string): boolean {
  if (slug === TAG_SLUGS.GROSSESSE_COMPATIBLE) return true
  const meta = TAG_TAXONOMY[slug as TagSlug]
  if (!meta) return false
  return meta.category === 'skin_type' || meta.category === 'concern'
}
