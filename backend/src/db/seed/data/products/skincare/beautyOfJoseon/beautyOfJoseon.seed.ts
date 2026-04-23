import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const BEAUTY_OF_JOSEON_SEED: UnifiedProductSeed[] = [
  {
    slug: 'beauty-of-joseon-dynasty-cream',
    name: 'Dynasty Cream',
    brand: 'Beauty of Joseon',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 50,
    amountUnit: 'g',
    priceCents: 1920,
    description:
      'Crème hydratante légère inspirée de la dynastie Joseon, pour peau glowy et équilibrée.',
    notes:
      'Occlusion 6/10. Texture crème légère. Eau de riz + ginseng + squalane + niacinamide + céramides + HA.',
    inci: 'WATER, ORYZA SATIVA (RICE) BRAN WATER, GLYCERIN, PANAX GINSENG ROOT WATER, HYDROGENATED POLYDECENE, 1,2-HEXANEDIOL, NIACINAMIDE, SQUALANE, BUTYLENE GLYCOL, PROPANEDIOL, DICAPRYLATE/DICAPRATE, CETEARYL OLIVATE, SORBITAN OLIVATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, XANTHAN GUM, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, TROMETHAMINE, CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL, HYDROGENATED COCONUT OIL, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, ETHYLHEXYLGLYCERIN, ADENOSINE, CAPRYLIC/CAPRIC TRIGLYCERIDE, DISODIUM EDTA, HYALURONIC ACID, HYDROLYZED HYALURONIC ACID, SODIUM HYALURONATE, HONEY EXTRACT, CERAMIDE NP, HYDROGENATED LECITHIN, COPTIS JAPONICA ROOT EXTRACT, RAPHANUS SATIVUS (RADISH) SEED EXTRACT, LYCIUM CHINENSE FRUIT EXTRACT, THEOBROMA CACAO (COCOA) SEED EXTRACT, PHELLINUS LINTEUS EXTRACT, DEXTRIN, SCUTELLARIA BAICALENSIS ROOT EXTRACT',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-dynasty-cream-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/E4E9C0E746B1EB/large_1693784340.jpeg?1693784340',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPULPANT],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.OCCLUSIF,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.OCCLUSION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Eau de riz (bran water) + extraits – hydratation glowy, signature BoJ',
      },
      {
        slug: INGREDIENT_SLUGS.PANAX_GINSENG,
        notes: 'Eau de racine de ginseng – revitalisant, anti-âge',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Niacinamide – barrière, éclat, sébum',
      },
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Squalane – hydratation légère, non gras',
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide NP – renforce barrière',
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'HA multi-moléculaire – hydratation profonde',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-ginseng-essence-water',
    name: 'Ginseng Essence Water',
    brand: 'Beauty of Joseon',
    kind: 'essence',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1620,
    description: `Essence hydratante et revitalisante à base d'eau de racine de ginseng. Apporte éclat, hydratation profonde et renforce la barrière cutanée.`,
    notes:
      'Texture aqueuse légère, multi-couches possible. Riche en ginseng (racine, callus, ferment, extraits), niacinamide et panthénol. Idéal pour tous types de peau.',
    inci: 'PANAX GINSENG ROOT WATER, BUTYLENE GLYCOL, GLYCERIN, PROPANEDIOL, NIACINAMIDE, 1,2-HEXANEDIOL, WATER, HYDROXYACETOPHENONE, GLYCERYL GLUCOSIDE, XANTHAN GUM, PANTHENOL, DIPOTASSIUM GLYCYRRHIZATE, ALLANTOIN, ADENOSINE, PANAX GINSENG CALLUS CULTURE EXTRACT, THEOBROMA CACAO (COCOA) EXTRACT, DEXTRIN, GLUCOSE, PANAX GINSENG ROOT EXTRACT, PANAX GINSENG BERRY EXTRACT, LACTOBACILLUS/PANAX GINSENG ROOT FERMENT FILTRATE, SODIUM HYALURONATE, ETHYLHEXYLGLYCERIN, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-ginseng-essence-water-5-fl-oz-150-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/A76DA6BA8C7322/large_1701889840.jpeg?1701889840',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.ESSENCE,
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.PANAX_GINSENG,
        notes:
          'Eau de racine de ginseng + callus culture + ferment + extraits – revitalisant, éclat, barrière',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Niacinamide – éclat, barrière',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Panthénol – apaisant, hydratant',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.ALLANTOIN,
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-glow-replenishing-rice-milk',
    name: 'Glow Replenishing Rice Milk',
    brand: 'Beauty of Joseon',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1620,
    description:
      'Lotion lait de riz hydratante + acides aminés riz. Combat sécheresse, repulpe, absorbe sébum, purifie pores.',
    notes:
      'Texture bi-couche (hydratante + poudre sébum). Légère rafraîchissante, tous types (idéal sensible/rougeurs).',
    inci: 'WATER, METHYLPROPANEDIOL, PROPANEDIOL, 1,2-HEXANEDIOL, GLYCERIN, GLYCERETH-26, POLYMETHYL METHACRYLATE, ORYZA SATIVA (RICE) EXTRACT, COPTIS JAPONICA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, AMARANTHUS CAUDATUS SEED EXTRACT, FICUS CARICA (FIG) FRUIT EXTRACT, CENTELLA ASIATICA EXTRACT, THEOBROMA CACAO (COCOA) SEED EXTRACT, HYDROGENATED LECITHIN, SODIUM HYALURONATE, PANTHENOL, HYDROXYETHYL urea, ALUMINUM CHLOROHYDRATE, BUTYLENE GLYCOL, MICROCRYSTALLINE CELLULOSE, SODIUM CITRATE, KAOLIN, ETHYLHEXYLGLYCERIN, DIPOTASSIUM GLYCYRRHIZATE, CITRIC ACID, DEXTRIN, CERAMIDE NP, TOCOPHEROL, RICE AMINO ACIDS',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-glow-replenishing-rice-milk-5-07-fl-oz-150-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/62BF0968EC8CBB/large_1725261590.png?1725261590',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE, TAG_SLUGS.MATIFIANT],
      secondary: [
        TAG_SLUGS.LOTION,
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_RUGUEUSE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Extrait de riz + eau de riz – hydratation glowy, équilibre sébum',
      },
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Centella – apaisant',
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide NP – barrière',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.RICE_AMINO_ACIDS,
        notes: 'Acides aminés riz – hydratation, glow',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-relief-sun-aqua-fresh',
    name: 'Relief Sun Aqua-fresh',
    brand: 'Beauty of Joseon',
    kind: 'sunscreen',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2400,
    description:
      'Crème solaire hydratante SPF50+ PA++++ à la texture fluide et légère. Version plus hydratante du best-seller Relief Sun, avec eau de riz et panthénol (B5) pour apaiser, hydrater et protéger sans trace blanche ni effet collant.',
    notes:
      'Convient à tous les types de peau, idéal peaux mixtes/grasses. Fini frais et non gras, sans parfum ajouté. Absorbe rapidement, bonne base maquillage.',
    inci: 'WATER, ORYZA SATIVA (RICE) SEED WATER, DIBUTYL ADIPATE, BUTYLOCTYL SALICYLATE, ETHYLHEXYL TRIAZONE, DROMETRIZOLE TRISILOXANE, POLYGLYCERYL-3 DISTEARATE, TEREPHTHALYLIDENE DICAMPHOR SULFONIC ACID, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, POLYMETHYLSILSESQUIOXANE, TROMETHAMINE, 1,2-HEXANEDIOL, PANTHENOL, PENTYLENE GLYCOL, GLYCERYL STEARATE, SILICA, CAPRYLYL METHICONE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, PROPANEDIOL, POTASSIUM CETYL PHOSPHATE, POLY C10-30 ALKYL ACRYLATE, METHYLPROPANEDIOL, CARBOMER, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ETHYLHEXYLGLYCERIN, XANTHAN GUM, GLYCERIN, POLYETHER-1, AVENA SATIVA (OAT) KERNEL EXTRACT, CYNARA SCOLYMUS (ARTICHOKE) LEAF EXTRACT, POLYQUATERNIUM-51, CAMELLIA SINENSIS LEAF WATER, HYDROGENATED LECITHIN, BETA-GLUCAN, BIOSACCHARIDE GUM-1, INOSITOL, TOCOPHEROL, FERULIC ACID, ORYZA SATIVA (RICE) BRAN OIL, CITRIC ACID, CERAMIDE NP, PHYTOSPHINGOSINE, SODIUM HYALURONATE, RICE AMINO ACIDS, RICE SH-OLIGOPEPTIDE-1',
    url: 'https://beautyofjoseon.com',
    tags: {
      primary: [TAG_SLUGS.CREME_SOLAIRE, TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.FILTRES_CHIMIQUES,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Eau de riz + huile de riz – hydratation glowy',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Panthénol – apaisant post-UV',
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide NP – barrière',
      },
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.AVENA_SATIVA,
        notes: 'Extrait avoine – calmant',
      },
      {
        slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E – antioxydant',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-centella-calming-mask',
    name: 'Centella Asiatica Calming Mask',
    brand: 'Beauty of Joseon',
    kind: 'mask',
    unit: 'pack',
    totalAmount: 25,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Masque tissu apaisant à la centella asiatica et au ginseng. Rafraîchit, calme rougeurs et irritations.',
    notes:
      'Pack de 10 masques de 25 mL chacun. Centella + ginseng + niacinamide + HA. Idéal peaux réactives ou après exposition solaire.',
    inci: '1,2-HEXANEDIOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ADENOSINE, ANTHEMIS NOBILIS FLOWER OIL, ARGININE, ARTEMISIA PRINCEPS LEAF EXTRACT, BUTYLENE GLYCOL, CAMELLIA SINENSIS LEAF EXTRACT, CARRAGEENAN, CENTELLA ASIATICA EXTRACT, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERETH-26, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, HYALURONIC ACID, HYDROLYZED HYALURONIC ACID, HYDROXYACETOPHENONE, HYDROXYETHYLCELLULOSE, LYCIUM CHINENSE FRUIT EXTRACT, NIACINAMIDE, PANAX GINSENG ROOT EXTRACT, PANTHENOL, POLYGLYCERYL-4 CAPRATE, POLYGLYCERYL-6 CAPRYLATE, PORTULACA OLERACEA EXTRACT, PROPANEDIOL, SODIUM HYALURONATE, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-centella-asiatica-calming-mask-0-84-fl-oz-25-ml-pack-of-10',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/53C18D8E9563A5/large_1716957831.png?1716957831',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.MASQUE_TISSU,
        TAG_SLUGS.APAISANT,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Actif principal – apaisant, anti-inflammatoire',
      },
      {
        slug: INGREDIENT_SLUGS.PANAX_GINSENG,
        notes: 'Extrait ginseng – revitalisant',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.PORTULACA_OLERACEA,
        notes: 'Anti-inflammatoire complémentaire',
      },
      {
        slug: INGREDIENT_SLUGS.GREEN_TEA,
        notes: 'Antioxydant – Camellia sinensis leaf extract',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-refreshing-pore-mask-red-bean',
    name: 'Refreshing Pore Mask Red Bean',
    brand: 'Beauty of Joseon',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 140,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Masque argileux (kaolin + hectorite) au haricot rouge. Purifie les pores, rafraîchit et matifie sans dessécher.',
    notes:
      'Masque wash-off. Pas de parfum. Haricot rouge (Phaseolus Angularis) astringent + kaolin absorbant. Convient peaux grasses et mixtes.',
    inci: '1,2-HEXANEDIOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL/CAPRYL GLUCOSIDE, CETEARYL OLIVATE, CETYL ALCOHOL, CI 77491, ETHYLHEXYLGLYCERIN, FRAGARIA CHILOENSIS (STRAWBERRY) FRUIT EXTRACT, GLYCERIN, GLYCERYL STEARATE SE, HECTORITE, HEDERA HELIX (IVY) LEAF/STEM EXTRACT, KAOLIN, PHASEOLUS ANGULARIS SEED EXTRACT, PHASEOLUS ANGULARIS SEED POWDER, POLYISOBUTENE, PYRUS COMMUNIS (PEAR) FRUIT EXTRACT, PYRUS MALUS (APPLE) LEAF EXTRACT, SODIUM ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, SORBITAN OLEATE, SORBITAN OLIVATE, TRIETHOXYCAPRYLYLSILANE, ULTRAMARINES, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-refreshing-pore-mask-red-bean-4-73-fl-oz-140-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/A4E2C21650C25C/large_1705453784.jpeg?1705453784',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
      secondary: [
        TAG_SLUGS.MASQUE_ARGILE,
        TAG_SLUGS.PURIFIANT,
        TAG_SLUGS.MATIFIANT,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_SENSIBLE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.KAOLIN,
        notes: 'Kaolin – argile absorbante, purifie pores',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-calming-serum-green-tea-panthenol',
    name: 'Calming Serum Green Tea + Panthenol',
    brand: 'Beauty of Joseon',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Sérum apaisant à l'eau de thé vert (Camellia sinensis) et au panthénol. Calme les rougeurs et renforce la barrière.`,
    notes:
      'Convient aux peaux sensibles, réactives et à tendance couperosique. Artemisia + dipotassium glycyrrhizate en soutien. Texture légère et pénétrante.',
    inci: '1,2-HEXANEDIOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ALLANTOIN, ARTEMISIA CAPILLARIS EXTRACT, BETAINE, BUTYLENE GLYCOL, CAMELLIA SINENSIS LEAF WATER, CLITORIA TERNATEA FLOWER EXTRACT, COPTIS JAPONICA ROOT EXTRACT, DIPOTASSIUM GLYCYRRHIZATE, ETHYLHEXYLGLYCERIN, GARCINIA MANGOSTANA PEEL EXTRACT, GLYCERIN, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, MALT EXTRACT, METHYL PROPANEDIOL, PANTHENOL, POLYQUATERNIUM-51, PUNICA GRANATUM EXTRACT, SODIUM HYALURONATE, TROMETHAMINE, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-calming-serum-green-tea-panthenol-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/664BCF46300719/large_1701396906.jpeg?1701396906',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.APAISANT,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.ROSACEE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.GREEN_TEA,
        notes: 'Eau de thé vert (Camellia sinensis) – antioxydant, apaisant',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Panthénol – renforce barrière, hydratant',
      },
      {
        slug: INGREDIENT_SLUGS.DIPOTASSIUM_GLYCYRRHIZATE,
        notes: 'Réglisse – anti-inflammatoire puissant',
      },
      {
        slug: INGREDIENT_SLUGS.ALLANTOIN,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-apricot-blossom-peeling-gel',
    name: 'Apricot Blossom Peeling Gel',
    brand: 'Beauty of Joseon',
    kind: 'exfoliant',
    unit: 'tube',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Gel exfoliant doux par friction (cellulose). Affine le grain de peau, illumine le teint et nettoie en douceur.',
    notes:
      'Exfoliation mécanique légère par « boulochage » de la cellulose. Thé vert + extrait de riz. À utiliser 1-2 fois par semaine sur peau sèche ou légèrement humide.',
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ARGININE, BUTYLENE GLYCOL, CAMELLIA SINENSIS LEAF EXTRACT, CARBOMER, CELLULOSE, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, HOUTTUYNIA CORDATA EXTRACT, METHYLPROPANEDIOL, NELUMBO NUCIFERA FLOWER EXTRACT, ORYZA SATIVA (RICE) EXTRACT, PRUNUS MUME FRUIT EXTRACT, PYRUS MALUS (APPLE) FRUIT EXTRACT, SORBITOL, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT EXTRACT, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-apricot-blossom-peeling-gel-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/EEBF4D32A6BDAF/large_1696653053.jpeg?1696653053',
    tags: {
      primary: [TAG_SLUGS.GRAIN_PEAU, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.EXFOLIANT_PHYSIQUE,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.PEAU_REACTIVE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Extrait riz – illuminant',
      },
      {
        slug: INGREDIENT_SLUGS.GREEN_TEA,
        notes: 'Antioxydant – Camellia sinensis leaf extract',
      },
      {
        slug: INGREDIENT_SLUGS.ALLANTOIN,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-red-bean-water-gel',
    name: 'Red Bean Water Gel',
    brand: 'Beauty of Joseon',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Gel hydratant léger au haricot rouge, acides aminés et peptides. Texture aqueuse non grasse, idéal pour peaux mixtes à grasses.',
    notes:
      'Acetyl Hexapeptide-8 (Argireline) + SH-Oligopeptides anti-âge. Magnesium Ascorbyl Phosphate (vit C stable). Riche en acides aminés et beta-glucan.',
    inci: '1,2-HEXANEDIOL, ACETYL HEXAPEPTIDE-8, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ALANINE, ALLANTOIN, AMMONIUM ACRYLOYLDIMETHYL TAURATE/VP COPOLYMER, ARGININE, ASPARTIC ACID, BETA-GLUCAN, BETAINE, BUTYLENE GLYCOL, C12-14 PARETH-12, CAPRYLYL GLYCOL, CITRIC ACID, CYANOCOBALAMIN, CYSTEINE, DIMETHICONE CROSSPOLYMER, DIMETHICONE/VINYL DIMETHICONE CROSSPOLYMER, DIOSCOREA JAPONICA ROOT EXTRACT, DIPOTASSIUM GLYCYRRHIZATE, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLUCOSE, GLUTAMIC ACID, GLYCERIN, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, GLYCERYL GLUCOSIDE, GLYCINE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, HISTIDINE, HYDROLYZED CORN STARCH, ISOLEUCINE, LEUCINE, LYSINE, MAGNESIUM ASCORBYL PHOSPHATE, MALTODEXTRIN, METHIONINE, METHYL TRIMETHICONE, PANTHENOL, PHASEOLUS ANGULARIS SEED EXTRACT, PHENYLALANINE, POLYQUATERNIUM-51, PROLINE, SERINE, SH-OLIGOPEPTIDE-1, SH-OLIGOPEPTIDE-2, SH-POLYPEPTIDE-1, SODIUM CITRATE, SUCROSE, THREONINE, TROMETHAMINE, TYROSINE, VALINE, VITAMIN E (A-TOCOPHEROL), WATER, XANTHAN GUM',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-red-bean-water-gel-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/54B6E4C1931F44/large_1693645970.jpeg?1693645970',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ANTI_AGE],
      secondary: [
        TAG_SLUGS.GEL_CREME,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.BETA_GLUCAN,
        notes: 'Immunomodulateur et apaisant',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
      },
      {
        slug: INGREDIENT_SLUGS.DIPOTASSIUM_GLYCYRRHIZATE,
        notes: 'Anti-inflammatoire',
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-light-on-serum-centella-vita-c',
    name: 'Light On Serum Centella + Vita C',
    brand: 'Beauty of Joseon',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum éclat à la vitamine C stable (3-O-Ethyl Ascorbic Acid) et centella asiatica. Antioxydant, illuminant, anti-taches légères.',
    notes:
      'Vitamine C stable et pénétrante (3-O-EAA) + bisabolol + beta-glucan. Texture légère. Compatible peau sensible si tolérance vit C OK.',
    inci: '1,2-HEXANEDIOL, 3-O-ETHYL ASCORBIC ACID, ADENOSINE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/BEHENETH-25 METHACRYLATE CROSSPOLYMER, ARGININE, ASCORBIC ACID POLYPEPTIDE, BETA-GLUCAN, BETAINE, BISABOLOL, BRASSICA OLERACEA ACEPHALA LEAF EXTRACT, BUTYLENE GLYCOL, CARBOMER, CENTELLA ASIATICA EXTRACT, CETEARYL ALCOHOL, CETEARYL OLIVATE, CETYL ETHYLHEXANOATE, CITRUS UNSHIU PEEL EXTRACT, DICAPRYLYL CARBONATE, DIMETHICONE/VINYL DIMETHICONE CROSSPOLYMER, ECLIPTA PROSTRATA LEAF EXTRACT, ETHYLHEXYLGLYCERIN, FRUCTOOLIGOSACCHARIDES, GLYCERIN, HYDROGENATED LECITHIN, HYDROLYZED HYALURONIC ACID, HYDROLYZED JOJOBA ESTERS, HYDROXYACETOPHENONE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, LAMINARIA JAPONICA EXTRACT, MALTODEXTRIN, METHYL TRIMETHICONE, PANTHENOL, PHELLODENDRON AMURENSE BARK EXTRACT, POLYGLYCERYL-10 MYRISTATE, POTASSIUM CETYL PHOSPHATE, PROPANEDIOL, SILICA, SORBITAN ISOSTEARATE, SORBITAN OLIVATE, WATER, XANTHAN GUM',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-light-on-serum-centella-vita-c-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/82092E4D1E7F0A/large_1696653082.jpeg?1696653082',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.ANTI_OXYDANT,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
        notes: 'Vitamine C stable et pénétrante – éclat, anti-taches',
      },
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Apaisant, anti-inflammatoire',
      },
      {
        slug: INGREDIENT_SLUGS.BISABOLOL,
        notes: 'Apaisant complémentaire',
      },
      {
        slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
      },
      {
        slug: INGREDIENT_SLUGS.FRUCTOOLIGOSACCHARIDES,
        notes: 'Prébiotique – microbiome',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-revive-serum-ginseng-snail-mucin',
    name: 'Revive Serum Ginseng + Snail Mucin',
    brand: 'Beauty of Joseon',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Sérum régénérant et hydratant au ginseng et mucine d'escargot. Anti-âge, réparateur, boost d'éclat.`,
    notes:
      'Snail Secretion Filtrate + ginseng eau + extrait + HA triple moléculaire. Niacinamide sébo-régulateur. Tous types de peau, matin et soir.',
    inci: '1,2-HEXANEDIOL, ADENOSINE, BUTYLENE GLYCOL, CARBOMER, CENTELLA ASIATICA EXTRACT, DIPROPYLENE GLYCOL, DISODIUM EDTA, FORSYTHIA SUSPENSA FRUIT EXTRACT, GANODERMA LUCIDUM (MUSHROOM) EXTRACT, GLYCERIN, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, HYDROLYZED HYALURONIC ACID, LONICERA JAPONICA (HONEYSUCKLE) FLOWER EXTRACT, MALT EXTRACT, NIACINAMIDE, PANAX GINSENG ROOT EXTRACT, PANAX GINSENG ROOT WATER, PHELLINUS LINTEUS EXTRACT, PROPANEDIOL, SCUTELLARIA BAICALENSIS ROOT EXTRACT, SNAIL SECRETION FILTRATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE, SODIUM POLYACRYLATE, TREHALOSE, TROMETHAMINE, WATER, XANTHAN GUM',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-revive-serum-ginseng-snail-mucin-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/9ACFD0482ADDDC/large_1693869762.jpeg?1693869762',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.MICROBIOME,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.SNAIL_MUCIN,
        notes: `Mucine d'escargot – régénérant, hydratant`,
      },
      {
        slug: INGREDIENT_SLUGS.PANAX_GINSENG,
        notes: 'Eau + extrait ginseng – anti-âge, éclat',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
      },
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-green-plum-refreshing-cleanser',
    name: 'Green Plum Refreshing Cleanser',
    brand: 'Beauty of Joseon',
    kind: 'cleanser',
    unit: 'pump',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Nettoyant gel doux à la prune verte et thé vert. Élimine impuretés sans altérer le pH cutané.',
    notes:
      'Tensioactifs doux (Sodium Cocoyl Isethionate + Sodium Isethionate). Extraits botaniques coréens (artemisia, prune, bleuet). Sans sulfates agressifs.',
    inci: '1,2-HEXANEDIOL, BUTYLENE GLYCOL, CAMELLIA SINENSIS LEAF EXTRACT, CAPRYLYL GLYCOL, CITRIC ACID, CLITORIA TERNATEA FLOWER EXTRACT, COCAMIDOPROPYL HYDROXYSULTAINE, COCONUT ACID, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GARCINIA MANGOSTANA PEEL EXTRACT, GLYCERIN, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, HOUTTUYNIA CORDATA EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, ORYZA SATIVA (RICE) EXTRACT, PHASEOLUS RADIATUS SEED EXTRACT, PROPYLENE GLYCOL LAURATE, PRUNUS MUME FRUIT WATER, PUNICA GRANATUM EXTRACT, SODIUM CHLORIDE, SODIUM CITRATE, SODIUM COCOYL ISETHIONATE, SODIUM ISETHIONATE, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT EXTRACT, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-green-plum-refreshing-cleanser-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/923AB76B5A5042/large_1693645920.jpeg?1693645920',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.GEL_NETTOYANT,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Extrait riz – apaisant, hydratant résiduel',
      },
      {
        slug: INGREDIENT_SLUGS.GREEN_TEA,
        notes: 'Camellia sinensis – antioxydant',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-green-plum-refreshing-toner-aha-bha',
    name: 'Green Plum Refreshing Toner AHA + BHA',
    brand: 'Beauty of Joseon',
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Toner exfoliant chimique doux à l'acide glycolique (AHA) et salicylique (BHA). Affine la texture, resserre les pores et uniformise le teint.`,
    notes:
      'Concentrations douces, à utiliser le soir. Éviter si peau très sensible ou traitements dermato en cours. Portulaca + riz en apaisant.',
    inci: '1,2-HEXANEDIOL, BUTYLENE GLYCOL, C12-14 PARETH-12, DIPHENYL DIMETHICONE, DIPROPYLENE GLYCOL, ETHYLHEXYLGLYCERIN, FRUCTOSE, GLUCOSE, GLYCERIN, GLYCOLIC ACID, HYDROGENATED LECITHIN, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, ORYZA SATIVA (RICE) BRAN WATER, PANAX GINSENG ROOT EXTRACT, PHASEOLUS RADIATUS SEED EXTRACT, POLYGLYCERYL-10 OLEATE, PORTULACA OLERACEA EXTRACT, PRUNUS MUME FRUIT WATER, SALICYLIC ACID, SODIUM PCA, TETRASODIUM EDTA, TOCOPHEROL, TRIETHYLHEXANOIN, TROMETHAMINE, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-green-plum-refreshing-toner-aha-bha-5-07-fl-oz-150-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/0052789FE17A1E/large_1689931474.png?1689931474',
    tags: {
      primary: [TAG_SLUGS.GRAIN_PEAU, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.KERATOLYTIQUE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.PEAU_REACTIVE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
        notes: 'AHA – exfoliant chimique, illuminant',
      },
      {
        slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
        notes: 'BHA – exfoliant liposoluble, purifie pores',
      },
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Eau de riz – apaisant',
      },
      {
        slug: INGREDIENT_SLUGS.PORTULACA_OLERACEA,
        notes: 'Anti-inflammatoire',
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-glow-deep-serum',
    name: 'Glow Deep Serum',
    brand: 'Beauty of Joseon',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Sérum éclat à l'alpha-arbutin et niacinamide. Uniformise le teint, estompe taches et illumine.`,
    notes:
      'Alpha-arbutin dépigmentant + niacinamide polyvalent + extrait de riz. Texture sérum légère, hydratant par le panthénol et HA.',
    inci: '1,2-HEXANEDIOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ALPHA-ARBUTIN, ARGININE, BUTYLENE GLYCOL, COIX LACRYMA-JOBI MA-YUEN SEED EXTRACT, COPTIS JAPONICA ROOT EXTRACT, DIPROPYLENE GLYCOL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLUCOSE, GLYCERIN, GLYCERYL GLUCOSIDE, GLYCINE SOJA (SOYBEAN) SEED EXTRACT, HORDEUM DISTICHON (BARLEY) EXTRACT, HYDROLYZED JOJOBA ESTERS, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, HYDROXYETHYLCELLULOSE, METHYL GLUCETH-20, NIACINAMIDE, ORYZA SATIVA (RICE) BRAN WATER, ORYZA SATIVA (RICE) EXTRACT, PANTHENOL, POLYGLYCERIN-3, SESAMUM INDICUM (SESAME) SEED EXTRACT, SORBITAN ISOSTEARATE, TREHALOSE, TRITICUM VULGARE (WHEAT) SEED EXTRACT, VIGNA RADIATA SEED EXTRACT, WATER, XANTHAN GUM, ZEA MAYS (CORN) KERNEL EXTRACT',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-glow-deep-serum-line-glow-deep-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/1B64D819A282AD/large_1686610853.jpeg?1686610853',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN,
        notes: 'Anti-taches, dépigmentant',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Unifiant, éclat, barrière',
      },
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Eau + extrait riz – hydratant, illuminant',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-revive-eye-serum-ginseng-retinal',
    name: 'Revive Eye Serum Ginseng + Retinal',
    brand: 'Beauty of Joseon',
    kind: 'eye-cream',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum contour des yeux au rétinal et ginseng. Lisse les ridules, atténue cernes et poches, renforce la barrière lipidique.',
    notes:
      'Retinal (rétinaldéhyde) plus actif que le rétinol, moins irritant que la trétinoïne. Palmitoyltripeptide-5 tenseur. Céramides + cholestérol lipid complex. À utiliser le soir uniquement.',
    inci: '1,2-HEXANEDIOL, ADENOSINE, ALUMINUM/MAGNESIUM HYDROXIDE STEARATE, BRASSICA CAMPESTRIS (RAPESEED) STEROLS, BUTYLENE GLYCOL, BUTYLENE GLYCOL DICAPRYLATE/DICAPRATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, CARBOMER, CERAMIDE NP, CETEARYL ALCOHOL, CETEARYL OLIVATE, CHOLESTEROL, DEXTRIN, DIPROPYLENE GLYCOL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL STEARATE, HYDROGENATED LECITHIN, MACADAMIA TERNIFOLIA SEED OIL, NIACINAMIDE, PALMITOYLTRIPEPTIDE-5, PANAX GINSENG ROOT EXTRACT, PENTAERYTHRITYL TETRA-DI-T-BUTYL HYDROXYHYDROCINNAMATE, PENTAERYTHRITYL TETRAETHYLHEXANOATE, PHYTOSTERYL/BEHENYL/OCTYLDODECYL LAUROYL GLUTAMATE, POLYGLYCERYL-10 OLEATE, POTASSIUM CETYL PHOSPHATE, RETINAL, SILICA, SODIUM HYALURONATE, SORBITAN OLIVATE, THEOBROMA CACAO (COCOA) EXTRACT, TOCOPHEROL, TROMETHAMINE, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-revive-eye-serum-ginseng-retinal-1fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/39A5DD4B8F7260/large_1684921218.jpeg?1684921218',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.CERNES_POCHES],
      secondary: [
        TAG_SLUGS.CONTOUR_YEUX,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_YEUX,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.GROSSESSE_COMPATIBLE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.RETINAL,
        notes: 'Rétinaldéhyde – anti-rides puissant, à utiliser le soir',
      },
      {
        slug: INGREDIENT_SLUGS.PANAX_GINSENG,
        notes: 'Extrait ginseng – anti-âge',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide – renforce barrière zone yeux',
      },
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Lipide biomimétique',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-glow-mask-rice-honey',
    name: 'Glow Mask Ground Rice + Honey',
    brand: 'Beauty of Joseon',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Masque rinçable au riz broyé et miel. Exfolie en douceur, nourrit et illumine le teint pour un effet glow immédiat.',
    notes:
      'Exfoliation physique légère (poudre de riz hull). Miel + extrait de riz + kaolin. Laisser poser 10-15 min. Compatible tous types de peau sauf peau très réactive.',
    inci: '1,2-HEXANEDIOL, BEHENYL ALCOHOL, BENTONITE, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CELLULOSE, CETYL ALCOHOL, DIPROPYLENE GLYCOL, ETHYLHEXYL PALMITATE, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL STEARATE, HONEY, HONEY EXTRACT, HYDROGENATED POLYISOBUTENE, HYDROXYACETOPHENONE, ISONONYL ISONONANOATE, KAOLIN, MENTHYL LACTATE, ORYZA SATIVA (RICE) BRAN, ORYZA SATIVA (RICE) EXTRACT, ORYZA SATIVA (RICE) HULL POWDER, ORYZA SATIVA (RICE) LEES EXTRACT, PALMITIC ACID, POLYACRYLATE-13, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, POTASSIUM CETYL PHOSPHATE, PROPANEDIOL, SODIUM PHYTATE, SORBITAN ISOSTEARATE, STEARIC ACID, WATER, XANTHAN GUM, ZEA MAYS (CORN) STARCH',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-glow-mask-ground-rice-and-honey-5-07-fl-oz-150-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/3B9C653740E065/large_1744722935.jpeg?1744722935',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.GRAIN_PEAU],
      secondary: [
        TAG_SLUGS.MASQUE_HYDRATANT,
        TAG_SLUGS.EXFOLIANT_PHYSIQUE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Riz broyé (hull powder) + extrait + son + lees – exfoliant + illuminant',
      },
      {
        slug: INGREDIENT_SLUGS.KAOLIN,
        notes: 'Argile absorbante',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-daily-tinted-fluid-sunscreen',
    name: 'Daily Tinted Fluid Sunscreen',
    brand: 'Beauty of Joseon',
    kind: 'sunscreen',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Fluide solaire teinté à l'oxyde de zinc. Couvrance naturelle légère, longue tenue, fini mat-satiné.`,
    notes:
      'Filtre minéral (zinc oxide) + filtres chimiques (Butyloctyl Salicylate). Formule anhydre légère. Pas de parfum. Convient peaux claires à moyennes (teinte MP200).',
    inci: '1,2-HEXANEDIOL, ALCOHOL DENAT, AQUA, ARTEMISIA CAPILLARIS EXTRACT, ASCORBYL PALMITATE, BUTYLENE GLYCOL, BUTYLOCTYL SALICYLATE, C12-15 ALKYL BENZOATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, CI 77491, CI 77499, COCO-CAPRYLATE/CAPRATE, ETHYLHEXYL ISONONANOATE, HYDROGENATED OLIVE OIL UNSAPONIFIABLES, HYDROXYACETOPHENONE, IRON OXIDE CI 77492 (YELLOW), ISOPROPYL MYRISTATE, ISOPROPYL TITANIUM TRIISOSTEARATE, METHYL METHACRYLATE CROSSPOLYMER, NEOPENTYL GLYCOL DIHEPTANOATE, POLYGLYCERIN-6, POLYGLYCERYL-3 POLYRICINOLEATE, POLYGLYCERYL-4 DIISOSTEARATE/POLYHYDROXYSTEARATE/SEBACATE, POLYGLYCERYL-6 POLYHYDROXYSTEARATE, POLYGLYCERYL-6 POLYRICINOLEATE, PROPANEDIOL, SILICA, STEARALKONIUM HECTORITE, STEARIC ACID, TOCOPHEROL, TRIDECANE, UNDECANE, ZINC OXIDE',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-daily-tinted-fluid-sunscreen-mp-200-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/962A5906AB398F/large_1754906981.png?1754906981',
    tags: {
      primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.PHOTO_PROTECTION],
      secondary: [
        TAG_SLUGS.CREME_SOLAIRE_TEINTEE,
        TAG_SLUGS.FILTRES_MINERAUX,
        TAG_SLUGS.FILTRES_CHIMIQUES,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.GROSSESSE_COMPATIBLE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ZINC_OXIDE,
        notes: 'Filtre minéral – protection large spectre',
      },
      {
        slug: INGREDIENT_SLUGS.IRON_OXIDE,
        notes: 'Pigments teintés – couvrance naturelle, filtre lumière visible',
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-ginseng-cleansing-oil',
    name: 'Ginseng Cleansing Oil',
    brand: 'Beauty of Joseon',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 210,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Huile démaquillante au ginseng et huile de camélia. Dissout maquillage waterproof et SPF, laisse la peau douce et nourrie.',
    notes: `Première étape du double nettoyage. Huile de ginseng graine + baies + extrait. Camellia Japonica + huile d'olive + noisette. Se rince sans résidu gras.`,
    inci: '1,2-HEXANEDIOL, ARTEMISIA VULGARIS OIL, BUTYLENE GLYCOL, CAMELLIA JAPONICA SEED OIL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CETYL ETHYLHEXANOATE, CORYLUS AVELLANA (HAZELNUT) SEED OIL, ETHYL HEXANEDIOL, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCINE SOJA (SOYBEAN) OIL, HYDROGENATED COCONUT OIL, ISODODECANE, METHYLPROPANEDIOL, NIGELLA SATIVA SEED OIL, OCIMUM BASILICUM (BASIL) OIL, OCTYLDODECANOL, OLEA EUROPAEA (OLIVE) FRUIT OIL, PANAX GINSENG BERRY EXTRACT, PANAX GINSENG ROOT EXTRACT, PANAX GINSENG SEED OIL, POLYBUTENE, SALVIA OFFICINALIS (SAGE) OIL, SORBETH-30 TETRAOLEATE, TOCOPHEROL, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-ginseng-cleansing-oil-7-1-oz-210-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/A112F1D7CC3F65/large_1741427154.png?1741427154',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.HUILE_NETTOYANTE,
        TAG_SLUGS.DOUBLE_NETTOYAGE_1,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.PANAX_GINSENG,
        notes: 'Huile graine + baies + extrait ginseng – anti-âge, nourrissant',
      },
      {
        slug: INGREDIENT_SLUGS.CAMELLIA_JAPONICA_OIL,
        notes: 'Huile camélia – émolliente, anti-âge',
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E – antioxydant',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-low-ph-rice-cleansing-bar',
    name: 'Low pH Rice Face & Body Cleansing Bar',
    brand: 'Beauty of Joseon',
    kind: 'cleanser',
    unit: 'bar',
    totalAmount: 100,
    amountUnit: 'g',
    priceCents: 0,
    description:
      'Pain nettoyant low pH au riz et huile de coco. Nettoie en douceur sans perturber le microbiome, convient visage et corps.',
    notes: `Sodium Cocoyl Isethionate comme tensioactif principal (très doux). Decyl Glucoside + huile de riz + huile d'olive. Sans sulfates, sans parfum. Idéal peaux sensibles ou atopiques.`,
    inci: '1,2-HEXANEDIOL, BUTYLENE GLYCOL, CAPRYLYL GLYCOL, CITRIC ACID, COCOS NUCIFERA (COCONUT) OIL, DECYL GLUCOSIDE, GLYCERIN, OLEA EUROPAEA (OLIVE) FRUIT OIL, ORYZA SATIVA (RICE) BRAN EXTRACT, SESAMUM INDICUM (SESAME) SEED POWDER, SODIUM COCOYL ISETHIONATE, WATER, XANTHAN GUM, ZEA MAYS (CORN) STARCH',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-low-ph-rice-face-body-cleansing-bar-3-52-fl-oz-100-g',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/2F5F23A6B8CE46/large_1726419758.jpeg?1726419758',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Extrait riz – illuminant, apaisant',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE,
        notes: 'Tensioactif ultra-doux, low pH',
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-glow-serum-propolis-niacinamide',
    name: 'Glow Serum Propolis + Niacinamide',
    brand: 'Beauty of Joseon',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum éclat à la propolis et niacinamide. Sébo-régulateur, anti-imperfections, unifiant.',
    notes:
      'Propolis antibactérienne + niacinamide + betaine salicylate (exfoliant doux BHA). Tea tree + centella en soutien. Idéal peaux acnéiques et mixtes.',
    inci: '1,2-HEXANEDIOL, BETAINE SALICYLATE, BUTYLENE GLYCOL, CALOPHYLLUM INOPHYLLUM SEED OIL, CAPRYLYL GLYCOL, CARBOMER, CENTELLA ASIATICA EXTRACT, CORALLINA OFFICINALIS EXTRACT, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, DEXTRIN, DIPROPYLENE GLYCOL, ETHYLHEXYLGLYCERIN, GLYCERIN, LOTUS CORNICULATUS SEED EXTRACT, MELALEUCA ALTERNIFOLIA (TEA TREE) EXTRACT, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, NIACINAMIDE, OCIMUM SANCTUM LEAF EXTRACT, OCTANEDIOL, PENTYLENE GLYCOL, POLYGLYCERYL-10 LAURATE, PROPOLIS EXTRACT, SODIUM HYALURONATE, SODIUM POLYACRYLOYLDIMETHYL TAURATE, THEOBROMA CACAO (COCOA) SEED EXTRACT, TOCOPHEROL, TROMETHAMINE, WATER, XANTHAN GUM',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-glow-serum-propolis-niacinamide-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/978FB007B8689F/large_1674270729.jpeg?1674270729',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.SEBO_REGULATEUR,
        TAG_SLUGS.PURIFIANT,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Niacinamide – éclat, sébo-régulateur, anti-imperfections',
      },
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Apaisant, anti-inflammatoire',
      },
      {
        slug: INGREDIENT_SLUGS.TEA_TREE,
        notes: 'Melaleuca alternifolia – antibactérien',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: 'beauty-of-joseon-radiance-cleansing-balm',
    name: 'Radiance Cleansing Balm',
    brand: 'Beauty of Joseon',
    kind: 'cleanser',
    unit: 'jar',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Baume démaquillant au riz et avoine. Fond sur la peau au contact, élimine maquillage et SPF, laisse un sillage doux et nourrissant.',
    notes: `Première étape du double nettoyage. Huile de riz + avoine + ferment soja. Texture baume → lait au contact de l'eau. Aucun résidu gras après rinçage.`,
    inci: '1,2-HEXANEDIOL, AVENA SATIVA (OAT) MEAL EXTRACT, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, CETYL ETHYLHEXANOATE, COIX LACRYMA-JOBI MA-YUEN SEED EXTRACT, ETHYLHEXYLGLYCERIN, GLYCERIN, HIPPOPHAE RHAMNOIDES OIL, LACTOBACILLUS/SOYBEAN FERMENT EXTRACT, ORYZA SATIVA (RICE) BRAN OIL, ORYZA SATIVA (RICE) EXTRACT, POLYGLYCERYL-2 CAPRATE, POLYGLYCERYL-2 SESQUICAPRYLATE, POLYGLYCERYL-6 DICAPRATE, PROPANEDIOL, SORBITAN SESQUIOLEATE, SYNTHETIC WAX, WATER',
    url: 'https://www.skinsafeproducts.com/beauty-of-joseon-radiance-cleansing-balm-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/37DC57BCA3D8AB/large_1637009726.jpeg?1637009726',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.BAUME_DEMAQUILLANT,
        TAG_SLUGS.DOUBLE_NETTOYAGE_1,
        TAG_SLUGS.OCCLUSIF,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
        notes: 'Huile + extrait riz – illuminant, nourrit pendant le nettoyage',
      },
      {
        slug: INGREDIENT_SLUGS.AVENA_SATIVA,
        notes: 'Extrait avoine – apaisant',
      },
    ],
  },
]
