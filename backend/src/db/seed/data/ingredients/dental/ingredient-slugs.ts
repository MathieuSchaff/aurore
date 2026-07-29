// Dental ingredient slug groups. Root ingredient-slugs.ts re-exports from here.

// DENTAL_ABRASIFS is gone: hydrated silica, calcium carbonate and bicarbonate are generic
// minerals, and all three moved to the skincare TEXTURANTS_FONCTIONNELS group.

export const DENTAL_ANTIMICROBIENS = {
  SODIUM_FLUORIDE: 'sodium-fluoride', // INCI: Sodium Fluoride | protection caries, reminéralisation émail
  SODIUM_MONOFLUOROPHOSPHATE: 'sodium-monofluorophosphate', // INCI: Sodium Monofluorophosphate | source de fluor alternative
  TEA_TREE_OIL_DENTAL: 'tea-tree-oil-dental', // INCI: Melaleuca Alternifolia Leaf Oil | antimicrobien naturel
  // clove-oil-eugenol moved to the skincare file: 22 of the 24 products carrying a clove
  // spelling are not dental, so a dental domain dropped them all. The eugenol molecule it
  // used to declare alongside the oil now has its own slug there too.
} as const

export const DENTAL_ANTI_SENSIBILITE = {
  POTASSIUM_NITRATE: 'potassium-nitrate', // INCI: Potassium Nitrate | désensibilise les tubules dentinaires
  STANNOUS_FLUORIDE: 'stannous-fluoride', // INCI: Stannous Fluoride | anti-sensibilité + anti-caries + anti-gingivite
} as const

export const DENTAL_BLANCHISSANTS = {
  CARBAMIDE_PEROXIDE: 'carbamide-peroxide', // INCI: Carbamide Peroxide | libère H₂O₂ lentement, blanchiment progressif
} as const

export const DENTAL_REMINERALISATION = {
  HYDROXYAPATITE: 'hydroxyapatite', // INCI: Hydroxyapatite | minéral constitutif de l'émail, reminéralise sans fluor
  CALCIUM_GLYCEROPHOSPHATE: 'calcium-glycerophosphate', // INCI: Calcium Glycerophosphate | source de calcium/phosphate pour émail
} as const

export const DENTAL_EXCIPIENTS = {
  GLYCERIN_DENTAL: 'glycerin-dental', // INCI: Glycerin | humectant/base, prévient dessèchement du dentifrice
  XANTHAN_GUM_DENTAL: 'xanthan-gum-dental', // INCI: Xanthan Gum | épaississant stabilisant
} as const

export const DENTAL_DIVERS = {
  XYLITOL_DENTAL: 'xylitol-dental', // INCI: Xylitol | inhibe Streptococcus mutans, non fermentescible
  // sodium-lauryl-sulfate moved to the skincare file, next to sles-hair: dental covered only 17
  // of the 25 products carrying the token, and haircare was minting the key first anyway.
} as const

export const DENTAL_ZINC = {
  ZINC_LACTATE: 'zinc-lactate', // INCI: Zinc Lactate | anti-gingivite, anti-halitose (Meridol)
  ZINC_ACETATE: 'zinc-acetate', // INCI: Zinc Acetate | anti-halitose par neutralisation des VSC (CB12)
  ZINC_PHOSPHATE: 'zinc-phosphate', // INCI: Zinc Phosphate | anti-tartre structurel (Elmex)
  ZINC_SULFATE: 'zinc-sulfate', // INCI: Zinc Sulfate | anti-tartre, anti-inflammatoire gingival léger
} as const

export const DENTAL_ACTIFS_COMPLEMENTAIRES = {
  ARGININE_DENTAL: 'arginine-dental', // INCI: Arginine | occlusion tubulaire anti-sensibilité (Pro-Argin, Elmex)
  CALCIUM_SODIUM_PHOSPHOSILICATE: 'calcium-sodium-phosphosilicate', // INCI: Calcium Sodium Phosphosilicate | biocéramique reminéralisante (Novamin, Sensodyne)
  CETYLPYRIDINIUM_CHLORIDE: 'cetylpyridinium-chloride', // INCI: Cetylpyridinium Chloride | antiseptique buccal (Gum, Meridol)
} as const

export const DENTAL_TENSIOACTIFS_DOUX = {
  COCAMIDOPROPYL_BETAINE_DENTAL: 'cocamidopropyl-betaine-dental', // INCI: Cocamidopropyl Betaine | tensioactif amphotère doux, alternative SLS
} as const
