export const AZ_PRODUCT_SLUGS = {
  AZ_SERUM_VITAMINE_C_10_ASTAXANTHINE: 'aroma-zone-serum-vitamine-c-10-astaxanthine',
  AZ_SERUM_BAKUCHIOL: 'aroma-zone-serum-bakuchiol',
  AZ_SERUM_HYALURONIQUE_3_5: 'aroma-zone-serum-acide-hyaluronique-3-5',
  AROMA_ZONE_CONCENTRE_AZELAIC_10: 'aroma-zone-serum-concentre-acide-azelaique-10',
}

export const AZ_PRODUCT_DATA = [
  {
    name: 'Sérum Concentré Acide Azélaïque 10%',
    brand: 'Aroma-Zone',
    kind: 'skincare',
    unit: 'pump',
    slug: AZ_PRODUCT_SLUGS.AROMA_ZONE_CONCENTRE_AZELAIC_10,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1500,
    description: 'Sérum naturel 10% acide azélaïque + HA + silice. Séborégulateur, matifiant.',
    notes:
      '100% origine naturelle, marque française. Très asséchant selon avis, extrait saule (BHA naturel), picotements possibles. Pas idéal post-IPL.',
    inci: 'AQUA, AZELAIC ACID (10%), PENTYLENE GLYCOL, PHYTIC ACID, SALIX NIGRA BARK EXTRACT, SILICA, SODIUM HYDROXIDE, XANTHAN GUM, SODIUM HYALURONATE',
    url: 'https://www.aroma-zone.com',
  },
  {
    name: 'Sérum Concentré Vitamine C 10% & Astaxanthine',
    brand: 'Aroma Zone',
    slug: AZ_PRODUCT_SLUGS.AZ_SERUM_VITAMINE_C_10_ASTAXANTHINE,
    kind: 'skincare',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum antioxydant puissant avec 10% d’ascorbyl glucoside et astaxanthine pour protéger contre le photo-vieillissement, stimuler le collagène, éclaircir et réduire les taches.',
    notes:
      'Formule clean, vegan, avec hyaluronate de sodium et huile de jojoba. Convient aux peaux matures ou exposées.',
    inci: 'AQUA, ASCORBYL GLUCOSIDE (10%), GLYCERIN (GLYCÉRINE VÉGÉTALE), SALIX NIGRA BARK EXTRACT, SODIUM HYDROXIDE, SODIUM LEVULINATE, HAEMATOCOCCUS PLUVIALIS EXTRACT, SODIUM HYALURONATE, SIMMONDSIA CHINENSIS SEED OIL, ASTRAGALUS GUMMIFER GUM, LEVULINIC ACID, SODIUM ANISATE, PHYTIC ACID, POLYPEPSILON-LYSINE, TOCOPHEROL, HELIANTHUS ANNUUS SEED OIL',
    url: 'https://www.aroma-zone.com',
  },

  {
    name: 'Sérum Bakuchiol',
    brand: 'Aroma Zone',
    slug: AZ_PRODUCT_SLUGS.AZ_SERUM_BAKUCHIOL,
    kind: 'skincare',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 600,
    description:
      'Sérum anti-âge naturel au bakuchiol (alternative douce au rétinol) dans une base squalane. Stimule collagène, réduit rides sans irritation.',
    notes: 'Minimaliste (3 ingrédients), vegan, stable.',
    inci: 'SQUALANE, ISOSORBIDE DICAPRYLATE, BAKUCHIOL',
    url: 'https://www.aroma-zone.com',
  },
  {
    name: "Sérum concentré d'Acide hyaluronique 3,5%",
    brand: 'Aroma-Zone',
    kind: 'skincare',
    unit: 'dropper',
    slug: AZ_PRODUCT_SLUGS.AZ_SERUM_HYALURONIQUE_3_5,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 595,
    description:
      "Ce sérum 100% d'origine naturelle est l'un des plus concentrés du marché (3,5%). Il est reconnu pour lisser, hydrater et repulper la peau tout en comblant les rides.",
    notes:
      "Note: 4.6/5. Sans alcool. Contient de l'acide hyaluronique de différents poids moléculaires (5 kDa à 1800 kDa). Peut aussi s'utiliser sur les cheveux secs. Certifié COSMOS NATURAL.",
    inci: 'Aqua, Sodium hyaluronate, Salix nigra bark extract, Glycerin.',
    url: 'https://www.aroma-zone.com',
  },
]
