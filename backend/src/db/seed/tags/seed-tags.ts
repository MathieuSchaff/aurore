export const TAG_SLUGS = {
  // ── Concerns (Problématiques) ───────────────────────────────────────
  ANTI_ROUGEURS: 'anti-rougeurs',
  ROSACEE: 'rosacee',
  COUPEROSE: 'couperose',
  FLUSHS: 'flushs',
  PEAU_SENSIBLE: 'peau-sensible',
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

  // ── Skin types (Types de peau) ──────────────────────────────────────
  PEAU_SECHE: 'peau-seche',
  PEAU_MIXTE: 'peau-mixte',
  PEAU_GRASSE: 'peau-grasse',
  PEAU_REACTIVE: 'peau-reactive',
  PEAU_NORMALE: 'peau-normale',
  PEAU_ATOPIQUE: 'peau-atopique',
  PEAU_RUGUEUSE: 'peau-rugueuse',
  PEAU_TOUS_TYPES: 'tous-types',

  // ── Product types (Format / Nature du produit) ──────────────────────
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
  // Corps
  LAIT_CORPS: 'lait-corps',
  CREME_CORPS: 'creme-corps',
  CREME_MAINS: 'creme-mains',
  HUILE_CORPS: 'huile-corps',
  // Accessoires / Outils
  PATCH: 'patch',
  OUTIL_MASSAGE: 'outil-massage',

  // ── Routine steps (Moment / Étape dans la routine) ──────────────────
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
  BARRIERE_CUTANEE_ALTEREE: 'barriere-cutanee-alteree',
} as const
// Pour les ingrédients => les tags pas possible sonts: product_type, routine_step
//
export const tagData = [
  // ── Concerns ───────────────────────────────────────────────────────
  { name: 'Anti-rougeurs', slug: TAG_SLUGS.ANTI_ROUGEURS, category: 'concern' },
  { name: 'Rosacée', slug: TAG_SLUGS.ROSACEE, category: 'concern' },
  { name: 'Couperose', slug: TAG_SLUGS.COUPEROSE, category: 'concern' },
  { name: 'Flushs', slug: TAG_SLUGS.FLUSHS, category: 'concern' },
  { name: 'Peau sensible', slug: TAG_SLUGS.PEAU_SENSIBLE, category: 'concern' },
  { name: 'Barrière cutanée', slug: TAG_SLUGS.BARRIERE_CUTANEE, category: 'concern' },
  { name: 'Anti-taches', slug: TAG_SLUGS.ANTI_TACHES, category: 'concern' },
  { name: 'Anti-acné', slug: TAG_SLUGS.ANTI_ACNE, category: 'concern' },
  { name: 'Anti-âge', slug: TAG_SLUGS.ANTI_AGE, category: 'concern' },
  { name: 'Hyperpigmentation', slug: TAG_SLUGS.HYPERPIGMENTATION, category: 'concern' },
  { name: 'Déshydratation', slug: TAG_SLUGS.DESHYDRATATION, category: 'concern' },
  { name: 'Pores dilatés', slug: TAG_SLUGS.PORES_DILATES, category: 'concern' },
  { name: 'Cernes et poches', slug: TAG_SLUGS.CERNES_POCHES, category: 'concern' },
  { name: 'Brillance', slug: TAG_SLUGS.BRILLANCE, category: 'concern' },
  { name: 'Éclat', slug: TAG_SLUGS.ECLAT, category: 'concern' },
  { name: 'Marques post-acné', slug: TAG_SLUGS.POST_ACNE, category: 'concern' },
  { name: 'Cicatrisation', slug: TAG_SLUGS.CICATRISATION, category: 'concern' },
  { name: 'Microbiome', slug: TAG_SLUGS.MICROBIOME, category: 'concern' },
  { name: 'Photo-vieillissement', slug: TAG_SLUGS.PHOTO_VIEILLISSEMENT, category: 'concern' },
  { name: 'Teint terne', slug: TAG_SLUGS.TEINT_TERNE, category: 'concern' },
  { name: 'Lumière bleue', slug: TAG_SLUGS.LUMIERE_BLEUE, category: 'concern' },
  { name: 'Pollution', slug: TAG_SLUGS.POLLUTION, category: 'concern' },
  { name: 'Repulpant', slug: TAG_SLUGS.REPULPANT, category: 'concern' },
  { name: 'Eczéma', slug: TAG_SLUGS.ECZEMA, category: 'concern' },
  { name: 'Grain de peau', slug: TAG_SLUGS.GRAIN_PEAU, category: 'concern' },
  { name: 'Kératose pilaire', slug: TAG_SLUGS.KERATOSE_PILAIRE, category: 'concern' },

  // ── Skin types ─────────────────────────────────────────────────────
  { name: 'Peau sèche', slug: TAG_SLUGS.PEAU_SECHE, category: 'skin_type' },
  { name: 'Peau mixte', slug: TAG_SLUGS.PEAU_MIXTE, category: 'skin_type' },
  { name: 'Peau grasse', slug: TAG_SLUGS.PEAU_GRASSE, category: 'skin_type' },
  { name: 'Peau réactive', slug: TAG_SLUGS.PEAU_REACTIVE, category: 'skin_type' },
  { name: 'Peau normale', slug: TAG_SLUGS.PEAU_NORMALE, category: 'skin_type' },
  { name: 'Peau atopique', slug: TAG_SLUGS.PEAU_ATOPIQUE, category: 'skin_type' },
  { name: 'Peau rugueuse', slug: TAG_SLUGS.PEAU_RUGUEUSE, category: 'skin_type' },
  { name: 'Tous types de peau', slug: TAG_SLUGS.PEAU_TOUS_TYPES, category: 'skin_type' },

  // ── Product types ──────────────────────────────────────────────────
  // Nettoyage
  { name: 'Baume démaquillant', slug: TAG_SLUGS.BAUME_DEMAQUILLANT, category: 'product_type' },
  { name: 'Huile démaquillante', slug: TAG_SLUGS.HUILE_DEMAQUILLANTE, category: 'product_type' },
  { name: 'Huile nettoyante', slug: TAG_SLUGS.HUILE_NETTOYANTE, category: 'product_type' },
  { name: 'Gel nettoyant', slug: TAG_SLUGS.GEL_NETTOYANT, category: 'product_type' },
  { name: 'Mousse nettoyante', slug: TAG_SLUGS.MOUSSE_NETTOYANTE, category: 'product_type' },
  { name: 'Lait nettoyant', slug: TAG_SLUGS.LAIT_NETTOYANT, category: 'product_type' },
  { name: 'Crème nettoyante', slug: TAG_SLUGS.CREME_NETTOYANTE, category: 'product_type' },
  { name: 'Eau micellaire', slug: TAG_SLUGS.EAU_MICELLAIRE, category: 'product_type' },
  // Préparation
  { name: 'Tonique', slug: TAG_SLUGS.TONIQUE, category: 'product_type' },
  { name: 'Essence', slug: TAG_SLUGS.ESSENCE, category: 'product_type' },
  { name: 'Lotion', slug: TAG_SLUGS.LOTION, category: 'product_type' },
  { name: 'Brume / Mist', slug: TAG_SLUGS.BRUME, category: 'product_type' },
  // Traitements
  { name: 'Sérum', slug: TAG_SLUGS.SERUM, category: 'product_type' },
  { name: 'Ampoule', slug: TAG_SLUGS.AMPOULE, category: 'product_type' },
  { name: 'Huile visage', slug: TAG_SLUGS.HUILE_VISAGE, category: 'product_type' },
  { name: 'Soin localisé', slug: TAG_SLUGS.SPOT_TREATMENT, category: 'product_type' },
  // Hydratation / Soin
  { name: 'Crème hydratante', slug: TAG_SLUGS.CREME_HYDRATANTE, category: 'product_type' },
  { name: 'Gel-crème', slug: TAG_SLUGS.GEL_CREME, category: 'product_type' },
  { name: 'Crème de nuit', slug: TAG_SLUGS.CREME_DE_NUIT, category: 'product_type' },
  { name: 'Baume', slug: TAG_SLUGS.BAUME, category: 'product_type' },
  { name: 'Sleeping mask', slug: TAG_SLUGS.SLEEPING_MASK, category: 'product_type' },
  { name: 'Occlusif', slug: TAG_SLUGS.OCCLUSIF, category: 'product_type' },
  { name: 'Contour des yeux', slug: TAG_SLUGS.CONTOUR_YEUX, category: 'product_type' },
  { name: 'Soin lèvres', slug: TAG_SLUGS.SOIN_LEVRES, category: 'product_type' },
  // Exfoliants
  { name: 'Exfoliant chimique', slug: TAG_SLUGS.EXFOLIANT_CHIMIQUE, category: 'product_type' },
  { name: 'Exfoliant physique', slug: TAG_SLUGS.EXFOLIANT_PHYSIQUE, category: 'product_type' },
  // Masques
  { name: 'Masque argile', slug: TAG_SLUGS.MASQUE_ARGILE, category: 'product_type' },
  { name: 'Masque tissu', slug: TAG_SLUGS.MASQUE_TISSU, category: 'product_type' },
  { name: 'Masque hydratant', slug: TAG_SLUGS.MASQUE_HYDRATANT, category: 'product_type' },
  // Solaires
  { name: 'Crème solaire', slug: TAG_SLUGS.CREME_SOLAIRE, category: 'product_type' },
  {
    name: 'Crème solaire teintée',
    slug: TAG_SLUGS.CREME_SOLAIRE_TEINTEE,
    category: 'product_type',
  },
  // Corps
  { name: 'Lait corps', slug: TAG_SLUGS.LAIT_CORPS, category: 'product_type' },
  { name: 'Crème corps', slug: TAG_SLUGS.CREME_CORPS, category: 'product_type' },
  { name: 'Crème mains', slug: TAG_SLUGS.CREME_MAINS, category: 'product_type' },
  { name: 'Huile corps', slug: TAG_SLUGS.HUILE_CORPS, category: 'product_type' },
  // Accessoires
  { name: 'Patch', slug: TAG_SLUGS.PATCH, category: 'product_type' },
  { name: 'Outil de massage', slug: TAG_SLUGS.OUTIL_MASSAGE, category: 'product_type' },

  // ── Routine steps ──────────────────────────────────────────────────
  { name: 'Matin', slug: TAG_SLUGS.MATIN, category: 'routine_step' },
  { name: 'Soir', slug: TAG_SLUGS.SOIR, category: 'routine_step' },
  { name: '1er nettoyage', slug: TAG_SLUGS.DOUBLE_NETTOYAGE_1, category: 'routine_step' },
  { name: '2e nettoyage', slug: TAG_SLUGS.DOUBLE_NETTOYAGE_2, category: 'routine_step' },
  { name: 'Préparation', slug: TAG_SLUGS.PREPARATION, category: 'routine_step' },
  { name: 'Traitement actif', slug: TAG_SLUGS.TRAITEMENT, category: 'routine_step' },
  { name: 'Hydratation', slug: TAG_SLUGS.HYDRATATION, category: 'routine_step' },
  { name: 'Émollience', slug: TAG_SLUGS.EMOLLIENCE, category: 'routine_step' },
  { name: 'Protection solaire', slug: TAG_SLUGS.PROTECTION_SOLAIRE, category: 'routine_step' },
  { name: 'Occlusion finale', slug: TAG_SLUGS.OCCLUSION, category: 'routine_step' },
  { name: 'Soin yeux', slug: TAG_SLUGS.SOIN_YEUX, category: 'routine_step' },
  { name: 'Soin localisé', slug: TAG_SLUGS.SOIN_LOCALISE, category: 'routine_step' },
  { name: 'Exfoliation', slug: TAG_SLUGS.EXFOLIATION, category: 'routine_step' },
  { name: 'Masque hebdo', slug: TAG_SLUGS.MASQUE_HEBDO, category: 'routine_step' },
  { name: 'Nettoyant', slug: TAG_SLUGS.NETTOYANT, category: 'routine_step' },

  // ── Skin zones ─────────────────────────────────────────────────────
  { name: 'Visage', slug: TAG_SLUGS.ZONE_VISAGE, category: 'skin_zone' },
  { name: 'Corps', slug: TAG_SLUGS.ZONE_CORPS, category: 'skin_zone' },
  { name: 'Yeux', slug: TAG_SLUGS.ZONE_YEUX, category: 'skin_zone' },
  { name: 'Lèvres', slug: TAG_SLUGS.ZONE_LEVRES, category: 'skin_zone' },
  { name: 'Mains', slug: TAG_SLUGS.ZONE_MAINS, category: 'skin_zone' },

  // ── Attributes – Propriétés fonctionnelles ──────────────────────────
  { name: 'Anti-oxydant', slug: TAG_SLUGS.ANTI_OXYDANT, category: 'attribute' },
  { name: 'Humectant', slug: TAG_SLUGS.HUMECTANT, category: 'attribute' },
  { name: 'Émollient', slug: TAG_SLUGS.EMOLLIENT, category: 'attribute' },
  { name: 'Réparateur', slug: TAG_SLUGS.REPARATEUR, category: 'attribute' },
  { name: 'Antiseptique', slug: TAG_SLUGS.ANTISEPTIQUE, category: 'attribute' },
  { name: 'Kératolytique', slug: TAG_SLUGS.KERATOLYTIQUE, category: 'attribute' },
  { name: 'Sébo-régulateur', slug: TAG_SLUGS.SEBO_REGULATEUR, category: 'attribute' },
  { name: 'Matifiant', slug: TAG_SLUGS.MATIFIANT, category: 'attribute' },
  { name: 'Astringent', slug: TAG_SLUGS.ASTRINGENT, category: 'attribute' },
  { name: 'Texture riche', slug: TAG_SLUGS.TEXTURE_RICHE, category: 'attribute' },
  { name: 'Texture légère', slug: TAG_SLUGS.TEXTURE_LEGERE, category: 'attribute' },
  { name: 'Protection cutanée', slug: TAG_SLUGS.PROTECTION_CUTANEE, category: 'attribute' },
  { name: 'Anti-bactérien', slug: TAG_SLUGS.ANTI_BACTERIEN, category: 'attribute' },
  { name: 'Biomimétique', slug: TAG_SLUGS.BIOMIMETIQUE, category: 'attribute' },
  { name: 'Apaisant', slug: TAG_SLUGS.APAISANT, category: 'attribute' },
  { name: 'Prébiotique', slug: TAG_SLUGS.PREBIOTIQUE, category: 'attribute' },

  // ── Attributes – Labels & certifications ────────────────────────────
  { name: 'Sans parfum', slug: TAG_SLUGS.SANS_PARFUM, category: 'attribute' },
  { name: 'Bio / Naturel', slug: TAG_SLUGS.BIO_NATUREL, category: 'attribute' },
  { name: 'Vegan', slug: TAG_SLUGS.VEGAN, category: 'attribute' },
  { name: 'Cruelty-free', slug: TAG_SLUGS.CRUELTY_FREE, category: 'attribute' },
  { name: 'Hypoallergénique', slug: TAG_SLUGS.HYPOALLERGENIQUE, category: 'attribute' },
  { name: 'Non comédogène', slug: TAG_SLUGS.NON_COMEDOGENE, category: 'attribute' },
  { name: 'Comédogène', slug: TAG_SLUGS.COMEDOGENE, category: 'attribute' },
  { name: 'Pigments verts', slug: TAG_SLUGS.PIGMENTS_VERTS, category: 'attribute' },
  { name: 'Sans savon', slug: TAG_SLUGS.SANS_SAVON, category: 'attribute' },
  { name: 'Filtres chimiques', slug: TAG_SLUGS.FILTRES_CHIMIQUES, category: 'attribute' },
  { name: 'Filtres minéraux', slug: TAG_SLUGS.FILTRES_MINERAUX, category: 'attribute' },
  { name: 'Grossesse compatible', slug: TAG_SLUGS.GROSSESSE_COMPATIBLE, category: 'attribute' },
  { name: 'Barrière altérée', slug: TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE, category: 'attribute' },
]
