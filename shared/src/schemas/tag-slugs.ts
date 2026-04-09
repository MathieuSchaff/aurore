// ─── Tag Slugs (Source de vérité partagée) ─────────────────────────
//
// Liste exhaustive des slugs de tags utilisés dans l'app. Centralisée ici
// pour que le backend (seed + routes) et le frontend (filtres, labels)
// partagent exactement les mêmes identifiants et évitent les coquilles.
//
// Les métadonnées (name affiché, category) restent côté backend dans
// `backend/src/db/seed/tags/seed-tags.ts` via `tagData`, car seul le seed
// en a besoin. Le frontend récupère la liste des tags disponibles via
// l'endpoint `GET /filter-options`.

export const TAG_SLUGS = {
  // ── Concerns (Problématiques) ───────────────────────────────────────
  ANTI_ROUGEURS: 'anti-rougeurs',
  ROSACEE: 'rosacee',
  COUPEROSE: 'couperose',
  FLUSHS: 'flushs',
  BARRIERE_CUTANEE: 'barriere-cutanee',
  ANTI_TACHES: 'anti-taches',
  ANTI_ACNE: 'anti-acne',
  ANTI_AGE: 'anti-age',
  HYPERPIGMENTATION: 'hyperpigmentation',
  DESHYDRATATION: 'deshydratation',
  PORES_DILATES: 'pores-dilates',
  CERNES_POCHES: 'cernes-poches',
  BRILLANCE: 'brillance',
  ECLAT: 'eclat',
  POST_ACNE: 'post-acne',
  CICATRISATION: 'cicatrisation',
  MICROBIOME: 'microbiome',
  PHOTO_VIEILLISSEMENT: 'photo-vieillissement',
  TEINT_TERNE: 'teint-terne',
  LUMIERE_BLEUE: 'lumiere-bleue',
  POLLUTION: 'pollution',
  REPULPANT: 'repulpant',
  ECZEMA: 'eczema',
  GRAIN_PEAU: 'grain-peau',
  KERATOSE_PILAIRE: 'keratose-pilaire',
  PHOTO_PROTECTION: 'photo-protection',
  BARRIERE_CUTANEE_ALTEREE: 'barriere-cutanee-alteree',

  // ── Skin types (Types de peau) ──────────────────────────────────────
  PEAU_SECHE: 'peau-seche',
  PEAU_MIXTE: 'peau-mixte',
  PEAU_GRASSE: 'peau-grasse',
  PEAU_REACTIVE: 'peau-reactive',
  PEAU_SENSIBLE: 'peau-sensible',
  PEAU_NORMALE: 'peau-normale',
  PEAU_ATOPIQUE: 'peau-atopique',
  PEAU_RUGUEUSE: 'peau-rugueuse',
  PEAU_TOUS_TYPES: 'tous-types',

  // ── Product types (Format / Nature du produit) ──────────────────────
  // ⚠️ Réservé aux produits uniquement. Jamais sur un ingrédient.
  // Nettoyage
  BAUME_DEMAQUILLANT: 'baume-demaquillant',
  HUILE_DEMAQUILLANTE: 'huile-demaquillante',
  HUILE_NETTOYANTE: 'huile-nettoyante',
  GEL_NETTOYANT: 'gel-nettoyant',
  MOUSSE_NETTOYANTE: 'mousse-nettoyante',
  LAIT_NETTOYANT: 'lait-nettoyant',
  CREME_NETTOYANTE: 'creme-nettoyante',
  EAU_MICELLAIRE: 'eau-micellaire',
  // Préparation
  TONIQUE: 'tonique',
  ESSENCE: 'essence',
  LOTION: 'lotion',
  BRUME: 'brume',
  PRIMER: 'primer',
  // Traitements
  SERUM: 'serum',
  AMPOULE: 'ampoule',
  HUILE_VISAGE: 'huile-visage',
  SPOT_TREATMENT: 'spot-treatment',
  // Hydratation / Soin
  CREME_HYDRATANTE: 'creme-hydratante',
  GEL_CREME: 'gel-creme',
  CREME_DE_NUIT: 'creme-de-nuit',
  BAUME: 'baume',
  SLEEPING_MASK: 'sleeping-mask',
  OCCLUSIF: 'occlusif',
  CONTOUR_YEUX: 'contour-yeux',
  SOIN_LEVRES: 'soin-levres',
  // Exfoliants
  EXFOLIANT_CHIMIQUE: 'exfoliant-chimique',
  EXFOLIANT_PHYSIQUE: 'exfoliant-physique',
  // Masques
  MASQUE_ARGILE: 'masque-argile',
  MASQUE_TISSU: 'masque-tissu',
  MASQUE_HYDRATANT: 'masque-hydratant',
  // Solaires
  CREME_SOLAIRE: 'creme-solaire',
  CREME_SOLAIRE_TEINTEE: 'creme-solaire-teintee',
  APRES_SOLEIL: 'apres-soleil',
  AUTO_BRONZANT: 'auto-bronzant',
  // Corps
  LAIT_CORPS: 'lait-corps',
  CREME_CORPS: 'creme-corps',
  CREME_MAINS: 'creme-mains',
  HUILE_CORPS: 'huile-corps',
  GOMMAGE_CORPS: 'gommage-corps',
  NETTOYANT_CORPS: 'nettoyant-corps',
  DEODORANT: 'deodorant',
  CREME_PIEDS: 'creme-pieds',
  // Cheveux
  SHAMPOING: 'shampoing',
  APRES_SHAMPOING: 'apres-shampoing',
  MASQUE_CHEVEUX: 'masque-cheveux',
  SERUM_CHEVEUX: 'serum-cheveux',
  HUILE_CHEVEUX: 'huile-cheveux',
  PRODUIT_COIFFANT: 'produit-coiffant',
  // Bucco-dentaire
  DENTIFRICE: 'dentifrice',
  BAIN_DE_BOUCHE: 'bain-de-bouche',
  BLANCHIMENT_DENTAIRE: 'blanchiment-dentaire',
  FIL_DENTAIRE: 'fil-dentaire',
  // Compléments
  GELULE: 'gelule',
  CAPSULE: 'capsule',
  POUDRE: 'poudre',
  SIROP: 'sirop',
  GUMMY: 'gummy',
  // Accessoires / Outils
  PATCH: 'patch',
  OUTIL_MASSAGE: 'outil-massage',

  // ── Routine steps (Moment / Étape dans la routine) ──────────────────
  // ⚠️ Réservé aux produits uniquement. Ne pas confondre avec les
  // attributs fonctionnels d'un ingrédient (ex: humectant ≠ hydratation).
  MATIN: 'matin',
  SOIR: 'soir',
  NETTOYANT: 'nettoyant',
  DOUBLE_NETTOYAGE_1: 'double-nettoyage-1', // 1er nettoyage (huileux)
  DOUBLE_NETTOYAGE_2: 'double-nettoyage-2', // 2e nettoyage (aqueux)
  PREPARATION: 'preparation', // toner / essence
  TRAITEMENT: 'traitement', // actif principal
  HYDRATATION: 'hydratation', // couche HA / glycérine
  EMOLLIENCE: 'emollience', // crème / émulsion
  PROTECTION_SOLAIRE: 'protection-solaire', // SPF — étape finale matin
  OCCLUSION: 'occlusion', // slugging / finale soir
  SOIN_YEUX: 'soin-yeux',
  SOIN_LOCALISE: 'soin-localise',
  EXFOLIATION: 'exfoliation', // 1–3×/semaine
  MASQUE_HEBDO: 'masque-hebdo', // usage occasionnel

  // ── Skin zones (Zone d'application) ────────────────────────────────
  ZONE_VISAGE: 'zone-visage',
  ZONE_CORPS: 'zone-corps',
  ZONE_YEUX: 'zone-yeux',
  ZONE_LEVRES: 'zone-levres',
  ZONE_MAINS: 'zone-mains',

  // ── Attributes – Propriétés fonctionnelles ──────────────────────────
  ANTI_OXYDANT: 'anti-oxydant',
  HUMECTANT: 'humectant', // Attire et retient les molécules d'eau (depuis l'air ou les couches profondes) vers la surface de la peau. Ex : acide hyaluronique, glycérine.
  EMOLLIENT: 'emollient', // Comble les espaces entre les cellules cornées pour lisser et assouplir la texture cutanée. Agit sur la surface, contrairement à l'humectant. Ex : squalane, beurre de karité.
  REPARATEUR: 'reparateur',
  ANTISEPTIQUE: 'antiseptique', // Détruit ou inhibe la croissance des micro-organismes (bactéries, champignons, virus) sur la peau. Plus large qu'antibactérien : couvre un spectre plus large de pathogènes. Ex : alcool, chlorhexidine, tea tree.
  KERATOLYTIQUE: 'keratolytique', // Dégrade les liaisons entre les cornéocytes pour exfolier chimiquement la couche cornée. Ex : AHA, BHA, urée à haute concentration.
  SEBO_REGULATEUR: 'sebo-regulateur', // Réduit la production de sébum par les glandes sébacées. Ex : niacinamide, zinc, acide azélaïque.
  MATIFIANT: 'matifiant', // Absorbe l'excès de sébum et de brillance en surface pour donner un fini mat. Agit sur le résultat visuel immédiat, contrairement au sébo-régulateur qui agit sur la production à la source. Ex : silice, amidon de riz, argile.
  ASTRINGENT: 'astringent', //  Resserre temporairement les pores et réduit l'aspect luisant par contraction des tissus. Ex : witch hazel, alun, tannins.
  TEXTURE_RICHE: 'texture-riche',
  TEXTURE_LEGERE: 'texture-legere',
  PROTECTION_CUTANEE: 'protection-cutanee',
  ANTI_BACTERIEN: 'anti-bacterien',
  BIOMIMETIQUE: 'biomimetique',
  APAISANT: 'apaisant',
  PREBIOTIQUE: 'prebiotique', // Nourrit sélectivement les bonnes bactéries du microbiome cutané sans en apporter directement.
  ANTI_INFLAMMATOIRE: 'anti-inflammatoire',
  PURIFIANT: 'purifiant',
  FILTRE_UV: 'filtre-uv',
  TENSIOACTIF: 'tensioactif',
  EXCIPIENT: 'excipient',
  ACTIF: 'actif',

  // ── Attributes – Labels & certifications ────────────────────────────
  SANS_PARFUM: 'sans-parfum',
  BIO_NATUREL: 'bio-naturel',
  VEGAN: 'vegan',
  CRUELTY_FREE: 'cruelty-free',
  HYPOALLERGENIQUE: 'hypoallergenique', //  Formulation conçue pour minimiser le risque de réaction allergique (sans parfum, sans conservateurs agressifs, sans allergènes courants). ⚠️ Terme non réglementé légalement — c'est un engagement de formulation, pas une garantie absolue.
  NON_COMEDOGENE: 'non-comedogene',
  COMEDOGENE: 'comedogene',
  PIGMENTS_VERTS: 'pigments-verts',
  SANS_SAVON: 'sans-savon',
  FILTRES_CHIMIQUES: 'filtres-chimiques',
  FILTRES_MINERAUX: 'filtres-mineraux',
  GROSSESSE_COMPATIBLE: 'grossesse-compatible',
} as const

export type TagSlug = (typeof TAG_SLUGS)[keyof typeof TAG_SLUGS]
