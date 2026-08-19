// FR phrasing for algo-derm risk axes and heuristic flag families.
// Calm wording that avoids verdicts per vision: describe a known signal, never rank or diagnose.

type RiskAxis =
  | 'irritation'
  | 'allergenicity'
  | 'comedogenicity'
  | 'dryness'
  | 'photosensitivity'
  | 'fungalAcne'

// Driver phrasing: "<ingredient> — <phrase>".
export const RISK_AXIS_PHRASE: Record<RiskAxis, string> = {
  irritation: 'peut être irritant',
  allergenicity: 'allergène potentiel',
  comedogenicity: 'peut favoriser les imperfections',
  dryness: 'peut dessécher',
  photosensitivity: 'peut sensibiliser au soleil',
  fungalAcne: 'peut nourrir la levure (fungal acne)',
}

type BenefitAxis =
  | 'soothing'
  | 'hydrating'
  | 'barrierSupport'
  | 'antioxidant'
  | 'brightening'
  | 'seborrheicRegulation'
  | 'exfoliation'

// Noun-form labels for the collection "motifs" view: "<phrase> · N produits".
export const BENEFIT_AXIS_PHRASE: Record<BenefitAxis, string> = {
  soothing: 'apaisant',
  hydrating: 'hydratant',
  barrierSupport: 'soutient la barrière',
  antioxidant: 'antioxydant',
  brightening: 'coup d’éclat',
  seborrheicRegulation: 'régule le sébum',
  exfoliation: 'exfoliant',
}

// Dose signal: algo-derm emits continuous roleAtDose.doseFactor/confidence and
// leaves the boolean "is it active" cut to the consumer (ADR-0014). Keep the
// positive and excipient confidence cuts separate: recall must not hide more risks.
export const DOSE_SIGNAL_MIN_DOSE_FACTOR = 0.7
export const DOSE_SIGNAL_MIN_CONFIDENCE = 0.5
export const DOSE_EXCIPIENT_MAX_DOSE_FACTOR = 0.3
export const DOSE_EXCIPIENT_MIN_CONFIDENCE = 0.6

// roleAtDose is a qualitative signal, not a concentration estimate.
export const DOSE_SIGNAL_PHRASE = 'probablement dosé pour agir'

// Numeric estimates need a visible method and must fall back when the solver is weak.
export const CONC_METHOD_NOTE =
  'Estimé par l’algorithme d’après l’ordre de la liste INCI. Indicatif, non confirmé par la marque.'
export const CONC_UNESTIMABLE_PHRASE = 'présent · dose non estimable'

// Neutral caveats mapped from assessment confidence factors; limitationNotes
// carries the same facts but as dynamic English prose. unknown_ingredients is
// deliberately unmapped; the coverage footnote already states it.
export const CONFIDENCE_FACTOR_PHRASE: Record<string, string> = {
  low_coverage:
    'Formule encore peu couverte par nos données — pas assez de contexte pour en dire plus.',
  heuristic_only:
    'Certains signaux reposent sur le nom des ingrédients, pas sur des données consolidées.',
}

// Shown when the assessment ran but surfaced nothing: an analyzed-but-quiet
// formula must say so, silence is reserved for errors and missing INCI.
export const NO_SIGNAL_PHRASE = 'Rien de notable dans cette formule.'

// Composition signals are deliberately separate from the skin score. Keys pair
// the upstream family with its confidence so a vendor addition stays silent
// until Aurore has reviewed its French wording.
export const INGREDIENT_SIGNAL_PHRASE: Record<string, string> = {
  'pfas/high':
    'Famille des PFAS identifiée dans le nom INCI. Cette présence ne renseigne ni la quantité, ni les effets du produit.',
  'pfas/low':
    'Fragment fluoré repéré dans le nom INCI. Ce repère ne renseigne ni la quantité, ni les effets du produit.',
  'cyclic_siloxane/high':
    'Silicone cyclique identifiée dans la liste INCI. La liste ne donne pas sa concentration ; le cadre applicable dépend aussi du type de produit.',
  'synthetic_polymer/low':
    'Polymère synthétique repéré dans la liste INCI. Elle ne précise pas s’il est utilisé comme particule solide ni s’il entre dans le champ de la restriction.',
}

// Interaction rules, keyed by algo-derm rule id. Rewritten here instead of translated: the
// lib's English notes are clinical and fear-based, which the vision rules out. An unmapped id
// renders nothing, so a vendor bump must add its phrase here first. Some ids cannot fire yet
// (`pregnant` is hardcoded false, no product supplies `estimatedPH`) and are mapped anyway,
// so supplying the input never leaks raw English.
export const INTERACTION_PHRASE: Record<string, string> = {
  'alcohol+fragrance':
    'Alcool dénaturé et parfum ensemble — une association que les peaux réactives tolèrent souvent moins bien.',
  'alcohol+allergen':
    'Alcool dénaturé et allergène parfumant ensemble — la sensibilité au parfum peut s’en trouver accentuée.',
  'acid+alcohol':
    'Acide exfoliant et alcool dénaturé dans une formule sans rinçage — la barrière cutanée est davantage sollicitée.',
  'multiple-essential-oils':
    'Plusieurs huiles essentielles — leurs composants allergisants s’additionnent.',
  'mitigation-niacinamide+glycerin':
    'Niacinamide et glycérine — une association qui adoucit souvent le reste de la formule.',
  'aha-low-ph':
    'AHA à pH bas — l’acide est sous sa forme la plus active, et picote plus volontiers.',
  'bha-low-ph':
    'Acide salicylique à pH bas — la pénétration est plus marquée, la tolérance varie d’une peau à l’autre.',
  'isothiazolinone-leave-on':
    'Conservateur de la famille des isothiazolinones dans une formule sans rinçage — cet usage n’est pas autorisé dans l’Union européenne.',
  'retinoid-pregnancy':
    'Rétinoïde détecté. Pendant une grossesse, c’est un ingrédient dont on parle habituellement avec un professionnel de santé.',
  'retinoid-sensitive-skin-leave-on':
    'Rétinoïde dans une formule sans rinçage — les premières semaines s’accompagnent souvent de tiraillements sur peau sensible.',
  'comedogenic-leave-on-acne-prone':
    'Corps gras réputés comédogènes dans une formule sans rinçage — à observer si votre peau y réagit.',
  'isothiazolinone-rinse-off-sensitive':
    'Conservateur de la famille des isothiazolinones, même à rincer — c’est un allergène de contact fréquent sur peau réactive.',
  'hydroquinone-pregnant':
    'Hydroquinone détectée. Pendant une grossesse, c’est un ingrédient dont on parle habituellement avec un professionnel de santé.',
  'rosacea-trigger-leave-on':
    'Ingrédients vasoactifs (alcool dénaturé, menthol, menthe, eucalyptus, camphre) — parmi les déclencheurs les plus souvent rapportés en cas de rosacée.',
  'formaldehyde-donor-leave-on-sensitive':
    'Conservateur libérateur de formaldéhyde dans une formule sans rinçage — allergène de contact fréquent, bon à savoir sur peau réactive.',
  'retinoid-acid-leave-on':
    'Rétinoïde et acide exfoliant dans la même formule — leurs effets sur la barrière cutanée s’additionnent.',
  'benzoyl-peroxide-retinoid-leave-on':
    'Peroxyde de benzoyle et rétinoïde ensemble — le peroxyde dégrade le rétinoïde, et l’association tiraille davantage.',
  'vitamin-c-low-ph':
    'Vitamine C pure à pH bas — c’est la condition de sa stabilité, et cela peut picoter.',
}

// Scope of a borrowed official cap, keyed by algo-derm's `scopeId`. A cap like
// 7,34 % is one product family's limit (Homosalate's face limit, not a
// sunscreen's), and reads as the product's own limit if shown bare. The
// renderer drops it when unmapped. No parentheses: already inside one.
export const REGULATORY_SCOPE_PHRASE: Record<string, string> = {
  'face-products-excluding-aerosol-sprays': 'pour les produits visage, hors sprays aérosols',
  'leave-on-products': 'pour les produits sans rinçage',
  'rinse-off-products': 'pour les produits à rincer',
  'rinse-off-products-leave-on-not-permitted':
    'pour les produits à rincer, l’usage sans rinçage n’étant pas autorisé',
  'anti-dandruff-shampoos': 'pour les shampooings antipelliculaires',
  'oral-care-products-as-fluoride': 'pour les produits bucco-dentaires, exprimé en fluor',
  'artificial-nail-preparations-professional':
    'pour les préparations pour ongles artificiels, en usage professionnel',
  'oxidative-hair-dyes-after-mixing':
    'pour les colorations capillaires d’oxydation, mesuré sur les cheveux après mélange',
  'deodorants-antiperspirants-anhydrous':
    'pour les déodorants et anti-transpirants, exprimé en forme anhydre',
  'preservative-use-as-benzalkonium-chloride':
    'pour l’usage comme conservateur, exprimé en chlorure de benzalkonium',
  'toothpastes-and-mouthwashes': 'pour les dentifrices et bains de bouche',
  mouthwashes: 'pour les bains de bouche',
  'listed-hygiene-products':
    'pour une liste de produits d’hygiène : dentifrices, savons mains et corps, gels douche, déodorants hors spray, poudres et fonds de teint, nettoyants pour ongles',
}

// Maps skin-profile slugs to the risk axes that matter to that user, used to highlight
// relevant signals without deriving the backend's profile mapping.
export const PROFILE_RELEVANT_AXES: Record<string, ReadonlyArray<RiskAxis>> = {
  'peau-sensible': ['irritation', 'allergenicity'],
  rosacee: ['irritation'],
  couperose: ['irritation'],
  flushs: ['irritation'],
  'anti-rougeurs': ['irritation'],
  'anti-acne': ['comedogenicity', 'fungalAcne'],
  'post-acne': ['comedogenicity', 'fungalAcne'],
  'pores-dilates': ['comedogenicity', 'fungalAcne'],
  brillance: ['comedogenicity', 'fungalAcne'],
}
