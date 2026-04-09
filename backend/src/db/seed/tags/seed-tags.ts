import { TAG_SLUGS, TAG_TAXONOMY, type TagSlug } from '@habit-tracker/shared'

// Re-export so existing backend imports (`from '../tags/seed-tags'`) keep working.
// Source of truth for slugs lives in shared/src/schemas/tag-slugs.ts, and for
// (category, scope) in shared/src/schemas/tag-taxonomy.ts.
export { TAG_SLUGS }
export type { TagSlug } from '@habit-tracker/shared'

// Display names for each tag. Category is derived from TAG_TAXONOMY so it
// can never drift from the shared taxonomy. When you add a new slug:
//   1. add it to shared/src/schemas/tag-slugs.ts
//   2. add it to shared/src/schemas/tag-taxonomy.ts (assign category + scope)
//   3. add its FR display name here
const TAG_NAMES: Record<TagSlug, string> = {
  // ── Concerns ───────────────────────────────────────────────────────
  [TAG_SLUGS.ANTI_ROUGEURS]: 'Anti-rougeurs',
  [TAG_SLUGS.ROSACEE]: 'Rosacée',
  [TAG_SLUGS.COUPEROSE]: 'Couperose',
  [TAG_SLUGS.FLUSHS]: 'Flushs',
  [TAG_SLUGS.BARRIERE_CUTANEE]: 'Barrière cutanée',
  [TAG_SLUGS.ANTI_TACHES]: 'Anti-taches',
  [TAG_SLUGS.ANTI_ACNE]: 'Anti-acné',
  [TAG_SLUGS.ANTI_AGE]: 'Anti-âge',
  [TAG_SLUGS.HYPERPIGMENTATION]: 'Hyperpigmentation',
  [TAG_SLUGS.DESHYDRATATION]: 'Déshydratation',
  [TAG_SLUGS.PORES_DILATES]: 'Pores dilatés',
  [TAG_SLUGS.CERNES_POCHES]: 'Cernes et poches',
  [TAG_SLUGS.BRILLANCE]: 'Brillance',
  [TAG_SLUGS.ECLAT]: 'Éclat',
  [TAG_SLUGS.POST_ACNE]: 'Marques post-acné',
  [TAG_SLUGS.CICATRISATION]: 'Cicatrisation',
  [TAG_SLUGS.MICROBIOME]: 'Microbiome',
  [TAG_SLUGS.PHOTO_VIEILLISSEMENT]: 'Photo-vieillissement',
  [TAG_SLUGS.TEINT_TERNE]: 'Teint terne',
  [TAG_SLUGS.LUMIERE_BLEUE]: 'Lumière bleue',
  [TAG_SLUGS.POLLUTION]: 'Pollution',
  [TAG_SLUGS.ECZEMA]: 'Eczéma',
  [TAG_SLUGS.GRAIN_PEAU]: 'Grain de peau',
  [TAG_SLUGS.KERATOSE_PILAIRE]: 'Kératose pilaire',
  [TAG_SLUGS.PHOTO_PROTECTION]: 'Photoprotection',
  [TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE]: 'Barrière altérée',

  // ── Skin types ─────────────────────────────────────────────────────
  [TAG_SLUGS.PEAU_SECHE]: 'Peau sèche',
  [TAG_SLUGS.PEAU_MIXTE]: 'Peau mixte',
  [TAG_SLUGS.PEAU_GRASSE]: 'Peau grasse',
  [TAG_SLUGS.PEAU_REACTIVE]: 'Peau réactive',
  [TAG_SLUGS.PEAU_SENSIBLE]: 'Peau sensible',
  [TAG_SLUGS.PEAU_NORMALE]: 'Peau normale',
  [TAG_SLUGS.PEAU_ATOPIQUE]: 'Peau atopique',
  [TAG_SLUGS.PEAU_RUGUEUSE]: 'Peau rugueuse',
  [TAG_SLUGS.PEAU_TOUS_TYPES]: 'Tous types de peau',

  // ── Product types ──────────────────────────────────────────────────
  [TAG_SLUGS.BAUME_DEMAQUILLANT]: 'Baume démaquillant',
  [TAG_SLUGS.HUILE_DEMAQUILLANTE]: 'Huile démaquillante',
  [TAG_SLUGS.HUILE_NETTOYANTE]: 'Huile nettoyante',
  [TAG_SLUGS.GEL_NETTOYANT]: 'Gel nettoyant',
  [TAG_SLUGS.MOUSSE_NETTOYANTE]: 'Mousse nettoyante',
  [TAG_SLUGS.LAIT_NETTOYANT]: 'Lait nettoyant',
  [TAG_SLUGS.CREME_NETTOYANTE]: 'Crème nettoyante',
  [TAG_SLUGS.EAU_MICELLAIRE]: 'Eau micellaire',
  [TAG_SLUGS.TONIQUE]: 'Tonique',
  [TAG_SLUGS.ESSENCE]: 'Essence',
  [TAG_SLUGS.LOTION]: 'Lotion',
  [TAG_SLUGS.BRUME]: 'Brume / Mist',
  [TAG_SLUGS.PRIMER]: 'Primer',
  [TAG_SLUGS.SERUM]: 'Sérum',
  [TAG_SLUGS.AMPOULE]: 'Ampoule',
  [TAG_SLUGS.HUILE_VISAGE]: 'Huile visage',
  [TAG_SLUGS.SPOT_TREATMENT]: 'Traitement ciblé',
  [TAG_SLUGS.CREME_HYDRATANTE]: 'Crème hydratante',
  [TAG_SLUGS.GEL_CREME]: 'Gel-crème',
  [TAG_SLUGS.CREME_DE_NUIT]: 'Crème de nuit',
  [TAG_SLUGS.BAUME]: 'Baume',
  [TAG_SLUGS.SLEEPING_MASK]: 'Sleeping mask',
  [TAG_SLUGS.CONTOUR_YEUX]: 'Contour des yeux',
  [TAG_SLUGS.SOIN_LEVRES]: 'Soin lèvres',
  [TAG_SLUGS.EXFOLIANT_CHIMIQUE]: 'Exfoliant chimique',
  [TAG_SLUGS.EXFOLIANT_PHYSIQUE]: 'Exfoliant physique',
  [TAG_SLUGS.MASQUE_ARGILE]: 'Masque argile',
  [TAG_SLUGS.MASQUE_TISSU]: 'Masque tissu',
  [TAG_SLUGS.MASQUE_HYDRATANT]: 'Masque hydratant',
  [TAG_SLUGS.CREME_SOLAIRE]: 'Crème solaire',
  [TAG_SLUGS.CREME_SOLAIRE_TEINTEE]: 'Crème solaire teintée',
  [TAG_SLUGS.APRES_SOLEIL]: 'Après-soleil',
  [TAG_SLUGS.AUTO_BRONZANT]: 'Auto-bronzant',
  [TAG_SLUGS.LAIT_CORPS]: 'Lait corps',
  [TAG_SLUGS.CREME_CORPS]: 'Crème corps',
  [TAG_SLUGS.CREME_MAINS]: 'Crème mains',
  [TAG_SLUGS.HUILE_CORPS]: 'Huile corps',
  [TAG_SLUGS.GOMMAGE_CORPS]: 'Gommage corps',
  [TAG_SLUGS.NETTOYANT_CORPS]: 'Nettoyant corps',
  [TAG_SLUGS.DEODORANT]: 'Déodorant',
  [TAG_SLUGS.CREME_PIEDS]: 'Crème pieds',
  [TAG_SLUGS.SHAMPOING]: 'Shampoing',
  [TAG_SLUGS.APRES_SHAMPOING]: 'Après-shampoing',
  [TAG_SLUGS.MASQUE_CHEVEUX]: 'Masque cheveux',
  [TAG_SLUGS.SERUM_CHEVEUX]: 'Sérum cheveux',
  [TAG_SLUGS.HUILE_CHEVEUX]: 'Huile cheveux',
  [TAG_SLUGS.PRODUIT_COIFFANT]: 'Produit coiffant',
  [TAG_SLUGS.DENTIFRICE]: 'Dentifrice',
  [TAG_SLUGS.BAIN_DE_BOUCHE]: 'Bain de bouche',
  [TAG_SLUGS.BLANCHIMENT_DENTAIRE]: 'Blanchiment dentaire',
  [TAG_SLUGS.FIL_DENTAIRE]: 'Fil dentaire',
  [TAG_SLUGS.GELULE]: 'Gélule',
  [TAG_SLUGS.CAPSULE]: 'Capsule',
  [TAG_SLUGS.POUDRE]: 'Poudre',
  [TAG_SLUGS.SIROP]: 'Sirop',
  [TAG_SLUGS.GUMMY]: 'Gummy',
  [TAG_SLUGS.PATCH]: 'Patch',
  [TAG_SLUGS.OUTIL_MASSAGE]: 'Outil de massage',

  // ── Routine steps ──────────────────────────────────────────────────
  [TAG_SLUGS.MATIN]: 'Matin',
  [TAG_SLUGS.SOIR]: 'Soir',
  [TAG_SLUGS.NETTOYANT]: 'Nettoyant',
  [TAG_SLUGS.DOUBLE_NETTOYAGE_1]: '1er nettoyage',
  [TAG_SLUGS.DOUBLE_NETTOYAGE_2]: '2e nettoyage',
  [TAG_SLUGS.PREPARATION]: 'Préparation',
  [TAG_SLUGS.TRAITEMENT]: 'Traitement actif',
  [TAG_SLUGS.HYDRATATION]: 'Hydratation',
  [TAG_SLUGS.EMOLLIENCE]: 'Émollience',
  [TAG_SLUGS.PROTECTION_SOLAIRE]: 'Protection solaire',
  [TAG_SLUGS.OCCLUSION]: 'Occlusion finale',
  [TAG_SLUGS.SOIN_YEUX]: 'Soin yeux',
  [TAG_SLUGS.SOIN_LOCALISE]: 'Soin localisé',
  [TAG_SLUGS.EXFOLIATION]: 'Exfoliation',
  [TAG_SLUGS.MASQUE_HEBDO]: 'Masque hebdo',

  // ── Skin zones ─────────────────────────────────────────────────────
  [TAG_SLUGS.ZONE_VISAGE]: 'Visage',
  [TAG_SLUGS.ZONE_CORPS]: 'Corps',
  [TAG_SLUGS.ZONE_YEUX]: 'Yeux',
  [TAG_SLUGS.ZONE_LEVRES]: 'Lèvres',
  [TAG_SLUGS.ZONE_MAINS]: 'Mains',

  // ── Ingredient attributes (propriétés fonctionnelles de molécule) ──
  [TAG_SLUGS.ANTI_OXYDANT]: 'Anti-oxydant',
  [TAG_SLUGS.HUMECTANT]: 'Humectant',
  [TAG_SLUGS.EMOLLIENT]: 'Émollient',
  [TAG_SLUGS.REPARATEUR]: 'Réparateur',
  [TAG_SLUGS.ANTISEPTIQUE]: 'Antiseptique',
  [TAG_SLUGS.KERATOLYTIQUE]: 'Kératolytique',
  [TAG_SLUGS.SEBO_REGULATEUR]: 'Sébo-régulateur',
  [TAG_SLUGS.ASTRINGENT]: 'Astringent',
  [TAG_SLUGS.ANTI_BACTERIEN]: 'Anti-bactérien',
  [TAG_SLUGS.BIOMIMETIQUE]: 'Biomimétique',
  [TAG_SLUGS.APAISANT]: 'Apaisant',
  [TAG_SLUGS.PREBIOTIQUE]: 'Prébiotique',
  [TAG_SLUGS.ANTI_INFLAMMATOIRE]: 'Anti-inflammatoire',
  [TAG_SLUGS.PURIFIANT]: 'Purifiant',
  [TAG_SLUGS.FILTRE_UV]: 'Filtre UV',
  [TAG_SLUGS.TENSIOACTIF]: 'Tensioactif',
  [TAG_SLUGS.EXCIPIENT]: 'Excipient',
  [TAG_SLUGS.ACTIF]: 'Actif',

  // ── Skin effects (rendu / effet sur peau, produit fini) ────────────
  [TAG_SLUGS.OCCLUSIF]: 'Occlusif',
  [TAG_SLUGS.REPULPANT]: 'Repulpant',
  [TAG_SLUGS.MATIFIANT]: 'Matifiant',
  [TAG_SLUGS.TEXTURE_RICHE]: 'Texture riche',
  [TAG_SLUGS.TEXTURE_LEGERE]: 'Texture légère',
  [TAG_SLUGS.PROTECTION_CUTANEE]: 'Protection cutanée',

  // ── Product labels (formulation / certifications) ──────────────────
  [TAG_SLUGS.SANS_PARFUM]: 'Sans parfum',
  [TAG_SLUGS.BIO_NATUREL]: 'Bio / Naturel',
  [TAG_SLUGS.VEGAN]: 'Vegan',
  [TAG_SLUGS.CRUELTY_FREE]: 'Cruelty-free',
  [TAG_SLUGS.HYPOALLERGENIQUE]: 'Hypoallergénique',
  [TAG_SLUGS.PIGMENTS_VERTS]: 'Pigments verts',
  [TAG_SLUGS.SANS_SAVON]: 'Sans savon',
  [TAG_SLUGS.FILTRES_CHIMIQUES]: 'Filtres chimiques',
  [TAG_SLUGS.FILTRES_MINERAUX]: 'Filtres minéraux',
  [TAG_SLUGS.GROSSESSE_COMPATIBLE]: 'Grossesse compatible',

  // ── Shared labels (molécule + produit) ─────────────────────────────
  [TAG_SLUGS.COMEDOGENE]: 'Comédogène',
  [TAG_SLUGS.NON_COMEDOGENE]: 'Non comédogène',
}

// Seed rows: (slug, name, category) where category is derived from the
// shared taxonomy — impossible to desync from TAG_TAXONOMY by accident.
export const tagData = (Object.keys(TAG_NAMES) as TagSlug[]).map((slug) => ({
  slug,
  name: TAG_NAMES[slug],
  category: TAG_TAXONOMY[slug].category,
}))
