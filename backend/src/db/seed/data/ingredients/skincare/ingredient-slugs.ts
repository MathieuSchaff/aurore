// Skincare ingredient slug groups. Root ingredient-slugs.ts re-exports from here.
export const HUMECTANTS = {
  HYDROXYETHYL_UREA: 'hydroxyethyl-urea', // INCI: Hydroxyethyl Urea | powerful humectant, improves skin elasticity
  GLUCOSAMINE_HCL: 'glucosamine-hcl', // INCI: Glucosamine HCl | hyaluronic acid precursor, mild humectant
  SODIUM_LACTATE: 'sodium-lactate', // INCI: Sodium Lactate | sodium salt of lactic acid, NMF component
  ALANINE: 'alanine', // INCI: Alanine | NMF amino acid, repairing and hydrating
  GLYCERIN: 'glycerin', // INCI: Glycerin | star humectant
  HYALURONIC_ACID: 'hyaluronic-acid', // INCI: Hyaluronic Acid | pure hyaluronic acid
  SODIUM_HYALURONATE: 'sodium-hyaluronate', // INCI: Sodium Hyaluronate | sodium salt of hyaluronic acid (most common form)
  HYDROLYZED_HYALURONIC_ACID: 'hydrolyzed-hyaluronic-acid', // INCI: Hydrolyzed Hyaluronic Acid | fragmented hyaluronic acid (deep penetration)
  SODIUM_HYALURONATE_CROSSPOLYMER: 'sodium-hyaluronate-crosspolymer', // INCI: Sodium Hyaluronate Crosspolymer | long-lasting 3D form
  SODIUM_ACETYLATED_HYALURONATE: 'sodium-acetylated-hyaluronate', // INCI: Sodium Acetylated Hyaluronate | "Super HA", high affinity and hydration
  HYDROXYPROPYLTRIMONIUM_HYALURONATE: 'hydroxypropyltrimonium-hyaluronate', // INCI: Hydroxypropyltrimonium Hyaluronate / Hydroxypropyl Trimonium Hyaluronate | cationic HA (adherence)
  POTASSIUM_HYALURONATE: 'potassium-hyaluronate', // INCI: Potassium Hyaluronate | potassium salt (continuous hydration)
  POLYGLUTAMIC_ACID: 'polyglutamic-acid', // INCI: Polyglutamic Acid | super-humectant (more than HA)
  SODIUM_PCA: 'sodium-pca', // INCI: Sodium PCA | natural NMF component, powerful humectant
  ARGININE_PCA: 'arginine-pca', // INCI: Arginine PCA / PCA Arginine | NMF humectant
  CALCIUM_PCA: 'calcium-pca', // INCI: Calcium PCA | NMF humectant
  UREA: 'urea', // INCI: Urea | humectant + keratolytic
  BETAINE: 'betaine', // INCI: Betaine | osmolyte humectant, often derived from beet
  PENTYLENE_GLYCOL: 'pentylene-glycol', // INCI: Pentylene Glycol | humectant + mild preservative
  PROPYLENE_GLYCOL: 'propylene-glycol', // INCI: Propylene Glycol | humectant/solvent
  // add-to-db backlog, lot 3.
  HEXYLENE_GLYCOL: 'hexylene-glycol', // INCI: Hexylene Glycol | glycol solvent/humectant, mild co-surfactant
  // add-to-db backlog, lot 5.
  GLYCERETH_26: 'glycereth-26', // INCI: Glycereth-26 | polyethylene glycol glyceryl ether, humectant
  GLYCERYL_GLUCOSIDE: 'glyceryl-glucoside', // INCI: Glyceryl Glucoside | humectant
  ACETYL_GLUCOSAMINE: 'acetyl-glucosamine', // INCI: Acetyl Glucosamine | amino derivative of glucose, humectant + mild brightening
  SNOW_MUSHROOM: 'snow-mushroom', // INCI: Tremella Fuciformis Extract / Polysaccharide | natural super-humectant
  // NMF amino acids
  ARGININE: 'arginine', // INCI: Arginine | NMF amino acid, adjusts pH
  SERINE: 'serine', // INCI: Serine | NMF amino acid
  HISTIDINE: 'histidine', // INCI: Histidine | NMF amino acid
  LEUCINE: 'leucine', // INCI: Leucine | NMF amino acid
  LYSINE_HCL: 'lysine-hcl', // INCI: Lysine HCl | NMF amino acid
  PHENYLALANINE: 'phenylalanine', // INCI: Phenylalanine / Phenyl Alanine | NMF amino acid
  TYROSINE: 'tyrosine', // INCI: Tyrosine | amino acid, melanin precursor
  GLUTAMINE: 'glutamine', // INCI: Glutamine | amino acid, hydrating / repairing
  COLLAGEN_AMINO_ACIDS: 'collagen-amino-acids', // INCI: Collagen Amino Acids | humectant collagen hydrolysate
  XYLITYLGLUCOSIDE: 'xylitylglucoside', // INCI: Xylitylglucoside / Xylityl Glucoside | sugar derivative (Aquaxyl), boosts deep hydration
  XYLITOL: 'xylitol', // INCI: Xylitol | natural sugar humectant
  ANHYDROXYLITOL: 'anhydroxylitol', // INCI: Anhydroxylitol | xylitol derivative, hydration balance
  PCA: 'pca', // INCI: PCA | natural moisturizing factor (NMF)
  TREHALOSE: 'trehalose', // INCI: Trehalose | protective osmolyte, stabilizing humectant
  GLYCINE: 'glycine', // INCI: Glycine | hydrating and soothing amino acid
  MANNITOL: 'mannitol', // INCI: Mannitol | sugar humectant, often used in soothing complexes
  // add-to-db backlog (algo-derm has full evidence, no DB row yet) — distinct from the v27
  // coverage-stub return: this one carries a real CIR-graded humectant profile.
  GLUCOSE: 'glucose', // INCI: Glucose | simple sugar, humectant and skin conditioner
  IMPERATA_CYLINDRICA_ROOT: 'imperata-cylindrica-root', // INCI: Imperata Cylindrica Root Extract | herbaceous extract, hydrating osmolyte
  DISODIUM_ACETYL_GLUCOSAMINE_PHOSPHATE: 'disodium-acetyl-glucosamine-phosphate', // INCI: Disodium Acetyl Glucosamine Phosphate | glucosamine derivative, hydrating, brightening
  ACETAMIDOETHOXYETHANOL: 'acetamidoethoxyethanol', // INCI: Acetamidoethoxyethanol (Hydromanil) | long-lasting biomimetic humectant
  SACCHARIDE_ISOMERATE: 'saccharide-isomerate', // INCI: Saccharide Isomerate | long-lasting plant humectant (Pentavitin)
  HYDROLYZED_SODIUM_HYALURONATE: 'hydrolyzed-sodium-hyaluronate', // INCI: Hydrolyzed Sodium Hyaluronate | low-MW HA fragments, deeper stratum corneum penetration
  SODIUM_ACETYL_HYALURONATE: 'sodium-acetyl-hyaluronate', // INCI: Sodium Acetyl Hyaluronate | acetylated HA salt, improved skin retention
  SOLUBLE_COLLAGEN: 'soluble-collagen', // INCI: Soluble Collagen / Collagen / Collagen Extract | native soluble collagen, distinct from the hydrolysate
  HYDROLYZED_QUINOA: 'hydrolyzed-quinoa', // INCI: Hydrolyzed Quinoa | quinoa protein hydrolysate, film-forming and humectant
  MEL_EXTRACT: 'mel-extract', // INCI: Mel Extract | honey extract, humectant supporting filaggrin and aquaporins
  SERICIN: 'sericin', // INCI: Sericin | silk glue protein, lowers TEWL, documented protein allergen
  POLYGLYCERIN_3: 'polyglycerin-3', // INCI: Polyglycerin-3 | low-MW polyglycerol humectant
  POLYQUATERNIUM_51: 'polyquaternium-51', // INCI: Polyquaternium-51 | phospholipid-mimetic MPC polymer, film-forming
  // Chelates too, but algo-derm declares it HUMECTANT / SKIN CONDITIONING, so it sits here
  // rather than with the chelators of CHELATANTS.
  CALCIUM_GLUCONATE: 'calcium-gluconate', // INCI: Calcium Gluconate | calcium salt of gluconic acid
  // Sugars, free amino acids and protein hydrolysates moved out of the haircare, dental and
  // supplements files. They humectate a face cream exactly as they humectate a conditioner.
  SORBITOL_DENTAL: 'sorbitol-dental', // INCI: Sorbitol | sugar humectant, non-fermentable
  FRUCTOSE_HAIR: 'fructose-hair', // natural sugar humectant
  TAURINE: 'taurine-supplement', // osmolyte, protects cells against hyperosmotic stress
  PROLINE_HAIR: 'proline-hair', // free amino acid, NMF component
  THREONINE_HAIR: 'threonine-hair', // free amino acid, NMF component
  VALINE_HAIR: 'valine-hair', // free amino acid, NMF component
  HYDROLYZED_COLLAGEN_HAIR: 'hydrolyzed-collagen-hair', // collagen hydrolysate, hydrating film former
  HYDROLYZED_RICE_PROTEIN: 'hydrolyzed-rice-protein', // rice protein hydrolysate, film forming
  HYDROLYZED_SOY_PROTEIN: 'hydrolyzed-soy-protein', // soy protein hydrolysate, film forming
  HYDROLYZED_WHEAT_PROTEIN: 'hydrolyzed-wheat-protein', // wheat protein hydrolysate, hydrating
  HYDROLYZED_SILK: 'hydrolyzed-silk', // silk protein hydrolysate, softening
  HYDROLYZED_OAT_PROTEIN: 'hydrolyzed-oat-protein', // oat protein hydrolysate, soothing
  SILK_AMINO_ACIDS: 'silk-amino-acids', // silk-derived free amino acids
  WHEAT_AMINO_ACIDS: 'wheat-amino-acids', // wheat-derived free amino acids
} as const

export const BARRIERE_EMOLLIENTS_OCCLUSIFS = {
  CETEARYL_ALCOHOL: 'cetearyl-alcohol', // INCI: Cetearyl Alcohol | fatty alcohol, emollient and thickener, non-drying
  // add-to-db backlog, lot 4.
  ARACHIDYL_ALCOHOL: 'arachidyl-alcohol', // INCI: Arachidyl Alcohol | C20 fatty alcohol, emulsion-stabilising thickener
  // add-to-db backlog, lot 5. Sugar-derived emulsifier typically blended with the fatty alcohol
  // above (Montanov 202-type pairing); graded barrier-support benefit in the algo-derm evidence.
  ARACHIDYL_GLUCOSIDE: 'arachidyl-glucoside', // INCI: Arachidyl Glucoside | non-ionic emulsifier, barrier-support benefit
  GLYCERYL_STEARATE: 'glyceryl-stearate', // INCI: Glyceryl Stearate | emollient emulsifier, texture agent
  // add-to-db backlog. Self-emulsifying variant of the emollient above: same core ester, an
  // added co-emulsifier (usually a soap) removes the need for a separate emulsifier in the batch.
  GLYCERYL_STEARATE_SE: 'glyceryl-stearate-se', // INCI: Glyceryl Stearate SE | self-emulsifying glyceryl stearate, moderate comedogenicity signal
  // Olive-derived emulsifier (Olivem 1000-type), mild non-ionic surfactant per CIR.
  CETEARYL_OLIVATE: 'cetearyl-olivate', // INCI: Cetearyl Olivate | olive-derived emulsifier
  AVOCADO_OIL: 'avocado-oil', // INCI: Persea Gratissima (Avocado) Oil | avocado oil, nourishing and regenerating
  CERAMIDES: 'ceramides', // INCI: Ceramide (general) or blend (Ceramide NP, AP, EOP...)
  CERAMIDE_NP: 'ceramide-np', // INCI: Ceramide NP (Ceramide 3)
  CERAMIDE_AP: 'ceramide-ap', // INCI: Ceramide AP (Ceramide 6-II)
  CERAMIDE_EOP: 'ceramide-eop', // INCI: Ceramide EOP (Ceramide 1)
  CERAMIDE_NS: 'ceramide-ns', // INCI: Ceramide NS (Ceramide 2) – less common
  // Motta letter code: 1st letter = fatty acid (N non-hydroxy, A alpha-hydroxy,
  // EO omega-hydroxy esterified), 2nd = sphingoid base (S sphingosine,
  // dS dihydrosphingosine, P phytosphingosine, H 6-hydroxysphingosine).
  // Retired numbered names stay out of the taxonomy: algo-derm aliases already
  // resolve them onto these letter forms.
  CERAMIDE_AS: 'ceramide-as', // INCI: Ceramide AS | alpha-hydroxy acyl on sphingosine
  CERAMIDE_AG: 'ceramide-ag', // INCI: Ceramide AG | sphingosine base, synthetic acyl chain
  CERAMIDE_NG: 'ceramide-ng', // INCI: Ceramide NG | sphingosine base, synthetic acyl chain
  CERAMIDE_EOS: 'ceramide-eos', // INCI: Ceramide EOS | linoleate-esterified acyl on sphingosine
  CERAMIDE_EOH: 'ceramide-eoh', // INCI: Ceramide EOH | esterified acyl on 6-hydroxysphingosine
  CERAMIDE_AH: 'ceramide-ah', // INCI: Ceramide AH | alpha-hydroxy acyl on 6-hydroxysphingosine
  CERAMIDE_NH: 'ceramide-nh', // INCI: Ceramide NH | non-hydroxy acyl on 6-hydroxysphingosine
  CERAMIDE_NDS: 'ceramide-nds', // INCI: Ceramide NdS | non-hydroxy acyl on dihydrosphingosine
  CERAMIDE_ADS: 'ceramide-ads', // INCI: Ceramide AdS | alpha-hydroxy acyl on dihydrosphingosine
  CERAMIDE_EODS: 'ceramide-eods', // INCI: Ceramide EOdS | esterified acyl on dihydrosphingosine
  CHOLESTEROL: 'cholesterol', // INCI: Cholesterol | NMF component, very important in barrier creams
  PHYTOSPHINGOSINE: 'phytosphingosine', // INCI: Phytosphingosine | barrier lipid, antimicrobial
  GLYCOSPHINGOLIPIDS: 'glycosphingolipids', // INCI: Glycosphingolipids | barrier lipids, often with ceramides
  SQUALANE: 'squalane', // INCI: Squalane | stable hydrocarbon from olive or sugarcane
  SHEA_BUTTER: 'shea-butter', // INCI: Butyrospermum Parkii Butter | shea butter
  BEEF_TALLOW: 'beef-tallow', // INCI: Tallow | bovine fat, very occlusive
  DIMETHICONE: 'dimethicone', // INCI: Dimethicone | occlusive / smoothing silicone
  DICAPRYLYL_ETHER: 'dicaprylyl-ether', // INCI: Dicaprylyl Ether | light emollient, dry texture
  HYDROGENATED_POLYISOBUTENE: 'hydrogenated-polyisobutene', // INCI: Hydrogenated Polyisobutene | synthetic emollient
  PALMITAMIDE_MEA: 'palmitamide-mea', // INCI: Palmitamide MEA | emollient / soothing barrier-restructuring agent
  GLYCERYL_DIBEHENATE: 'glyceryl-dibehenate', // INCI: Glyceryl Dibehenate | emulsifier / thickener
  TRIBEHENIN: 'tribehenin', // INCI: Tribehenin | emollient / thickener
  CIRE_ABEILLE: 'cera-alba', // INCI: Cera Alba | beeswax
  HUILE_GRAINES_TOURNESOL: 'huile-graines-tournesol', // INCI: Helianthus Annuus (Sunflower) Seed Oil
  HUILE_D_ARGAN: 'huile-argan', // INCI: Argania Spinosa Kernel Oil
  HUILE_DE_JOJOBA: 'huile-jojoba', // INCI: Simmondsia Chinensis (Jojoba) Seed Oil
  HUILE_DE_COCO: 'huile-coco', // INCI: Cocos Nucifera (Coconut) Oil
  HUILE_DE_RICIN: 'ricinus-communis-seed-oil', // INCI: Ricinus Communis (Castor) Seed Oil | castor oil
  CAMELLIA_JAPONICA_OIL: 'camellia-japonica-seed-oil', // INCI: Camellia Japonica Seed Oil
  PRUNUS_AMYGDALUS_DULCIS_OIL: 'prunus-amygdalus-dulcis-oil', // INCI: Prunus Amygdalus Dulcis (Sweet Almond) Oil
  BOURRACHE: 'bourrache', // INCI: Borago Officinalis Seed Oil | rich in GLA
  HUILE_ONAGRE: 'huile-onagre', // INCI: Oenothera Biennis Oil | rich in GLA (+ EVENING_PRIMROSE_OIL)
  EVENING_PRIMROSE_OIL: 'evening-primrose-oil', // INCI: Oenothera Biennis Oil | evening primrose oil, rich in essential fatty acids
  HUILE_DE_PEPINS_DE_RAISIN: 'huile-de-pepins-de-raisin', // INCI: Vitis Vinifera (Grape) Seed Oil
  HUILE_DE_PEPINS_DE_FIGUE_DE_BARBARIE: 'huile-de-pepins-de-barbarie', // INCI: Opuntia Ficus-Indica Seed Oil
  APRICOT_KERNEL_OIL: 'prunus-armeniaca-kernel-oil', // INCI: Prunus Armeniaca Kernel Oil | apricot kernel oil
  HUILE_CARTHAME: 'huile-carthame', // INCI: Carthamus Tinctorius Seed Oil SAFFLOWER_SEED_OIL
  LINOLEIC_ACID: 'linoleic-acid', // INCI: Linoleic Acid | essential fatty acid, barrier anti-inflammatory
  BEURRE_CACAO: 'theobroma-cacao-butter', // INCI: Theobroma Cacao Seed Butter | cocoa butter, nourishing and protective
  OLEIC_ACID: 'oleic-acid', // INCI: Oleic Acid | omega-9 fatty acid emollient, strengthens the skin barrier, nourishes and hydrates (ideal for dry/mature skin)
  HUILE_SOJA: 'huile-soja',
  CAPRYLIC_CAPRIC_TRIGLYCERIDE: 'caprylic-capric-triglyceride',
  BUTYLOCTYL_SALICYLATE: 'butyloctyl-salicylate', // INCI: Butyloctyl Salicylate | solvent for solid UV filters, emollient
  HUILE_COLZA: 'huile-colza',
  BUTYLENE_GLYCOL: 'butylene-glycol',
  ROSEHIP_SEED_OIL: 'rosehip-seed-oil', // INCI: Rosa Canina Seed Oil | rosehip oil, regenerating, healing, rich in vitamin A/C
  CAMELINA_SEED_OIL: 'camelina-seed-oil', // INCI: Camelina Sativa Seed Oil | camelina oil, omega-3, light and antioxidant
  HEMP_OIL: 'cannabis-sativa-seed-oil', // INCI: Cannabis Sativa Seed Oil | hemp oil, rich in omega-3/6, anti-inflammatory, soothing
  HUILE_COTON: 'huile-coton', // INCI: Gossypium Herbaceum Seed Oil | cottonseed oil
  ETHYLHEXYL_PALMITATE: 'ethylhexyl-palmitate', // INCI: Ethylhexyl Palmitate / Ethyl Hexyl Palmitate | esterified emollient
  CETEARYL_ETHYLHEXANOATE: 'cetearyl-ethylhexanoate', // INCI: Cetearyl Ethylhexanoate | C16-C18 fatty ester, distinct from Cetyl Ethylhexanoate
  // add-to-db backlog, lot 3.
  CETYL_ETHYLHEXANOATE: 'cetyl-ethylhexanoate', // INCI: Cetyl Ethylhexanoate | light branched-chain ester, non-greasy emollient
  DIBUTYL_ADIPATE: 'dibutyl-adipate', // INCI: Dibutyl Adipate | light emollient ester, also film-forming/plasticiser
  // add-to-db backlog, lot 5.
  DIISOSTEARYL_MALATE: 'diisostearyl-malate', // INCI: Diisostearyl Malate | branched diester emollient, common in lip/stick formulas
  // add-to-db backlog. Also a common solvent for solid UV filters, same role as
  // butyloctyl-salicylate above.
  C12_15_ALKYL_BENZOATE: 'c12-15-alkyl-benzoate', // INCI: C12-15 Alkyl Benzoate | dry-touch emollient ester, UV-filter solvent
  SHOREA_STENOPTERA_SEED_BUTTER: 'shorea-stenoptera-seed-butter', // INCI: Shorea Stenoptera Seed Butter | illipe butter, distinct from shea butter
  C15_19_ALKANE: 'c15-19-alkane', // INCI: C15-19 Alkane | biomimetic alkane, dry emollient, silicone alternative
  C10_18_TRIGLYCERIDES: 'c10-18-triglycerides', // INCI: C10-18 Triglycerides | biomimetic solid triglycerides, structuring emollient
  HELIANTHUS_ANNUUS_SEED_WAX: 'helianthus-annuus-seed-wax', // INCI: Helianthus Annuus (Sunflower) Seed Wax | sunflower wax, structuring agent and occlusive film
  LANOLIN_OIL: 'lanolin-oil', // INCI: Lanolin Oil | oily fraction of lanolin, rich occlusive emollient
  HYDROXYSTEARIC_ACID_10: '10-hydroxystearic-acid', // INCI: 10-Hydroxystearic Acid | hydroxylated fatty acid, PPAR-α agonist
  PASSIFLORA_EDULIS: 'passiflora-edulis', // INCI: Passiflora Edulis Seed Oil (Passioline) | linoleic-rich oil, antioxidant
  MYROTHAMNUS_FLABELLIFOLIA: 'myrothamnus-flabellifolia', // INCI: Myrothamnus Flabellifolia Leaf/Stem Extract (Myramaze) | resurrection plant
  SQUALENE: 'squalene', // INCI: Squalene | unsaturated emollient lipid, non-hydrogenated form of squalane
  ORYZA_SATIVA_BRAN_OIL: 'oryza-sativa-bran-oil', // INCI: Oryza Sativa (Rice) Bran Oil | rice bran oil, emollient and antioxidant
  LINOLENIC_ACID: 'linolenic-acid', // INCI: Linolenic Acid | omega-3 barrier lipid, soothing
  CAMELLIA_OLEIFERA_SEED_OIL: 'camellia-oleifera-seed-oil', // INCI: Camellia Oleifera Seed Oil | tea seed oil, oleic-rich, moderately comedogenic
  PUNICA_GRANATUM_SEED_OIL: 'punica-granatum-seed-oil', // INCI: Punica Granatum Seed Oil | pomegranate seed oil, punicic acid, antioxidant
  OLEANOLIC_ACID: 'oleanolic-acid', // INCI: Oleanolic Acid | triterpene, PPAR-alpha barrier support, ceramide synthesis
  RIBES_NIGRUM_SEED_OIL: 'ribes-nigrum-seed-oil', // INCI: Ribes Nigrum Seed Oil | blackcurrant seed oil, GLA-rich
  VACCINIUM_MACROCARPON_SEED_OIL: 'vaccinium-macrocarpon-seed-oil', // INCI: Vaccinium Macrocarpon (Cranberry) Seed Oil | balanced omega-3/6/9, tocotrienol-rich
  ELAEIS_GUINEENSIS_OIL: 'elaeis-guineensis-oil', // INCI: Elaeis Guineensis (Palm) Oil | palm oil, palmitic-rich emollient, comedogenic-leaning
  BETULA_ALBA_BARK_EXTRACT: 'betula-alba-bark-extract', // INCI: Betula Alba Bark Extract | birch bark, betulin, barrier gene expression
  GLYCERYL_OLEATE: 'glyceryl-oleate', // INCI: Glyceryl Oleate | oleate monoester, emulsifier, feeds Malassezia
  GLYCERYL_LAURATE: 'glyceryl-laurate', // INCI: Glyceryl Laurate | laurate monoester, emulsifier, feeds Malassezia
  HYDROGENATED_POLYDECENE: 'hydrogenated-polydecene', // INCI: Hydrogenated Polydecene | saturated hydrocarbon emollient, mineral oil replacement
  MACADAMIA_INTEGRIFOLIA_SEED_OIL: 'macadamia-integrifolia-seed-oil', // INCI: Macadamia Integrifolia Seed Oil | palmitoleic-rich nut oil
  PHYTOSTEROLS: 'phytosterols', // INCI: Phytosterols | plant sterol mixture, barrier support, very low allergenicity
  LIMNANTHES_ALBA_SEED_OIL: 'limnanthes-alba-seed-oil', // INCI: Limnanthes Alba Seed Oil | meadowfoam oil, long-chain fatty acids, stable
  DAUCUS_CAROTA_SEED_OIL: 'daucus-carota-seed-oil', // INCI: Daucus Carota Sativa (Carrot) Seed Oil | carrot seed oil, distinct from the root extract
  ASTROCARYUM_MURUMURU_SEED_BUTTER: 'astrocaryum-murumuru-seed-butter', // INCI: Astrocaryum Murumuru Seed Butter | occlusive Amazonian butter, lauric and myristic rich
  STEARIC_ACID: 'stearic-acid', // INCI: Stearic Acid | saturated C18 fatty acid, emulsion structurer
  PALMITIC_ACID: 'palmitic-acid', // INCI: Palmitic Acid | saturated C16 fatty acid, emulsion structurer
  MYRISTIC_ACID: 'myristic-acid', // INCI: Myristic Acid | saturated C14 fatty acid, soap-forming cleanser
  GLYCINE_SOJA_OIL: 'glycine-soja-oil', // INCI: Glycine Soja Oil | soybean oil, oleic and linoleic rich
  HYDROGENATED_VEGETABLE_OIL: 'hydrogenated-vegetable-oil', // INCI: Hydrogenated Vegetable Oil | hardened triglyceride blend, consistency agent
  CETYL_PALMITATE: 'cetyl-palmitate', // INCI: Cetyl Palmitate | solid wax ester, spermaceti substitute
  MYRISTYL_MYRISTATE: 'myristyl-myristate', // INCI: Myristyl Myristate | C14-C14 wax ester, opacifier
  SESAMUM_INDICUM_SEED_OIL: 'sesamum-indicum-seed-oil', // INCI: Sesamum Indicum Seed Oil | sesame oil, balanced oleic and linoleic
  ETHYLHEXYL_STEARATE: 'ethylhexyl-stearate', // INCI: Ethylhexyl Stearate | branched stearic ester, dry-touch emollient
  LINUM_USITATISSIMUM_SEED_OIL: 'linum-usitatissimum-seed-oil', // INCI: Linum Usitatissimum Seed Oil / Flax Seed Oil | flax oil, alpha-linolenic rich, oxidation-prone
  OLEYL_ALCOHOL: 'oleyl-alcohol', // INCI: Oleyl Alcohol | unsaturated C18:1 fatty alcohol, co-emulsifier
  STEARYL_HEPTANOATE: 'stearyl-heptanoate', // INCI: Stearyl Heptanoate | branched ester, rich emollient
  ISOAMYL_LAURATE: 'isoamyl-laurate', // INCI: Isoamyl Laurate | branched lauric ester, dry-touch emollient
  PROPYLHEPTYL_CAPRYLATE: 'propylheptyl-caprylate', // INCI: Propylheptyl Caprylate | branched caprylic ester, light spreading emollient
  ISOSTEARYL_ISOSTEARATE: 'isostearyl-isostearate', // INCI: Isostearyl Isostearate | branched emollient ester, pigment binder
  DECYL_OLEATE: 'decyl-oleate', // INCI: Decyl Oleate | fatty ester, light spreading emollient
  ISOPROPYL_ISOSTEARATE: 'isopropyl-isostearate', // INCI: Isopropyl Isostearate | branched isostearic ester, pigment wetting
  TRITICUM_VULGARE_GERM_OIL: 'triticum-vulgare-germ-oil', // INCI: Triticum Vulgare Germ Oil | wheat germ oil, vitamin E rich
  LANOLIN: 'lanolin', // INCI: Lanolin | whole sheep wool wax, distinct from the oily fraction
  SCLEROCARYA_BIRREA_SEED_OIL: 'sclerocarya-birrea-seed-oil', // INCI: Sclerocarya Birrea Seed Oil | marula oil, oleic-rich, clinically non-irritant
  GENTIANA_LUTEA_ROOT_EXTRACT: 'gentiana-lutea-root-extract', // INCI: Gentiana Lutea Root Extract | yellow gentian, raises keratinocyte ceramide synthesis
  // Moved out of the haircare file: nothing about an olive oil or a lecithin is capillary.
  PHOSPHATIDYLCHOLINE_HAIR: 'phosphatidylcholine-hair', // membrane phospholipid, emulsifier and liposome former
  PHOSPHOLIPIDS_HAIR: 'phospholipids-hair', // INCI: Phospholipids / Phospholipides | membrane lipid fraction
  OLIVE_OIL_HAIR: 'olive-oil-hair', // olive fruit oil, oleic dominant, nourishing
  MACADAMIA_OIL_HAIR: 'macadamia-oil-hair', // macadamia ternifolia oil, palmitoleic, silky
  MORINGA_OIL_HAIR: 'moringa-oil-hair', // moringa seed oil, behenic acid rich
  BLACK_SEED_OIL_HAIR: 'black-seed-oil-hair', // nigella seed oil, thymoquinone bearing
  CRAMBE_ABYSSINICA_OIL: 'crambe-abyssinica-seed-oil', // abyssinian oil, light, heat protective
  HYDROGENATED_CASTOR_OIL_HAIR: 'hydrogenated-castor-oil-hair', // hardened castor oil, solid wax emollient
  MANGO_BUTTER_HAIR: 'mango-butter-hair', // mango seed butter, light occlusive
  CERA_MICROCRISTALLINA_HAIR: 'cera-microcristallina-hair', // microcrystalline wax, structuring
  BEHENIC_ACID: 'behenic-acid', // saturated fatty acid, surface conditioner and co-emulsifier
  // Sat in the haircare protein group, which is doubly wrong: algo-derm files this token as an
  // alias of Jojoba Esters (CosIng 34778, wax esters, emollient), not as a protein, and 38 of the
  // 48 products carrying it are not haircare. The slug keeps its historical spelling, it is a URL.
  HYDROLYZED_JOJOBA_PROTEIN: 'hydrolyzed-jojoba-protein', // INCI: Hydrolyzed Jojoba Esters | jojoba wax esters, emollient
} as const

export const EXFOLIANTS = {
  GLYCOLIC_ACID: 'glycolic-acid', // INCI: Glycolic Acid | star AHA (exfoliant)
  LACTIC_ACID: 'lactic-acid', // INCI: Lactic Acid | mild AHA + humectant
  MANDELIC_ACID: 'mandelic-acid', // INCI: Mandelic Acid | mild AHA, antibacterial
  MALIC_ACID: 'malic-acid', // INCI: Malic Acid | pure AHA
  MALIC_ACID_ESTER: 'malic-acid-ester', // INCI: Malic Acid | mild AHA
  PHA: 'pha', // Poly-Hydroxy Acid | most common INCI: Gluconolactone
  PAPAIN: 'papain', // INCI: Papain | exfoliating enzyme (papaya)
  PROTEASE: 'protease', // INCI: Protease | proteolytic exfoliating enzyme
  CAPRYLOYL_SALICYLIC_ACID: 'capryloyl-salicylic-acid', // INCI: Capryloyl Salicylic Acid | lipophilic BHA, mild exfoliant
  CITRUS_LIMON_FRUIT_WATER: 'citrus-limon-fruit-water', // INCI: Citrus Limon Fruit Water
  SUCCINIC_ACID: 'succinic-acid', // INCI: Succinic Acid | mild exfoliant, sebum regulator
  GLYCOLIDE: 'glycolide', // INCI: Glycolide | cyclic dimer of glycolic acid, time-release exfoliant
  BETAINE_SALICYLATE: 'betaine-salicylate', // INCI: Betaine Salicylate | betaine salt of salicylic acid, gentler BHA
  TARTARIC_ACID: 'tartaric-acid', // INCI: Tartaric Acid | grape-derived AHA, low irritation at 2-8 percent
  CARICA_PAPAYA_FRUIT_EXTRACT: 'carica-papaya-fruit-extract', // INCI: Carica Papaya Fruit Extract | papain-bearing enzymatic exfoliant
  ANANAS_SATIVUS_FRUIT_EXTRACT: 'ananas-sativus-fruit-extract', // INCI: Ananas Sativus Fruit Extract | bromelain-bearing enzymatic exfoliant
} as const

export const RETINOIDES = {
  // Classic OTC / cosmetic forms
  RETINOL: 'retinol', // INCI: Retinol | pure vitamin A, 2-step conversion, OTC anti-aging star
  RETINAL: 'retinal', // INCI: Retinal / Retinaldehyde | stronger form, 1-step conversion, 2025-2026 hype
  RETINYL_PALMITATE: 'retinyl-palmitate', // INCI: Retinyl Palmitate | most common ester, very mild (3 steps), beginners / basic creams
  RETINYL_PROPIONATE: 'retinyl-propionate', // INCI: Retinyl Propionate | mild ester, slightly more stable than palmitate, often in "gentle" formulas
  RETINYL_ACETATE: 'retinyl-acetate', // INCI: Retinyl Acetate | basic ester, low potency, very stable
  RETINYL_LINOLLEATE: 'retinyl-linoleate', // INCI: Retinyl Linoleate | less common ester, sometimes for oily skin
  // Modern / next-gen OTC forms
  HYDROXYPINACOLONE_RETINOATE: 'hydroxypinacolone-retinoate', // INCI: Hydroxypinacolone Retinoate | aka Granactive Retinoid / HPR, 0 steps, direct, low irritation, very popular
  GRANACTIVE_RETINOID: 'granactive-retinoid', // INCI: Hydroxypinacolone Retinoate (often marketed as such by The Ordinary etc.)
  RETINYL_RETINOATE: 'retinyl-retinoate', // INCI: Retinyl Retinoate | retinol + retinoic acid hybrid, stable and more active
  SODIUM_RETINOYL_HYALURONATE: 'sodium-retinoyl-hyaluronate', // INCI: Sodium Retinoyl Hyaluronate | retinol bound to hyaluronic acid, hydrating + anti-aging, good tolerance
  // Non-retinoid alternatives (retinol-like)
  BAKUCHIOL: 'bakuchiol', // INCI: Bakuchiol | "natural" alternative from Psoralea corylifolia, mimics the effects without irritation

  // Prescription / medical retinoids (potent, 0 steps)
  TRETINOINE: 'tretinoine', // INCI: Tretinoin | pure retinoic acid, gold standard, very potent but irritating
  ADAPALENE: 'adapalene', // INCI: Adapalene | synthetic retinoid, anti-acne, better tolerated than tretinoin
  TAZAROTENE: 'tazarotene', // INCI: Tazarotene | very potent (often > tretinoin on wrinkles/acne/psoriasis), prescription
  TRIFAROTENE: 'trifarotene', // INCI: Trifarotene | 4th generation, highly selective (RAR-γ), mainly face + body acne, recent prescription
  // Less common but sometimes cited
  ISOTRETINOIN: 'isotretinoin', // INCI: Isotretinoin | rare topical form (better known oral), severe anti-acne
  ALITRETINOIN: 'alitretinoin', // INCI: Alitretinoin | for chronic hand eczema, specific use
} as const

export const PEPTIDES = {
  PALMITOYL_OLIGOPEPTIDE: 'palmitoyl-oligopeptide', // INCI: Palmitoyl Oligopeptide | anti-aging peptide, stimulates collagen synthesis
  ARGIRELINE: 'argireline', // INCI: Acetyl Hexapeptide-8 | "Botox-like" peptide
  MATRIXYL_3000: 'matrixyl-3000', // INCI: Palmitoyl Tripeptide-1 + Palmitoyl Tetrapeptide-7
  PALMITOYL_PENTAPEPTIDE_4: 'palmitoyl-pentapeptide-4', // INCI: Palmitoyl Pentapeptide-4 | original Matrixyl®
  PALMITOYL_TRIPEPTIDE_1: 'palmitoyl-tripeptide-1', // INCI: Palmitoyl Tripeptide-1
  PALMITOYL_TETRAPEPTIDE_7: 'palmitoyl-tetrapeptide-7', // INCI: Palmitoyl Tetrapeptide-7 / Palmitoyl Tetra Peptide-7 | anti-inflammatory
  PALMITOYL_TETRAPEPTIDE_10: 'palmitoyl-tetrapeptide-10', // INCI: Palmitoyl Tetrapeptide-10 | anti-aging
  PALMITOYL_TRIPEPTIDE_38: 'palmitoyl-tripeptide-38', // INCI: Palmitoyl Tripeptide-38
  PALMITOYL_TRIPEPTIDE_5: 'palmitoyl-tripeptide-5', // INCI: Palmitoyl Tripeptide-5
  PALMITOYL_HEXAPEPTIDE_12: 'palmitoyl-hexapeptide-12', // INCI: Palmitoyl Hexapeptide-12
  COPPER_PEPTIDES: 'copper-peptides', // INCI: Copper Tripeptide-1 (GHK-Cu) | repair / anti-aging
  ACETYL_TETRAPEPTIDE_5: 'acetyl-tetrapeptide-5', // INCI: Acetyl Tetrapeptide-5
  ACETYL_TETRAPEPTIDE_2: 'acetyl-tetrapeptide-2', // INCI: Acetyl Tetrapeptide-2
  MYRISTOYL_NONAPEPTIDE_3: 'myristoyl-nonapeptide-3', // INCI: Myristoyl Nonapeptide-3
  ACETYL_DIPEPTIDE_1_CETYL_ESTER: 'acetyl-dipeptide-1-cetyl-ester', // INCI: Acetyl Dipeptide-1 Cetyl Ester | Calmosensine™, neurosensory soothing
  SYN_AKE: 'syn-ake', // INCI: Dipeptide Diaminobutyroyl Benzylamide Diacetate | "snake-like" peptide
  PDRN: 'pdrn', // Polydeoxyribonucleotide | INCI: Sodium DNA (from salmon)
  PEPTIDE_COMPLEX: 'peptide-complex', // General category
  NICOTIANA_BENTHAMIANA_OCTAPEPTIDE_30_SH_OLIGOPEPTIDE_2:
    'nicotiana-benthamiana-octapeptide-30-sh-oligopeptide-2',
  NICOTIANA_BENTHAMIANA_HEXAPEPTIDE_40_SH_POLYPEPTIDE_76:
    'nicotiana-benthamiana-hexapeptide-40-sh-polypeptide-76',
  NICOTIANA_BENTHAMIANA_HEXAPEPTIDE_40_SH_OLIGOPEPTIDE_1:
    'nicotiana-benthamiana-hexapeptide-40-sh-oligopeptide-1',
  TETRAPEPTIDE_21: 'tetrapeptide-21', // INCI: Tetrapeptide-21 | biomimetic anti-aging peptide
  COPPER_PALMITOYL_HEPTAPEPTIDE_14: 'copper-palmitoyl-heptapeptide-14', // INCI: Copper Palmitoyl Heptapeptide-14 | copper peptide
  HEPTAPEPTIDE_15_PALMITATE: 'heptapeptide-15-palmitate', // INCI: Heptapeptide-15 Palmitate | palmitoylated peptide
  COPPER_TRIPEPTIDE_1_PALMITAMIDE: 'copper-tripeptide-1-palmitamide', // INCI: Copper Tripeptide-1 Palmitamide | lipophilic copper peptide
  TRIFLUOROACETYL_TRIPEPTIDE_2: 'trifluoroacetyl-tripeptide-2', // INCI: Trifluoroacetyl Tripeptide-2 | anti-sagging
  TRIPEPTIDE_1: 'tripeptide-1', // INCI: Tripeptide-1 | collagen stimulant
  ACETYL_TETRAPEPTIDE_15: 'acetyl-tetrapeptide-15', // INCI: Acetyl Tetrapeptide-15 | neuro-soothing peptide for sensitive skin
  ACETYL_HEXAPEPTIDE_51_AMIDE: 'acetyl-hexapeptide-51-amide', // INCI: Acetyl Hexapeptide-51 Amide | skin immune-modulating peptide
  COPPER_LYSINATE_PROLINATE: 'copper-lysinate-prolinate', // INCI: Copper Lysinate/Prolinate | copper salt of lysine+proline (Neodermyl), copper peptide family
  HEXAPEPTIDE_9: 'hexapeptide-9', // INCI: Hexapeptide-9 | cyclized ECM-supporting peptide

  // Numbered peptides the corpus carries with no algo-derm record: French text, no dermo score
  NONAPEPTIDE_1: 'nonapeptide-1', // INCI: Nonapeptide-1
  ACETYL_OCTAPEPTIDE_3: 'acetyl-octapeptide-3', // INCI: Acetyl Octapeptide-3
  DIPEPTIDE_2: 'dipeptide-2', // INCI: Dipeptide-2
  ACETYL_TETRAPEPTIDE_3: 'acetyl-tetrapeptide-3', // INCI: Acetyl Tetrapeptide-3
  ACETYL_TETRAPEPTIDE_9: 'acetyl-tetrapeptide-9', // INCI: Acetyl Tetrapeptide-9
  BIOTINOYL_TRIPEPTIDE_1: 'biotinoyl-tripeptide-1', // INCI: Biotinoyl Tripeptide-1
  PENTAPEPTIDE_18: 'pentapeptide-18', // INCI: Pentapeptide-18
  ACETYL_TETRAPEPTIDE_11: 'acetyl-tetrapeptide-11', // INCI: Acetyl Tetrapeptide-11
  ACETYL_HEPTAPEPTIDE_4: 'acetyl-heptapeptide-4', // INCI: Acetyl Heptapeptide-4
  ACETYL_TETRAPEPTIDE_40: 'acetyl-tetrapeptide-40', // INCI: Acetyl Tetrapeptide-40

  // Recombinant human peptides. The `sh-` prefix is part of the identity, not a spelling:
  // sh-Oligopeptide-1 is EGF, Oligopeptide-1 is a small GHK-family peptide. Never alias them.
  SH_OLIGOPEPTIDE_1: 'sh-oligopeptide-1', // INCI: sh-Oligopeptide-1
  SH_OLIGOPEPTIDE_2: 'sh-oligopeptide-2', // INCI: sh-Oligopeptide-2
  SH_POLYPEPTIDE_1: 'sh-polypeptide-1', // INCI: sh-Polypeptide-1
  SH_POLYPEPTIDE_3: 'sh-polypeptide-3', // INCI: sh-Polypeptide-3
  SH_POLYPEPTIDE_9: 'sh-polypeptide-9', // INCI: sh-Polypeptide-9
  SH_POLYPEPTIDE_11: 'sh-polypeptide-11', // INCI: sh-Polypeptide-11
  SH_POLYPEPTIDE_16: 'sh-polypeptide-16', // INCI: sh-Polypeptide-16
  SH_POLYPEPTIDE_22: 'sh-polypeptide-22', // INCI: sh-Polypeptide-22
  SH_POLYPEPTIDE_62: 'sh-polypeptide-62', // INCI: sh-Polypeptide-62
  SH_DECAPEPTIDE_7: 'sh-decapeptide-7', // INCI: sh-Decapeptide-7
  SH_OCTAPEPTIDE_4: 'sh-octapeptide-4', // INCI: sh-Octapeptide-4

  // Numbered and acylated peptides algo-derm holds a record for.
  PALMITOYL_TRIPEPTIDE_8: 'palmitoyl-tripeptide-8', // INCI: Palmitoyl Tripeptide-8
  OLIGOPEPTIDE_1: 'oligopeptide-1', // INCI: Oligopeptide-1
  OLIGOPEPTIDE_2: 'oligopeptide-2', // INCI: Oligopeptide-2
  TRIPEPTIDE_29: 'tripeptide-29', // INCI: Tripeptide-29
  NICOTINOYL_TRIPEPTIDE_1: 'nicotinoyl-tripeptide-1', // INCI: Nicotinoyl Tripeptide-1
  MYRISTOYL_PENTAPEPTIDE_4: 'myristoyl-pentapeptide-4', // INCI: Myristoyl Pentapeptide-4
  HEXANOYL_DIPEPTIDE_3_NORLEUCINE_ACETATE: 'hexanoyl-dipeptide-3-norleucine-acetate', // INCI: Hexanoyl Dipeptide-3 Norleucine Acetate
  // The key + value already spans 89 columns, so the pair cannot take a trailing comment on the
  // line Biome keeps: only the code counts toward lineWidth, but a wrapped declaration mints no
  // key at all. This one resolves through canonical_key, like the nicotiana- fusions above.
  NICOTIANA_BENTHAMIANA_HEXAPEPTIDE_40_SH_POLYPEPTIDE_47:
    'nicotiana-benthamiana-hexapeptide-40-sh-polypeptide-47',
} as const

export const ANTIOXYDANTS_VITAMINES = {
  VITAMIN_C: 'vitamin-c', // Category – variable INCI
  ASCORBYL_GLUCOSIDE: 'ascorbyl-glucoside', // INCI: Ascorbyl Glucoside | stable vitamin C derivative
  ASCORBYL_PALMITATE: 'ascorbyl-palmitate', // INCI: Ascorbyl Palmitate | liposoluble form of vitamin C
  MAGNESIUM_ASCORBYL_PHOSPHATE: 'magnesium-ascorbyl-phosphate', // INCI: Magnesium Ascorbyl Phosphate | stable vitamin C derivative
  SODIUM_ASCORBYL_PHOSPHATE: 'sodium-ascorbyl-phosphate', // INCI: Sodium Ascorbyl Phosphate | vitamin C derivative
  SODIUM_ASCORBATE: 'sodium-ascorbate', // INCI: Sodium Ascorbate | sodium salt of vitamin C, distinct from Ascorbic Acid
  THREE_O_ETHYL_ASCORBIC_ACID: '3-o-ethyl-ascorbic-acid', // INCI: 3-O-Ethyl Ascorbic Acid | stable and penetrating vitamin C derivative
  ASCORBYL_METHYLSILANOL_PECTINATE: 'ascorbyl-methylsilanol-pectinate', // INCI: Ascorbyl Methylsilanol Pectinate | vitamin C derivative
  OXIDIZED_GLUTATHIONE: 'oxidized-glutathione', // INCI: Oxidized Glutathione | oxidized glutathione, distinct from reduced glutathione
  TOCOPHEROL: 'tocopherol', // INCI: Tocopherol | pure vitamin E
  TOCOPHERYL_ACETATE: 'tocopheryl-acetate', // INCI: Tocopheryl Acetate | stable vitamin E ester
  TOCOPHERYL_GLUCOSIDE: 'tocopheryl-glucoside', // INCI: Tocopheryl Glucoside | hydrophilic vitamin E derivative
  CYANOCOBALAMIN: 'cyanocobalamin', // INCI: Cyanocobalamin | vitamin B12
  NAD: 'nad', // INCI: NAD+ | antioxidant coenzyme / cellular energy
  RIBOSE: 'ribose', // INCI: Ribose | cellular energy sugar
  COQ10: 'coq10', // INCI: Ubiquinone / Coenzyme Q10 | mitochondrial antioxidant
  ERGOTHIONEINE: 'ergothioneine', // INCI: Ergothioneine | potent and stable antioxidant
  RESVERATROL: 'resveratrol', // INCI: Resveratrol | antioxidant polyphenol
  CARNOSINE: 'carnosine', // INCI: Carnosine | antioxidant / anti-glycation dipeptide
  GREEN_TEA: 'green-tea', // INCI: Camellia Sinensis Leaf Extract | polyphenol antioxidant
  VACCINIUM_MYRTILLUS: 'vaccinium-myrtillus', // INCI: Vaccinium Myrtillus Fruit Extract (blueberry) | antioxidant
  HELICHRYSE_IMMORTELLE: 'helichryse-immortelle', // INCI: Helichrysum Italicum Flower Extract | antioxidant / regenerating
  CURCUMA_LONGA_ROOT_EXTRACT: 'curcuma-longa-root-extract', // INCI: Curcuma Longa (Turmeric) Root Extract | antioxidant
  ROMARIN: 'romarin', // INCI: Rosmarinus Officinalis (Rosemary) Leaf Extract | antioxidant
  SCHISANDRA: 'schisandra-sphenanthera', // INCI: Schisandra Sphenanthera Fruit Extract | adaptogen / antioxidant
  SCHISANDRA_CHINENSIS_FRUIT_EXTRACT: 'schisandra-chinensis-fruit-extract', // INCI: Schisandra Chinensis Fruit Extract | distinct Schisandra species
  CAESALPINIA_SPINOSA_FRUIT_EXTRACT: 'caesalpinia-spinosa-fruit-extract', // INCI: Caesalpinia Spinosa Fruit Extract | tara fruit extract, distinct from tara gum
  MALPIGHIA_GLABRA_FRUIT_WATER: 'malpighia-glabra-fruit-water', // INCI: Malpighia Glabra Fruit Water | acerola fruit water, distinct from an extract
  SALVIA_MILTIORRHIZA: 'salvia-miltiorrhiza', // INCI: Salvia Miltiorrhiza Root Extract (Chinese sage) | antioxidant
  PANAX_GINSENG: 'panax-ginseng', // INCI: Panax Ginseng Root Extract | adaptogen / antioxidant
  PLANKTON_EXTRACT: 'plankton-extract', // INCI: Plankton Extract | antioxidant / marine hydrating agent
  ASCOPHYLLUM_NODOSUM_EXTRACT: 'ascophyllum-nodosum-extract', // INCI: Ascophyllum Nodosum Extract | algae, antioxidant
  ASPARAGOPSIS_ARMATA_EXTRACT: 'asparagopsis-armata-extract', // INCI: Asparagopsis Armata Extract | red algae, anti-redness
  HUILE_ARGOUSIER: 'hippophae-rhamnoides', // INCI: Hippophae Rhamnoides Fruit Oil / Extract (sea buckthorn) | rich in antioxidants

  ASTAXANTHINE: 'astaxanthine', // INCI: Haematococcus Pluvialis Extract | algae rich in astaxanthin (potent antioxidant)
  HAEMATOCOCCUS_PLUVIALIS: 'astaxanthine', // Alias
  EPIGALLOCATECHIN_GALLATYL_GLUCOSIDE: 'egcg-glucoside', // INCI: Epigallocatechin Gallatyl Glucoside | stable EGCG
  PUNICA_GRANATUM: 'punica-granatum', // INCI: Punica Granatum Fruit Extract | pomegranate, anti-aging antioxidant
  VITAMIN_K1: 'vitamine-k1',
  FERULIC_ACID: 'ferulic-acid',
  ETHYL_FERULATE: 'ethyl-ferulate', // INCI: Ethyl Ferulate | liposoluble ferulic acid ester, antioxidant
  ETHYLHEXYL_FERULATE: 'ethylhexyl-ferulate', // INCI: Ethylhexyl Ferulate | branched ferulic acid ester, antioxidant
  ARGININE_FERULATE: 'arginine-ferulate', // INCI: Arginine Ferulate | water-soluble ferulate salt, antioxidant
  DIETHYLHEXYL_SYRINGYLIDENEMALONATE: 'diethylhexyl-syringylidenemalonate', // INCI: Diethylhexyl Syringylidenemalonate | formula-stabilizing antioxidant (Oxynex ST)
  TRIMETHOXYBENZYLIDENE_PENTANEDIONE: 'trimethoxybenzylidene-pentanedione', // INCI: Trimethoxybenzylidene Pentanedione | decolourised curcumin derivative, antioxidant
  HIBISCUS_SABDARIFFA: 'hibiscus-sabdariffa', // INCI: Hibiscus Sabdariffa Flower Extract | antioxidant, radiance, anti-aging
  BEET_ROOT_EXTRACT: 'beet-root-extract', // INCI: Beta Vulgaris Root Extract | beetroot, antioxidant betalains
  GARDENIA_FRUIT_EXTRACT: 'gardenia-fruit-extract', // INCI: Gardenia Jasminoides Fruit Extract | brightening / antioxidant
  GLYCERYL_ASCORBATE: '3-glyceryl-ascorbate', // INCI: 3-O-Glyceryl Ascorbate | stable and hydrophilic vitamin C derivative
  BENZOTRIAZOLYL_DODECYL_P_CRESOL: 'benzotriazolyl-dodecyl-p-cresol', // INCI: Benzotriazolyl Dodecyl p-Cresol (Tinogard TT) | formula-stabilizing antioxidant
  SUPEROXIDE_DISMUTASE: 'superoxide-dismutase', // INCI: Superoxide Dismutase / Super Oxide Dismutase | antioxidant enzyme, neutralizes superoxides
  SOPHORA_JAPONICA_FLOWER_EXTRACT: 'sophora-japonica-flower-extract', // INCI: Sophora Japonica Flower Extract | flavonoid-rich extract (rutin), antioxidant
  ASCORBYL_TETRAISOPALMITATE: 'ascorbyl-tetraisopalmitate', // INCI: Ascorbyl Tetraisopalmitate / Tetrahexyldecyl Ascorbate (alias: THDA / VC-IP) — ultra-stable liposoluble vitamin C derivative
  POLYGONUM_CUSPIDATUM_EXTRACT: 'polygonum-cuspidatum-extract', // INCI: Polygonum Cuspidatum Root Extract | natural source of resveratrol
  CISTUS_MONSPELIENSIS_EXTRACT: 'cistus-monspeliensis-extract', // INCI: Cistus Monspeliensis Extract | rock rose, Mediterranean antioxidant plant
  ACETYL_ZINGERONE: 'acetyl-zingerone', // INCI: Acetyl Zingerone | next-gen antioxidant (ginger), Vit C stabilizer
  GENISTEIN: 'genistein', // INCI: Genistein | soy isoflavone, phyto-estrogen-like antioxidant
  QUERCETIN: 'quercetin', // INCI: Quercetin / Quercetine | antioxidant flavonoid
  SILYBIN: 'silybin', // INCI: Silybin | milk-thistle flavonolignan, anti-aging / anti-redness
  HESPERIDIN_METHYL_CHALCONE: 'hesperidin-methyl-chalcone', // INCI: Hesperidin Methyl Chalcone | citrus flavonoid, venotonic
  DIMETHYLMETHOXYCHROMANOL: 'dimethylmethoxychromanol', // INCI: Dimethylmethoxy Chromanol (Lipochroman) | dual hydro/lipo-mode antioxidant
  TETRAHYDRODIFERULOYLMETHANE: 'tetrahydrodiferuloylmethane', // INCI: Tetrahydrodiferuloylmethane (THC) | tetrahydrocurcuminoid, anti-pigmentation
  NARINGENIN: 'naringenin', // INCI: Naringenin | citrus flavonoid, anti-redness partner to azelaic acid
  GLUCOSYLRUTIN: 'glucosylrutin', // INCI: Glucosylrutin / Glucosylrutine | stable glycosylated rutin
  RUTIN: 'rutin', // INCI: Rutin / Rutine | quercetin glycoside, venotonic antioxidant
  OLEA_EUROPAEA_LEAF_EXTRACT: 'olea-europaea-leaf-extract', // INCI: Olea Europaea (Olive) Leaf Extract | oleuropein-rich, distinct from olive fruit oil
  TERMINALIA_FERDINANDIANA_FRUIT_EXTRACT: 'terminalia-ferdinandiana-fruit-extract', // INCI: Terminalia Ferdinandiana Fruit Extract | Kakadu plum, vitamin C and ellagitannins
  GLYCINE_SOJA_SEED_EXTRACT: 'glycine-soja-seed-extract', // INCI: Glycine Soja (Soybean) Seed Extract | isoflavones and saponins, known allergen
  COFFEA_ARABICA_SEED_EXTRACT: 'coffea-arabica-seed-extract', // INCI: Coffea Arabica Seed Extract | green coffee bean, restores filaggrin and claudin-1
  // One slug for three organs: algo-derm holds a single record for the species and its own note
  // says the supporting studies mix leaf, seed and stamen, so a per-organ split would be fiction.
  NELUMBO_NUCIFERA: 'nelumbo-nucifera', // INCI: Nelumbo Nucifera Flower Extract / Nelumbo Nucifera Leaf Extract / Nelumbo Nucifera Root Extract | sacred lotus, tyrosinase-inhibiting
  PROPYL_GALLATE: 'propyl-gallate', // INCI: Propyl Gallate | antioxidant preservative, most reported gallate sensitizer
  SOY_ISOFLAVONES: 'soy-isoflavones', // INCI: Soy Isoflavones | genistein and daidzein, UVB photoprotective
  ROSA_CANINA_FRUIT_EXTRACT: 'rosa-canina-fruit-extract', // INCI: Rosa Canina Fruit Extract | rosehip pseudo-fruit, distinct from the seed oil
  CHRYSIN: 'chrysin', // INCI: Chrysin | antioxidant flavonoid, weak in vitro phototoxicity signal
  EPIGALLOCATECHIN_GALLATE: 'epigallocatechin-gallate', // INCI: Epigallocatechin Gallate | green tea catechin, sebum-reducing at 5 percent
  // The corpus spelling is `Flower/Leaf Extract`, which the slug-line parser reads as an alias
  // separator and would mint a bare `LEONTOPODIUM ALPINUM FLOWER` key from. Declaring the two
  // slash-free spellings instead; the combined one reaches this slug through the algo-derm bridge.
  LEONTOPODIUM_ALPINUM_EXTRACT: 'leontopodium-alpinum-extract', // INCI: Leontopodium Alpinum Extract / Leontopodium Alpinum Callus Culture Extract | edelweiss, antioxidant and barrier support
  CRITHMUM_MARITIMUM_EXTRACT: 'crithmum-maritimum-extract', // INCI: Crithmum Maritimum Extract | sea fennel, phenolic antioxidant
  TOCOTRIENOLS: 'tocotrienols', // INCI: Tocotrienols | unsaturated vitamin E form, lipophilic antioxidant
  ORYZANOL: 'oryzanol', // INCI: Oryzanol | rice bran ferulate esters, UV-absorbing but non-phototoxic
  CAMELLIA_OLEIFERA_LEAF_EXTRACT: 'camellia-oleifera-leaf-extract', // INCI: Camellia Oleifera Leaf Extract | tea leaf, distinct from the seed oil
  SOLANUM_MELONGENA_FRUIT_EXTRACT: 'solanum-melongena-fruit-extract', // INCI: Solanum Melongena Fruit Extract | eggplant anthocyanins
  // Two spellings of the same cacao seed extract; algo-derm holds one record for both.
  THEOBROMA_CACAO_EXTRACT: 'theobroma-cacao-extract', // INCI: Theobroma Cacao Seed Extract / Theobroma Cacao (Cocoa) Extract | cacao polyphenols and methylxanthines
  // Same for the bare and the leaf-qualified false daisy spelling.
  ECLIPTA_PROSTRATA_EXTRACT: 'eclipta-prostrata-extract', // INCI: Eclipta Prostrata Extract / Eclipta Prostrata Leaf Extract | false daisy, antioxidant
  VANILLA_PLANIFOLIA_FRUIT_EXTRACT: 'vanilla-planifolia-fruit-extract', // INCI: Vanilla Planifolia Fruit Extract | vanillin, keratinocyte ROS protection
  PAEONIA_SUFFRUTICOSA_ROOT_EXTRACT: 'paeonia-suffruticosa-root-extract', // INCI: Paeonia Suffruticosa Root Extract | tree peony, paeoniflorin
  LEPIDIUM_SATIVUM_SPROUT_EXTRACT: 'lepidium-sativum-sprout-extract', // INCI: Lepidium Sativum Sprout Extract | sinapoyl malate, UV-filter booster
  ZANTHOXYLUM_PIPERITUM_FRUIT_EXTRACT: 'zanthoxylum-piperitum-fruit-extract', // INCI: Zanthoxylum Piperitum Fruit Extract | Sichuan pepper, pungent constituents
  CYSTEINE: 'cysteine', // INCI: Cysteine | glutathione precursor amino acid
  SACCHAROMYCES_CEREVISIAE_EXTRACT: 'saccharomyces-cerevisiae-extract', // INCI: Saccharomyces Cerevisiae Extract | yeast beta-glucans
  LAMINARIA_SACCHARINA_EXTRACT: 'laminaria-saccharina-extract', // INCI: Laminaria Saccharina Extract | sugar kelp, phenolic antioxidant
  CHENOPODIUM_QUINOA_SEED_EXTRACT: 'chenopodium-quinoa-seed-extract', // INCI: Chenopodium Quinoa Seed Extract | quinoa saponins and phenolics
  VIOLA_TRICOLOR_EXTRACT: 'viola-tricolor-extract', // INCI: Viola Tricolor Extract | heartsease, cyclotides
  // Moved out of the supplements and haircare files: both are topical antioxidants here.
  BETA_CAROTENE: 'beta-carotene', // provitamin A carotenoid, antioxidant and tinting
  EUTERPE_OLERACEA_EXTRACT: 'euterpe-oleracea-extract', // acai, polyphenol antioxidant
  // add-to-db backlog, lot 2. Synthetic antioxidants, CIR-graded.
  HYDROXYACETOPHENONE: 'hydroxyacetophenone', // INCI: Hydroxyacetophenone | antioxidant, preservative booster
  BHT: 'bht', // INCI: BHT | phenolic antioxidant, EU concentration cap
  PENTAERYTHRITYL_TETRA_DI_T_BUTYL_HYDROXYHYDROCINNAMATE:
    'pentaerythrityl-tetra-di-t-butyl-hydroxyhydrocinnamate', // INCI: Pentaerythrityl Tetra-Di-T-Butyl Hydroxyhydrocinnamate | hindered-phenol formulation stabilizer
} as const

export const APAISANTS_ANTI_INFLAMMATOIRES = {
  SODIUM_DEXTRAN_SULFATE: 'sodium-dextran-sulfate', // INCI: Sodium Dextran Sulfate | soothing and vascular decongestant
  CENTELLA_ASIATICA: 'centella-asiatica', // INCI: Centella Asiatica Extract
  CENTELLA_COMPLEX: 'centella-complex', // Centella active complex
  MADECASSOSIDE: 'madecassoside', // INCI: Madecassoside | pure Centella triterpene
  ASIATICOSIDE: 'asiaticoside', // INCI: Asiaticoside | pure Centella compound
  ALOE_VERA: 'aloe-vera', // INCI: Aloe Barbadensis Leaf Juice / Extract
  AVENA_SATIVA: 'avena-sativa', // INCI: Avena Sativa (Oat) Kernel Extract | soothing beta-glucan
  // No `INCI:` marker: the organ slash would mint truncated keys. The bridge reaches it by
  // humanised slug equality against the algo-derm evidence `Avena Sativa Leaf/Stem Extract`.
  AVENA_SATIVA_LEAF_STEM_EXTRACT: 'avena-sativa-leaf-stem-extract', // aerial oat parts, not the kernel
  BETA_GLUCAN: 'beta-glucan', // INCI: Beta-Glucan | soothing / immunomodulator
  HEARTLEAF: 'heartleaf', // INCI: Houttuynia Cordata Extract | K-beauty anti-inflammatory
  HEARTLEAF_WATER: 'heartleaf-water', // INCI: Houttuynia Cordata Flower/Leaf/Stem Water | soothing distillate
  BISABOLOL: 'bisabolol', // INCI: Bisabolol | soothing, from chamomile
  ECTOIN: 'ectoin', // INCI: Ectoin | cell protector, anti-pollution, barrier-strengthening
  CALENDULA: 'calendula-officinalis', // INCI: Calendula Officinalis Flower Extract
  EXTRAIT_BARDANE: 'arctium-lappa-root-extract', // INCI: Arctium Lappa Root Extract | burdock, soothing, purifying (Asteraceae)
  BLEUET: 'bleuet', // INCI: Centaurea Cyanus Flower Water / Extract | cornflower, soothing for eyes

  MAUVE: 'mauve', // INCI: Malva Sylvestris Extract | softening, soothing
  PAQUERETTE: 'paquerette', // INCI: Bellis Perennis (Daisy) Flower Extract | soothing / brightening
  HAMAMELIS: 'hammamelis', // INCI: Hamamelis Virginiana (Witch Hazel) Water / Extract | astringent, soothing
  CUCUMBER_EXTRACT: 'cucumis-sativus-fruit-extract', // INCI: Cucumis Sativus Fruit Extract | decongestant, soothing
  PORTULACA_OLERACEA: 'portulaca-oleracea', // INCI: Portulaca Oleracea Extract | anti-inflammatory
  RHAMNOSE: 'rhamnose', // INCI: Rhamnose | sugar, sometimes anti-inflammatory
  MANGANESE_GLUCONATE: 'manganese-gluconate', // INCI: Manganese Gluconate | trace element, soothing
  EAU_DE_ROSE: 'eau-de-rose', // INCI: Rosa Damascena Flower Water | soothing, toning
  ROYAL_JELLY_EXTRACT: 'royal-jelly-extract', // INCI: Royal Jelly Extract | soothing / nourishing
  PROPOLIS: 'propolis-extract', // INCI: Propolis Extract | soothing / antioxidant / healing
  ZANTHOXYLUM_BUNGEANUM: 'zanthoxylum-bungeanum', // INCI: Zanthoxylum Bungeanum Fruit Extract | Sichuan pepper, anti-itch
  COLLOIDAL_OATMEAL: 'colloidal-oatmeal',
  EXTRAIT_CAMOMILLE: 'extrait-camomille',
  EXTRAIT_EPILOBE: 'extrait-epilobe',
  BOSWELLIA_SERRATA: 'boswellia-serrata', // INCI: Boswellia Serrata Gum/Extract | potent soothing agent
  ZINGIBER_OFFICINALE: 'zingiber-officinale', // INCI: Zingiber Officinale Root Extract | ginger, toning/antioxidant
  // Every spelling is declared in full: only the fruit one was, so the three others reached the
  // haircare twin through the algo-derm bridge and died on the domain guard. A direct index key
  // is looked up before the bridge, which is what makes this line win them back.
  // `Morinda Citrifolia Seed Oil` stays out on purpose: a seed oil is not a fruit extract, CosIng
  // separates them, and folding it in would rebuild the over-broad umbrella this line just fixed.
  MORINDA_CITRIFOLIA: 'morinda-citrifolia', // INCI: Morinda Citrifolia Fruit Extract / Morinda Citrifolia Extract / Morinda Citrifolia Callus Culture Lysate / Morinda Citrifolia Fruit Powder / Morinda Citrifolia Fruit Juice | Noni, protective/antioxidant
  GLYCYRRHETINIC_ACID: 'glycyrrhetinic-acid', // INCI: Glycyrrhetinic Acid (alias INN/BAN: Enoxolone), anti-inflammatory
  DIPOTASSIUM_GLYCYRRHIZATE: 'dipotassium-glycyrrhizate', // INCI: Dipotassium Glycyrrhizate | potent soothing agent from licorice
  NEUTRAZEN: 'neutrazen', // INCI: (specialized soothing component) | complex for reactive skin / rosacea
  SYMSITIVE: 'symsitive', // INCI: 4-t-Butylcyclohexanol | skin sensitivity regulator
  LICOCHALCONE_A: 'licochalcone-a', // INCI: Glycyrrhiza Inflata Root Extract | potent antioxidant and soothing agent from Chinese licorice
  ASTER_TRIPOLIUM: 'aster-tripolium', // INCI: Aster Tripolium Extract | sea aster, soothing and anti-redness
  SAMBUCUS_NIGRA: 'sambucus-nigra', // INCI: Sambucus Nigra Flower Extract | elderflower, soothing
  DAUCUS_CAROTA: 'daucus-carota', // INCI: Daucus Carota Sativa Root Extract | carrot, soothing
  ARTEMISIA_ANNUA: 'artemisia-annua', // INCI: Artemisia Annua Extract | soothing mugwort (K-beauty signature)
  GINKGO_BILOBA: 'ginkgo-biloba', // INCI: Ginkgo Biloba Leaf Extract | antioxidant / circulatory
  MALTOOLIGOSYL_GLUCOSIDE: 'maltooligosyl-glucoside', // INCI: Maltooligosyl Glucoside | biomimetic soothing polysaccharide (Rosactiv 2.0)
  METHYLHYDANTOIN_IMIDE: 'methylhydantoin-imide', // INCI: 1-Methylhydantoin-2-Imide | TRPV1 neuro-soothing active, sensory discomfort relief
  SWERTIA_CHIRATA: 'swertia-chirata', // INCI: Swertia Chirata Extract (swertiamarin) | soothing, Himalayan gentian
  SALICORNIA_HERBACEA: 'salicornia-herbacea', // INCI: Salicornia Herbacea Extract (Saliporine-8) | neurocosmetic soothing agent
  MAGNOLIA_OFFICINALIS_BARK_EXTRACT: 'magnolia-officinalis-bark-extract', // INCI: Magnolia Officinalis Bark Extract | honokiol and magnolol, documented contact allergen
  AMMONIUM_GLYCYRRHIZATE: 'ammonium-glycyrrhizate', // INCI: Ammonium Glycyrrhizate | licorice-derived salt of glycyrrhizic acid
  ALTHAEA_OFFICINALIS_ROOT_EXTRACT: 'althaea-officinalis-root-extract', // INCI: Althaea Officinalis Root Extract | marshmallow mucilage, demulcent
  HELICHRYSUM_ITALICUM_EXTRACT: 'helichrysum-italicum-extract', // INCI: Helichrysum Italicum Extract | immortelle, Asteraceae sensitization risk
  ECHINACEA_PURPUREA_EXTRACT: 'echinacea-purpurea-extract', // INCI: Echinacea Purpurea Extract | Asteraceae, restores epidermal barrier lipids
  ULMUS_DAVIDIANA_ROOT_EXTRACT: 'ulmus-davidiana-root-extract', // INCI: Ulmus Davidiana Root Extract | Korean elm root, K-beauty soothing
  LAMINARIA_JAPONICA_EXTRACT: 'laminaria-japonica-extract', // INCI: Laminaria Japonica Extract | brown kelp polysaccharides
  LAMINARIA_OCHROLEUCA_EXTRACT: 'laminaria-ochroleuca-extract', // INCI: Laminaria Ochroleuca Extract | golden kelp, profile close to L. japonica
  PUERARIA_LOBATA_ROOT_EXTRACT: 'pueraria-lobata-root-extract', // INCI: Pueraria Lobata Root Extract | kudzu isoflavones, puerarin
  LONICERA_JAPONICA_FLOWER_EXTRACT: 'lonicera-japonica-flower-extract', // INCI: Lonicera Japonica Flower Extract | honeysuckle, chlorogenic acid
  CLADOSIPHON_OKAMURANUS_EXTRACT: 'cladosiphon-okamuranus-extract', // INCI: Cladosiphon Okamuranus Extract | mozuku fucoidan
  PAEONIA_ALBIFLORA_ROOT_EXTRACT: 'paeonia-albiflora-root-extract', // INCI: Paeonia Albiflora Root Extract | white peony, benzoylpaeoniflorin
  ANTHEMIS_NOBILIS_FLOWER_EXTRACT: 'anthemis-nobilis-flower-extract', // INCI: Anthemis Nobilis Flower Extract | Roman chamomile, Asteraceae sensitization caution
  CENTELLA_ASIATICA_LEAF_WATER: 'centella-asiatica-leaf-water', // INCI: Centella Asiatica Leaf Water | botanical water, more dilute than the extract
  MENTHOXYPROPANEDIOL: 'menthoxypropanediol', // INCI: Menthoxypropanediol | TRPM8 cooling agent
  NASTURTIUM_OFFICINALE_EXTRACT: 'nasturtium-officinale-extract', // INCI: Nasturtium Officinale Extract | watercress, best-supported axis is soothing
} as const

export const ECLAIRCISSANTS_DEPIGMENTANTS = {
  ALPHA_ARBUTIN: 'alpha-arbutin', // INCI: Alpha-Arbutin | anti-dark-spot
  ARBUTIN: 'arbutin', // INCI: Arbutin | beta form, tyrosinase inhibitor, distinct molecule from alpha-arbutin
  TROPOLONE: 'tropolone', // INCI: Tropolone | copper-chelating tyrosinase inhibitor, RIFM photoirritant
  GLYCYRRHIZA_URALENSIS_ROOT_EXTRACT: 'glycyrrhiza-uralensis-root-extract', // INCI: Glycyrrhiza Uralensis Root Extract | licorice glabridin and liquiritin
  MORUS_NIGRA_FRUIT_EXTRACT: 'morus-nigra-fruit-extract', // INCI: Morus Nigra Fruit Extract | black mulberry, TMBC chalcone tyrosinase inhibitor
  KOJIC_ACID: 'kojic-acid', // INCI: Kojic Acid | tyrosinase inhibitor
  TRANEXAMIC_ACID: 'tranexamic-acid', // INCI: Tranexamic Acid | anti-spot, anti-inflammatory
  PHENYLETHYL_RESORCINOL: 'phenylethyl-resorcinol', // INCI: Phenylethyl Resorcinol | SymWhite 377
  SEPIWHITE: 'sepiwhite', // INCI: Undecylenoyl Phenylalanine | Sepiwhite™
  HEXYLRESORCINOL: 'hexylresorcinol', // INCI: Hexylresorcinol | brightening, tyrosinase inhibitor
  BUTYLRESORCINOL: 'butylresorcinol', // INCI: 4-Butylresorcinol | potent brightening agent, tyrosinase inhibitor
  REGLISSE: 'reglisse', // INCI: Glycyrrhiza Glabra (Licorice) Root Extract | brightening
  DIACETYL_BOLDINE: 'diacetyl-boldine', // INCI: Diacetyl Boldine | brightening / antioxidant
  GLUTATHION: 'glutathion', // INCI: Glutathione | major antioxidant, brightening
  MELITANE: 'melitane', // INCI: Acetyl Hexapeptide-1 | pro-pigmenting peptide (self-tanning)
  MELASYL: 'melasyl', // INCI: Melasyl | specific anti-dark-spot agent (patented)
  GALLYL_GLUCOSIDE: 'gallyl-glucoside', // INCI: Gallyl Glucoside | gallic acid derivative, antioxidant brightening
  IRIS_EXTRACT: 'iris-extract', // INCI: Iris Florentina Root Extract | natural brightening, depigmenting
} as const

export const ANTI_ACNE_SEBUM = {
  AZELAIC_ACID: 'azelaic-acid', // INCI: Azelaic Acid | anti-acne, anti-rosacea, brightening
  AZELOCALM: 'azelocalm', // INCI: Azelaic Acid (complexed variant) | soothed azelaic acid, better tolerance
  AZECOGLYCINE: 'azecoglycine', // INCI: Azelaic Acid + Glycine | synergistic anti-acne sebum-regulating complex
  SALICYLIC_ACID: 'salicylic-acid', // INCI: Salicylic Acid | BHA
  NIACINAMIDE: 'niacinamide', // INCI: Niacinamide | vitamin B3, multi-function / sebum regulator
  ACNESYL_X_PRO: 'acnesyl-x-pro', // Multi-active anti-acne complex | sebum control, antibacterial, anti-comedogenic
  ZINC_PCA: 'zinc-pca', // INCI: Zinc PCA | sebum regulator
  ZINC_GLUCONATE: 'zinc-gluconate', // INCI: Zinc Gluconate | anti-inflammatory / sebum regulator
  ZINC_LACTATE: 'zinc-lactate', // INCI: Zinc Lactate | sebum regulator, anti-blemish
  ZINC_SULFATE: 'zinc-sulfate', // INCI: Zinc Sulfate | astringent, antimicrobial, sebum regulator
  COPPER_SULFATE: 'copper-sulfate', // INCI: Copper Sulfate | antimicrobial, astringent
  COPPER_GLUCONATE: 'copper-gluconate', // INCI: Copper Gluconate | sebum regulator / antibacterial
  COPPER_PCA: 'copper-pca', // INCI: Copper PCA | copper salt of PCA, microbial and sebum regulator
  SULFUR: 'soufre', // INCI: Sulfur | keratolytic, anti-acne
  TEA_TREE: 'tea-tree', // INCI: Melaleuca Alternifolia Leaf Oil | natural antibacterial
  HYPOCHLOROUS_ACID: 'hypochlorous-acid', // INCI: Hypochlorous Acid | mild antiseptic
  PIROCTONE_OLAMINE: 'piroctone-olamine', // INCI: Piroctone Olamine | antifungal (anti-Malassezia), anti-dandruff
  COMEDOCLASTIN: 'comedoclastin', // Titrated Silybum marianum extract (Cleanance) | anti-comedogenic
  LENS_ESCULENTA_SEED_EXTRACT: 'lens-esculenta-seed-extract', // Lentil extract (Oil Control) | mattifying
  PEA_EXTRACT: 'pea-extract', // INCI: Pisum Sativum Extract | pea extract, mattifying / sebum
  SARCOSINE: 'sarcosine', // INCI: Sarcosine | anti-sebum amino acid, cleansing
  AMMONIUM_LACTATE: 'ammonium-lactate', // INCI: Ammonium Lactate | mild keratolytic, anti-acne
  AZELAMIDE_MEA: 'azelamide-mea', // INCI: Azelamide MEA | amide derivative of azelaic acid, soluble anti-blemish
  AZELAMIDOPROPYL_DIMETHYL_AMINE: 'azelamidopropyl-dimethyl-amine', // INCI: Azelamidopropyl Dimethyl Amine (Epi-On) | amine derivative of azelaic acid
  TRIETHYL_CITRATE: 'triethyl-citrate', // INCI: Triethyl Citrate | ester solvent, inhibits sebum-processing skin esterases
  SERENOA_SERRULATA_FRUIT_EXTRACT: 'serenoa-serrulata-fruit-extract', // INCI: Serenoa Serrulata Fruit Extract | saw palmetto, 5-alpha-reductase inhibition
  GARCINIA_MANGOSTANA_PEEL_EXTRACT: 'garcinia-mangostana-peel-extract', // INCI: Garcinia Mangostana Peel Extract | mangosteen xanthones
  // Moved out of the dental file, next to the other zinc salts already sitting here.
  ZINC_CITRATE: 'zinc-citrate', // INCI: Zinc Citrate | zinc salt, astringent and antimicrobial
  ZINC_CHLORIDE: 'zinc-chloride', // INCI: Zinc Chloride | astringent zinc salt
} as const

export const ANTI_ROSACEE_VASOCONSTRICTEURS = {
  BRIMONIDINE: 'brimonidine', // INCI: Brimonidine Tartrate | topical vasoconstrictor (Mirvaso®)
  OXYMETAZOLINE: 'oxymetazoline', // INCI: Oxymetazoline HCl | topical vasoconstrictor (Rhofade®)
  IVERMECTINE: 'ivermectine', // INCI: Ivermectin | anti-Demodex (Soolantra®)
  METRONIDAZOLE: 'metronidazole', // INCI: Metronidazole | antibiotic / anti-inflammatory (Rozex®)
  ANGIOPAUSINE: 'angiopausine', // Rosamed-specific active | anti-vascular-redness
  ENDOTHELYOL: 'endothelyol', // Endothelyol® component | vascular protection / photoprotection
  HYDROXYPHENYL_PROPAMIDOBENZOIC_ACID: 'hydroxyphenyl-propamidobenzoic-acid', // INCI: Hydroxyphenyl Propamidobenzoic Acid | anti-redness active (Symcalmin)
} as const

export const FILTRES_UV = {
  TITANIUM_DIOXIDE: 'titanium-dioxide', // Mineral filter
  ZINC_OXIDE: 'zinc-oxyde', // Mineral filter
  BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE: 'bis-ethylhexyloxyphenol-methoxyphenyl-triazine', // Tinosorb S
  DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE: 'diethylamino-hydroxybenzoyl-hexyl-benzoate', // Uvinul A Plus
  ETHYLHEXYL_TRIAZONE: 'ethylhexyl-triazone', // Uvinul T 150
  TRIASORB: 'triasorb', // Ultra broad-spectrum filter
  IRON_OXIDE: 'oxide-de-fer', // INCI: Iron Oxides | mineral pigments, visible-light / HEV protection
  // add-to-db backlog, lot 4. Distinct CAS/EC from Iron Oxides above (canonical_key CI 77491,
  // red): CI 77492 is the yellow oxide, CI 77499 the black, neither collapses to it.
  CI_77492: 'ci-77492', // INCI: CI 77492 | yellow iron oxide, mineral pigment
  CI_77499: 'ci-77499', // INCI: CI 77499 | black iron oxide, mineral pigment
  ALUMINUM_HYDROXIDE: 'aluminum-hydroxide', // INCI: Aluminum Hydroxide | inert mineral coating for UV filters, opacifier
  DROMETRIZOLE_TRISILOXANE: 'drometrizole-trisiloxane', // INCI: Drometrizole Trisiloxane | photostable UVA filter (Mexoryl XL)
  BUTYL_METHOXYDIBENZOYLMETHANE: 'butyl-methoxydibenzoylmethane', // INCI: Butyl Methoxydibenzoylmethane | UVA filter (Avobenzone)
  AVOBENZONE: 'butyl-methoxydibenzoylmethane', // Alias
  OCTOCRYLENE: 'octocrylene', // INCI: Octocrylene | stabilizing UVB filter
  HOMOSALATE: 'homosalate', // INCI: Homosalate | UVB filter
  // Octisalate is declared as an alias, not left in the gloss: US sunscreen labels use the USAN
  // name in their Active Ingredients block, and a parenthesised gloss is erased by the parser.
  ETHYLHEXYL_SALICYLATE: 'ethylhexyl-salicylate', // INCI: Ethylhexyl Salicylate / Octisalate | UVB filter
  ISOAMYL_P_METHOXYCINNAMATE: 'isoamyl-p-methoxycinnamate', // INCI: Isoamyl p-Methoxycinnamate | UVB filter (Amiloxate)
  ETHYLHEXYL_METHOXYCINNAMATE: 'ethylhexyl-methoxycinnamate', // INCI: Ethylhexyl Methoxycinnamate | UVB filter (Octinoxate)
  METHYLENE_BIS_BENZOTRIAZOLYL_TETRAMETHYLBUTYLPHENOL:
    'methylene-bis-benzotriazolyl-tetramethylbutylphenol', // Tinosorb M – UVA/UVB, mineral-like
  TRIS_BIPHENYL_TRIAZINE: 'tris-biphenyl-triazine', // Tinosorb A2B nano – broad spectrum
  DIETHYLHEXYL_BUTAMIDO_TRIAZONE: 'diethylhexyl-butamido-triazone', // INCI: Diethylhexyl Butamido Triazone | Uvasorb HEB – broad-spectrum UVB/UVA filter, very photostable
  ENSULIZOLE: 'ensulizole', // INCI: Phenylbenzimidazole Sulfonic Acid | water-soluble UVB filter (Ensulizole / PBSA)
  // The h-less spelling is the second most common in the corpus, not a one-off garble. The four
  // French translations of the same name stay out: a grammar word in the INCI segment drops the
  // whole declaration, so they are repaired at the source instead.
  TEREPHTHALYLIDENE_DICAMPHOR_SULFONIC_ACID: 'terephthalylidene-dicamphor-sulfonic-acid', // INCI: Terephthalylidene Dicamphor Sulfonic Acid / Terephtalylidene Dicamphor Sulfonic Acid | water-soluble UVA filter (Mexoryl SX, ecamsule)
  MEXORYL_400: 'methoxypropylamino-cyclohexenylidene-ethoxyethylcyanoacetate', // INCI: Methoxypropylamino Cyclohexenylidene Ethoxyethylcyanoacetate | long-UVA filter (Mexoryl 400)
  DISODIUM_PHENYL_DIBENZIMIDAZOLE_TETRASULFONATE: 'disodium-phenyl-dibenzimidazole-tetrasulfonate', // INCI: Disodium Phenyl Dibenzimidazole Tetrasulfonate | water-soluble UVA filter (Neo Heliopan AP)
  BENZOPHENONE_3: 'benzophenone-3', // INCI: Benzophenone-3 | UVB and short-UVA filter (Oxybenzone)
  BENZOPHENONE_4: 'benzophenone-4', // INCI: Benzophenone-4 | water-soluble filter (Sulisobenzone), also shields the formula
  BENZOPHENONE_5: 'benzophenone-5', // INCI: Benzophenone-5 | sodium salt of Benzophenone-4
  POLYSILICONE_15: 'polysilicone-15', // INCI: Polysilicone-15 | polymeric UVB filter (Parsol SLX)
  METHYLBENZYLIDENE_CAMPHOR: '4-methylbenzylidene-camphor', // INCI: 4-Methylbenzylidene Camphor | UVB filter, out of EU Annex VI since 2024/996
} as const

export const PROBIOTIQUES_PREBIOTIQUES_POSTBIOTIQUES = {
  PSEUDOALTEROMONAS_FERMENT: 'pseudoalteromonas-ferment', // INCI: Pseudoalteromonas Ferment Extract | marine postbiotic, hydrating and protective
  PROBIOTICS: 'probiotics', // Common INCI: Lactobacillus Ferment | living bacteria
  POSTBIOTICS: 'postbiotics', // Variable INCI (e.g. Lactobacillus Ferment Filtrate)
  ALPHA_GLUCAN_OLIGOSACCHARIDE: 'alpha-glucan-oligosaccharide', // INCI: Alpha-Glucan Oligosaccharide | prebiotic
  SNAIL_MUCIN: 'snail-secretion-filtrate', // INCI: Snail Secretion Filtrate | regenerating / hydrating
  D_SENSINOSE: 'd-sensinose', // Postbiotic active (Tolérance Control)
  AQUAPHILUS_DOLOMIAE_EXTRACT: 'aquaphilus-dolomiae-extract', // I-modulia (XeraCalm)
  AQUAPHILUS_DOLOMIAE_FERMENT_FILTRATE: 'aquaphilus-dolomiae-ferment-filtrate', // C+ Restore (Cicalfate+)
  VITREOSCILLA_FERMENT: 'vitreoscilla-ferment', // INCI: Vitreoscilla Ferment | soothing, repairing and fortifying bacterial ferment (postbiotic-like)
  FRUCTOOLIGOSACCHARIDES: 'fructooligosaccharides', // INCI: Fructooligosaccharides / Fructo-Oligosaccharides | prebiotic
  // The catalogue declares the purified fructan and its source extract as separate tokens, never
  // together. Both are aliased here so the fiche answers whichever one a formula lists.
  INULINE: 'inuline', // INCI: Inulin / Inuline / Cichorium Intybus Root Extract | prebiotic fructan, chicory its usual source
  MICROBIOTA_REGULATOR: 'microbiota-regulator', // Skin microbiome regulator | balances bacterial flora
  MELABIOME_XP: 'melabiome-xp', // Pre/postbiotic complex | microbiome rebalancing and protection
  GALACTOMYCES_FERMENT_FILTRATE: 'galactomyces-ferment-filtrate', // INCI: Galactomyces Ferment Filtrate | Pitera (SK-II), nutrient-rich ferment
  RAHNELLA_SOY_PROTEIN_FERMENT: 'rahnella-soy-protein-ferment', // INCI: Rahnella/Soy Protein Ferment | soy protein ferment postbiotic (Bio-Bustyl), skin support
  LACTOBACILLUS_FERMENT: 'lactobacillus-ferment', // INCI: Lactobacillus Ferment | probiotic ferment, soothing and barrier support
  LEUCONOSTOC_FERMENT_FILTRATE: 'leuconostoc-ferment-filtrate', // INCI: Leuconostoc Ferment Filtrate | radish-root ferment, hydrating and mild preservative
  SACCHAROMYCES_FERMENT_FILTRATE: 'saccharomyces-ferment-filtrate', // INCI: Saccharomyces Ferment Filtrate | yeast ferment, radiance and hydration
  BIFIDA_FERMENT_LYSATE: 'bifida-ferment-lysate', // INCI: Bifida Ferment Lysate | bifidobacterium postbiotic, barrier recovery
  LACTOBACILLUS_FERMENT_LYSATE: 'lactobacillus-ferment-lysate', // INCI: Lactobacillus Ferment Lysate | lactobacillus postbiotic, distinct from the ferment
  LACTOBACILLUS_EXTRACELLULAR_VESICLES: 'lactobacillus-extracellular-vesicles', // INCI: Lactobacillus Extracellular Vesicles | non-living vesicles, distinct from ferments and lysates
  SACCHAROMYCES_LYSATE_EXTRACT: 'saccharomyces-lysate-extract', // INCI: Saccharomyces Lysate Extract | yeast postbiotic lysate, distinct from the ferment filtrate
  // Lot 3 of the v27 candidate return, family E. Lactobacillus nu is the microorganism, not its
  // ferment (lactobacillus-ferment above) — same distinction as ferment vs. lysate vs. vesicles.
  LACTOBACILLUS: 'lactobacillus', // INCI: Lactobacillus | probiotic microorganism, distinct from Lactobacillus Ferment
  ALTEROMONAS_FERMENT_EXTRACT: 'alteromonas-ferment-extract', // INCI: Alteromonas Ferment Extract | marine postbiotic, skin conditioning
} as const

export const ACTIFS_ANTI_AGE_REPARATEURS = {
  ADENOSINE: 'adenosine', // Anti-wrinkle
  ASIATIC_ACID: 'asiatic-acid', // INCI: Asiatic Acid | TECA (madecassic + asiaticoside + asiatic acid) – signature Centella soothing agent
  MADECASSIC_ACID: 'madecassic-acid', // INCI: Madecassic Acid | Centella component, soothing and repairing
  ALLANTOIN: 'allantoin', // INCI: Allantoin | soothing, healing
  PANTHENOL: 'panthenol', // INCI: Panthenol | provitamin B5, soothing / hydrating
  // biome-ignore format: parser reads slug + INCI comment off one line, wrapping breaks it
  POTASSIUM_DIMETHICONE_PEG_7_PANTHENYL_PHOSPHATE: 'potassium-dimethicone-peg-7-panthenyl-phosphate', // INCI: Potassium Dimethicone PEG-7 Panthenyl Phosphate | panthenyl phosphate silicone derivative
  PHYTONADIONE_EPOXIDE: 'phytonadione-epoxide', // INCI: Phytonadione Epoxide | vitamin K1 epoxide, distinct from phytonadione
  CHARDON_MARIE: 'chardon-marie', // INCI: Silybum Marianum Seed Extract | declared seed extract
  SILYBUM_MARIANUM_EXTRACT: 'silybum-marianum-extract', // INCI: Silybum Marianum Extract | organ not specified
  SILYBUM_MARIANUM_FRUIT_EXTRACT: 'silybum-marianum-fruit-extract', // INCI: Silybum Marianum Fruit Extract | generic fruit extract
  SILYBUM_MARIANUM_SEED_OIL: 'silybum-marianum-seed-oil', // INCI: Silybum Marianum Seed Oil | seed oil, not extract
  SILYBUM_MARIANUM_ETHYL_ESTER: 'silybum-marianum-ethyl-ester', // INCI: Silybum Marianum Ethyl Ester | declared ester derivative
  HYDROXYPALMITOYL_SPHINGANINE: 'hydroxypalmitoyl-sphinganine', // INCI: Hydroxypalmitoyl Sphinganine | ceramide-like, strengthens the barrier
  TWO_OLEAMIDO_1_3_OCTADECANEDIOL: '2-oleamido-1-3-octadecanediol', // INCI: 2-Oleamido-1,3-Octadecanediol | biomimetic repairing lipid
  PROTEOGLYCAN_COMPLEX: 'proteoglycan-complex', // Proteoglycan complex | skin structure
  ACMELLA_OLERACEA_EXTRACT: 'acmella-oleracea-extract', // INCI: Acmella Oleracea Extract | natural lifting effect, plant "Botox-like"
  PHYTIC_ACID: 'phytic-acid', // INCI: Phytic Acid | antioxidant and metal chelator, mild anti-inflammatory
  CALCIUM_PANTOTHENATE: 'calcium-pantothenate', // INCI: Calcium Pantothenate | calcium salt of provitamin B5, soothing and repairing
  BIOTIN: 'biotin', // INCI: Biotin | topical vitamin B8, strengthens the skin barrier
  HYDROLYZED_LUPINE_PROTEIN: 'hydrolyzed-lupine-protein', // INCI: Hydrolyzed Lupine Protein | plant peptides, firmness
  TRIMETHOXYBENZYL_ACETYLSINAPATE: 'trimethoxybenzyl-acetylsinapate', // INCI: Trimethoxybenzyl Acetylsinapate | anti-glycation and photoprotective active
  ONOPORDUM_ACANTHIUM_EXTRACT: 'onopordum-acanthium-extract', // INCI: Onopordum Acanthium Extract | silver thistle, anti-glycation and anti-aging
  METHYLSILANOL_MANNURONATE: 'methylsilanol-mannuronate', // INCI: Methylsilanol Mannuronate | topical organosilicon (Algisium C), silicon skin support
  // Moved out of the supplements file: topical creatine is an energy-metabolism active, not a
  // sports supplement. The slug carries no suffix, so nothing about it reads as oral-only.
  CREATINE: 'creatine', // cellular energy buffer, supports keratinocyte metabolism
} as const

export const CIRCULATOIRE_DRAINAGE = {
  ESCIN: 'escin', // INCI: Escin | from horse chestnut, anti-edema / circulatory
  AESCULUS_HIPPOCASTANUM_SEED_EXTRACT: 'aesculus-hippocastanum-seed-extract', // INCI: Aesculus Hippocastanum Seed Extract | whole horse chestnut extract, escin-bearing
  RUSCUS_ACULEATUS: 'ruscus-aculeatus', // INCI: Ruscus Aculeatus Root Extract (butcher's broom) | venotonic
  CAFFEINE: 'caffeine', // INCI: Caffeine | lipolytic, decongestant
  ARNICA: 'arnica', // INCI: Arnica Montana Flower Extract | anti-bruising, circulatory
  CYPRES: 'cypres', // INCI: Cupressus Sempervirens | toning, circulatory and astringent
} as const

export const TENSIOACTIFS_NETTOYANTS = {
  COCO_GLUCOSIDE: 'coco-glucoside', // INCI: Coco-Glucoside | mild non-ionic surfactant
  DECYL_GLUCOSIDE: 'decyl-glucoside', // INCI: Decyl Glucoside | mild surfactant
  LAURYL_GLUCOSIDE: 'lauryl-glucoside', // INCI: Lauryl Glucoside | mild non-ionic surfactant
  SODIUM_LAUROYL_METHYL_ISETHIONATE: 'sodium-lauroyl-methyl-isethionate', // INCI: Sodium Lauroyl Methyl Isethionate | mild surfactant
  SODIUM_COCOYL_ISETHIONATE: 'sodium-cocoyl-isethionate', // INCI: Sodium Cocoyl Isethionate | mild coco-derived surfactant
  GLEDITSIA_TRIACANTHOS_SEED_EXTRACT: 'gleditsia-seed-extract', // INCI: Gleditsia Triacanthos Seed Extract | natural mild surfactant / thickener
  PEG_20_GLYCERYL_TRIISOSTEARATE: 'peg-20-glyceryl-triisostearate', // INCI: PEG-20 Glyceryl Triisostearate | oily emulsifier (cleansers)
  COCAMIDOPROPYL_HYDROXYSULTAINE: 'cocamidopropyl-hydroxysultaine', // INCI: Cocamidopropyl Hydroxysultaine | mild amphoteric surfactant
  CAPRYLOYL_GLYCINE: 'capryloyl-glycine', // INCI: Capryloyl Glycine | amino acid alkyl amide, mild antimicrobial, sebum regulator
  ISOPROPYL_ALCOHOL: 'isopropyl-alcohol', // INCI: Isopropyl Alcohol | volatile solvent and antiseptic
  SODIUM_C14_16_OLEFIN_SULFONATE: 'sodium-c14-16-olefin-sulfonate', // INCI: Sodium C14-16 Olefin Sulfonate | strong foaming anionic surfactant
  SODIUM_CETEARYL_SULFATE: 'sodium-cetearyl-sulfate', // INCI: Sodium Cetearyl Sulfate | anionic alkyl sulfate, emulsifying cleanser
  LAURETH_4: 'laureth-4', // INCI: Laureth-4 | low-mole ethoxylated lauryl alcohol, co-emulsifier
  // Slugs first declared in the haircare file. The `-hair` suffix records where the line was
  // written, not what the substance is: these are the same surfactants doing the same job in a
  // face or body cleanser. The suffix is a public URL, so it stays.
  SLES_HAIR: 'sles-hair', // INCI: Sodium Laureth Sulfate | ethoxylated lauryl sulfate, milder than SLS
  // Came from the dental file, where the domain guard could only reach 17 of the 25 products
  // carrying the token. sls-hair declares the same key from haircare, which is parsed later, so
  // this line now wins it and the shared canonical_key sends the tiebreak here too.
  SODIUM_LAURYL_SULFATE: 'sodium-lauryl-sulfate', // INCI: Sodium Lauryl Sulfate | strong anionic foaming surfactant
  AMMONIUM_LAURYL_SULFATE: 'ammonium-lauryl-sulfate', // ammonium variant of lauryl sulfate, anionic
  DISODIUM_LAURETH_SULFOSUCCINATE: 'disodium-laureth-sulfosuccinate', // mild sulfosuccinate surfactant
  SODIUM_LAUROYL_SARCOSINATE: 'sodium-lauroyl-sarcosinate', // sarcosine derivative, very mild
  SODIUM_COCOYL_GLUTAMATE: 'sodium-cocoyl-glutamate', // glutamic acid derivative, mild
  SODIUM_LAUROYL_GLUTAMATE: 'sodium-lauroyl-glutamate', // glutamate derivative, mild
  COCO_BETAINE: 'coco-betaine', // pure betaine, amphoteric co-surfactant
  GLYCOL_DISTEARATE: 'glycol-distearate', // crystalline pearlising agent, opacifier
  PEG_120_METHYL_GLUCOSE_DIOLEATE: 'peg-120-methyl-glucose-dioleate', // thickener for anionic systems
  // Lot 3 of the v27 candidate return, family C: coco-derived cleansers, same family as
  // sodium-coco-sulfate above (already resolved, out of this lot).
  POTASSIUM_COCOYL_GLYCINATE: 'potassium-cocoyl-glycinate', // INCI: Potassium Cocoyl Glycinate | mild amino acid surfactant
  SODIUM_COCOYL_ALANINATE: 'sodium-cocoyl-alaninate', // INCI: Sodium Cocoyl Alaninate | mild amino acid surfactant
  COCONUT_ACID: 'coconut-acid', // INCI: Coconut Acid | coconut-derived fatty acid, cleansing and emulsifying
  POTASSIUM_COCOATE: 'potassium-cocoate', // INCI: Potassium Cocoate | potassium soap of coconut fatty acids, cleansing and emulsifying
  // add-to-db backlog, lot 2.
  POTASSIUM_CETYL_PHOSPHATE: 'potassium-cetyl-phosphate', // INCI: Potassium Cetyl Phosphate | anionic phosphate ester emulsifier, common in sunscreens
} as const

export const TEXTURANTS_FONCTIONNELS = {
  SILICA: 'silica', // INCI: Silica | mattifying, texturizing
  HYDROCOLLOID: 'hydrocolloid', // INCI: Hydrocolloid | occlusive dressing
  ZEA_MAYS_STARCH: 'zea-mays-starch', // INCI: Zea Mays Starch | corn starch, texturizing / absorbent
  ORYZA_SATIVA: 'oryza-sativa', // INCI: Oryza Sativa (Rice) Starch / Extract | texturizing, soothing
  SPHINGOMONAS_FERMENT: 'sphingomonas-ferment-extract', // INCI: Sphingomonas Ferment Extract | natural thickener
  SALIX_NIGRA: 'salix-nigra', // INCI: Salix Nigra (Willow) Bark Extract | mild exfoliant / astringent
  CITRUS_AURANTIUM_DULCIS: 'citrus-aurantium-dulcis', // INCI: Citrus Aurantium Dulcis (Orange) Peel Extract / Oil
  VERVEINE: 'verveine', // INCI: Lippia Citriodora / Verbena Officinalis
  MENTHE_POIVREE: 'menthe-poivree', // INCI: Mentha Piperita (Peppermint) Oil / Extract | refreshing
  BIOSACCHARIDE_GUM_1: 'biosaccharide-gum-1', // INCI: Biosaccharide Gum-1 | film-forming exopolysaccharide, long-lasting hydration
  AHNFELTIA_CONCINNA: 'ahnfeltia-concinna', // INCI: Ahnfeltiopsis Concinna Extract | red algae, hydrating and film-forming
  CHARCOAL_POWDER: 'charcoal-powder', // INCI: Charcoal / Activated Charcoal | powerful absorbent, purifying, detoxifying
  // Moved out of the haircare file: its only carrier is a face sponge. Kept lowercase so it
  // mints no index key: charcoal-powder owns CHARCOAL, and skincare is parsed first.
  BAMBOU_CHARCOAL_HAIR: 'bambou-charcoal-hair', // bamboo-sourced charcoal, mild adsorbent
  KAOLIN: 'kaolin', // INCI: Kaolin | mineral clay, absorbent, purifying, texturizing (powder or suspension)
  BENTONITE: 'bentonite', // INCI: Bentonite | montmorillonite clay, powerful absorbent and purifying
  // add-to-db backlog. Inert plant-derived polysaccharide, CIR-graded very low dermal risk.
  MICROCRYSTALLINE_CELLULOSE: 'microcrystalline-cellulose', // INCI: Microcrystalline Cellulose | thickener, absorbent, bulking agent
  CORN_STARCH_MODIFIED: 'corn-starch-modified', // INCI: Corn Starch Modified / Distarch Phosphate | modified corn starch, mattifying absorbent texturizer
  BIOSACCHARIDE_GUM_4: 'biosaccharide-gum-4', // INCI: Biosaccharide Gum-4 | biotech polysaccharide, anti-pollution
  AMMONIUM_ACRYLOYLDIMETHYLTAURATE_VP_COPOLYMER: 'ammonium-acryloyldimethyltaurate-vp-copolymer', // INCI: Ammonium Acryloyldimethyltaurate/VP Copolymer | rheology gelling agent (Aristoflex AVC)
  CHITOSAN: 'chitosan', // INCI: Chitosan | deacetylated chitin biopolymer, film-forming humectant
  // add-to-db backlog, lot 4.
  ACACIA_SENEGAL_GUM: 'acacia-senegal-gum', // INCI: Acacia Senegal Gum | gum arabic, natural film-forming thickener
  // Aromatic and citrus oils live here alongside the existing menthe-poivree / verveine entries.
  // Bergamot carries two spellings for one material: the oil always comes from the peel.
  CITRUS_AURANTIUM_BERGAMIA_PEEL_OIL: 'citrus-aurantium-bergamia-peel-oil', // INCI: Citrus Aurantium Bergamia Peel Oil / Citrus Aurantium Bergamia Fruit Oil | bergamot, furocoumarin-bearing
  CITRUS_LIMON_PEEL_OIL: 'citrus-limon-peel-oil', // INCI: Citrus Limon Peel Oil | lemon peel oil, limonene rich
  CITRUS_PARADISI_PEEL_OIL: 'citrus-paradisi-peel-oil', // INCI: Citrus Paradisi Peel Oil | grapefruit peel oil
  CITRUS_GRANDIS_PEEL_OIL: 'citrus-grandis-peel-oil', // INCI: Citrus Grandis Peel Oil | pomelo peel oil
  CITRUS_NOBILIS_PEEL_OIL: 'citrus-nobilis-peel-oil', // INCI: Citrus Nobilis Peel Oil | mandarin peel oil
  // One species, four materials. algo-derm's stripBotanicalParts folds the organ away, so without
  // a direct index key every spelling lands on whichever slug exists: neroli was resolving to the
  // peel oil. Declaring each organ makes the key direct, which is looked up before the bridge.
  // `Citrus Aurantium Amara Oil`, with no organ, stays on the bridge: the NEROLI and BITTER ORANGE
  // spellings normalise to the same key (1 product each) so no declaration can separate them.
  CITRUS_AURANTIUM_AMARA_PEEL_OIL: 'citrus-aurantium-amara-peel-oil', // INCI: Citrus Aurantium Amara Peel Oil | bitter orange peel oil
  CITRUS_AURANTIUM_AMARA_FLOWER_OIL: 'citrus-aurantium-amara-flower-oil', // INCI: Citrus Aurantium Amara Flower Oil | neroli
  CITRUS_AURANTIUM_AMARA_LEAF_OIL: 'citrus-aurantium-amara-leaf-oil', // INCI: Citrus Aurantium Amara Leaf Twig Oil / Citrus Aurantium Amara Leaf Twig Extract | petitgrain
  CITRUS_AURANTIUM_AMARA_FLOWER_WATER: 'citrus-aurantium-amara-flower-water', // INCI: Citrus Aurantium Amara Flower Water / Citrus Aurantium Amara Flower Extract | orange blossom water
  ROSMARINUS_OFFICINALIS_LEAF_OIL: 'rosmarinus-officinalis-leaf-oil', // INCI: Rosmarinus Officinalis Leaf Oil | rosemary oil, camphor and cineole
  POGOSTEMON_CABLIN_OIL: 'pogostemon-cablin-oil', // INCI: Pogostemon Cablin Oil | patchouli oil
  EUCALYPTUS_GLOBULUS_LEAF_OIL: 'eucalyptus-globulus-leaf-oil', // INCI: Eucalyptus Globulus Leaf Oil | eucalyptus oil, cineole rich
  ANTHEMIS_NOBILIS_FLOWER_OIL: 'anthemis-nobilis-flower-oil', // INCI: Anthemis Nobilis Flower Oil | Roman chamomile oil, esters of angelic acid
  CANANGA_ODORATA_FLOWER_OIL: 'cananga-odorata-flower-oil', // INCI: Cananga Odorata Flower Oil | ylang-ylang oil
  LITSEA_CUBEBA_FRUIT_OIL: 'litsea-cubeba-fruit-oil', // INCI: Litsea Cubeba Fruit Oil | may chang oil, citral rich
  LAVANDULA_HYBRIDA_OIL: 'lavandula-hybrida-oil', // INCI: Lavandula Hybrida Oil | lavandin oil, camphor bearing
  HELICHRYSUM_ITALICUM_FLOWER_OIL: 'helichrysum-italicum-flower-oil', // INCI: Helichrysum Italicum Flower Oil | immortelle oil, distinct from the extract
  MENTHA_VIRIDIS_LEAF_OIL: 'mentha-viridis-leaf-oil', // INCI: Mentha Viridis Leaf Oil | spearmint oil, carvone rich, low menthol
  // `Cedrus Atlantica Oil/Extract` (29 products) cannot be declared here: `/` is the alias
  // separator, so the line mints `CEDRUS ATLANTICA OIL` and an invented `… BARK EXTRACT`, never
  // the corpus key `CEDRUS ATLANTICA OIL/EXTRACT`. Same for Cananga Odorata. Measured 2026-07-29,
  // see the Groupe 4 investigation in sessions/algo-derm-candidates-triage.md.
  CEDRUS_ATLANTICA_BARK_OIL: 'cedrus-atlantica-bark-oil', // INCI: Cedrus Atlantica Bark Oil | atlas cedarwood oil
  SALVIA_OFFICINALIS_OIL: 'salvia-officinalis-oil', // INCI: Salvia Officinalis Oil | common sage oil, thujone bearing
  ROSA_DAMASCENA_FLOWER_OIL: 'rosa-damascena-flower-oil', // INCI: Rosa Damascena Flower Oil | damask rose otto
  SALVIA_SCLAREA_OIL: 'salvia-sclarea-oil', // INCI: Salvia Sclarea Oil | clary sage oil, linalyl acetate rich
  VETIVERIA_ZIZANOIDES_ROOT_OIL: 'vetiveria-zizanoides-root-oil', // INCI: Vetiveria Zizanoides Root Oil | vetiver root oil
  PINUS_SYLVESTRIS_LEAF_OIL: 'pinus-sylvestris-leaf-oil', // INCI: Pinus Sylvestris Leaf Oil | scots pine needle oil, oxidation-sensitive
  SANTALUM_ALBUM_OIL: 'santalum-album-oil', // INCI: Santalum Album Oil | indian sandalwood oil
  BOSWELLIA_CARTERII_OIL: 'boswellia-carterii-oil', // INCI: Boswellia Carterii Oil | frankincense resin oil
  ELETTARIA_CARDAMOMUM_SEED_OIL: 'elettaria-cardamomum-seed-oil', // INCI: Elettaria Cardamomum Seed Oil | cardamom seed oil
  ANIBA_ROSAEODORA_WOOD_OIL: 'aniba-rosaeodora-wood-oil', // INCI: Aniba Rosaeodora Wood Oil / Rose Wood Oil | rosewood oil, linalool rich
  CHAMOMILLA_RECUTITA_FLOWER_OIL: 'chamomilla-recutita-flower-oil', // INCI: Chamomilla Recutita Flower Oil | german chamomile oil, chamazulene
  MENTHA_ARVENSIS_LEAF_OIL: 'mentha-arvensis-leaf-oil', // INCI: Mentha Arvensis Leaf Oil | cornmint oil, menthol rich
  // One declaration used to carry both the oil and the molecule, so a single fiche answered
  // for two substances algo-derm grades apart. Split: the oil keeps the historical slug, the
  // fragrance molecule gets its own. Both live here: the corpus is overwhelmingly non-dental.
  CLOVE_OIL_EUGENOL: 'clove-oil-eugenol', // INCI: Eugenia Caryophyllus Bud Oil | clove bud oil
  EUGENOL: 'eugenol', // INCI: Eugenol | clove-derived fragrance molecule, EU-declarable
  EUGENIA_CARYOPHYLLUS_EXTRACT: 'eugenia-caryophyllus-extract', // INCI: Eugenia Caryophyllus Clove Flower Extract / Eugenia Caryophyllus Flower Extract / Eugenia Caryophyllus Bud Extract | clove flower or bud extract
  // Thickeners, mineral abrasives and one pearl pigment, moved out of the haircare and dental
  // files. A cellulose gum gels a serum the way it gels a toothpaste.
  CELLULOSE_GUM_DENTAL: 'cellulose-gum-dental', // INCI: Cellulose Gum (CMC) | very widespread cellulosic thickener
  CARRAGEENAN_DENTAL: 'carrageenan-dental', // INCI: Carrageenan | marine gelling agent
  SODIUM_ALGINATE_HAIR: 'sodium-alginate-hair', // algal gelling agent
  HYDROXYPROPYL_GUAR: 'hydroxypropyl-guar', // non-ionic guar, slip and texture
  HYDROXYPROPYL_CYCLODEXTRIN: 'hydroxypropyl-cyclodextrin', // delivery complex, solubilises lipophilic actives
  MICA_HAIR: 'mica-hair', // mineral pearl pigment, satin finish
  HYDRATED_SILICA: 'hydrated-silica', // INCI: Hydrated Silica | mild abrasive, also a texturizer
  CALCIUM_CARBONATE: 'calcium-carbonate-dental', // INCI: Calcium Carbonate | natural abrasive and filler
  SODIUM_BICARBONATE_DENTAL: 'sodium-bicarbonate-dental', // INCI: Sodium Bicarbonate | mild abrasive, buffers acidity
  // Never declared in any slug file: the domain map gave it no domain, so the guard dropped it
  // in every category. Synthetic rheology polymer, distinct INCI from the VP copolymer above.
  AMMONIUM_POLYACRYLOYLDIMETHYL_TAURATE: 'ammonium-polyacryloyldimethyl-taurate', // INCI: Ammonium Polyacryloyldimethyl Taurate | rheology gelling agent
  // add-to-db backlog, lot 2.
  POLYISOBUTENE: 'polyisobutene', // INCI: Polyisobutene | synthetic hydrocarbon polymer, film-forming, no benefit axis scored
  POLYACRYLATE_CROSSPOLYMER_6: 'polyacrylate-crosspolymer-6', // INCI: Polyacrylate Crosspolymer-6 | cross-linked acrylate thickener, cold-process emulsion stabilizer
  // add-to-db backlog, lot 3.
  DISTEARDIMONIUM_HECTORITE: 'disteardimonium-hectorite', // INCI: Disteardimonium Hectorite | modified clay, rheology modifier for oil-rich formulas
  // add-to-db backlog, lot 5.
  MAGNESIUM_SULFATE: 'magnesium-sulfate', // INCI: Magnesium Sulfate | inert mineral salt (Epsom salt), bulking/viscosity adjuster
} as const

export const DIVERS_NON_CLASSES = {
  // v27 candidate return, written as Aurore identity-only fiches after the v28 adoption.
  // Keep the generic citrus and the Chondrus powder distinct: collapsing either would publish
  // a more specific material than the INCI token actually identifies.
  CITRUS_AURANTIUM_PEEL_OIL_GENERIC: 'citrus-aurantium-peel-oil-generic', // INCI: Citrus Aurantium Peel Oil | variety indeterminate
  COCOS_NUCIFERA_FRUIT_EXTRACT: 'cocos-nucifera-fruit-extract', // INCI: Cocos Nucifera Fruit Extract | distinct from coconut oil
  JUNIPERUS_VIRGINIANA_OIL: 'juniperus-virginiana-oil', // INCI: Juniperus Virginiana Oil | Virginia cedarwood oil
  SACCHARUM_OFFICINARUM_EXTRACT: 'saccharum-officinarum-extract', // INCI: Saccharum Officinarum Extract | sugarcane extract
  PRUNUS_DOMESTICA_SEED_OIL: 'prunus-domestica-seed-oil', // INCI: Prunus Domestica Seed Oil | plum seed oil
  MEDICAGO_SATIVA_EXTRACT: 'medicago-sativa-extract', // INCI: Medicago Sativa Extract | alfalfa extract
  CERATONIA_SILIQUA_GUM: 'ceratonia-siliqua-gum', // INCI: Ceratonia Siliqua Gum | carob gum
  CHONDRUS_CRISPUS_POWDER: 'chondrus-crispus-powder', // INCI: Chondrus Crispus Powder | abrasive powder, not the extract
  RUBUS_IDAEUS_SEED_OIL: 'rubus-idaeus-seed-oil', // INCI: Rubus Idaeus Seed Oil | distinct from fruit extract
  MALACHITE_EXTRACT: 'malachite-extract', // INCI: Malachite Extract | mineral-derived extract

  // Lot 2 of the same v27 candidate return: family A (polyglyceryl esters) and B (alkanes).
  // Numbers are part of the INCI identity: polyglyceryl-2 is not polyglyceryl-20, same trap as
  // Acetyl Hexapeptide-3 / -37.
  POLYGLYCERYL_4_OLEATE: 'polyglyceryl-4-oleate', // INCI: Polyglyceryl-4 Oleate | emulsifier
  POLYGLYCERYL_3_POLYRICINOLEATE: 'polyglyceryl-3-polyricinoleate', // INCI: Polyglyceryl-3 Polyricinoleate | emulsifier, viscosity controlling
  POLYGLYCERYL_2_TRIISOSTEARATE: 'polyglyceryl-2-triisostearate', // INCI: Polyglyceryl-2 Triisostearate | emulsifier
  POLYGLYCERYL_2_DIISOSTEARATE: 'polyglyceryl-2-diisostearate', // INCI: Polyglyceryl-2 Diisostearate | emulsifier
  POLYGLYCERYL_6_LAURATE: 'polyglyceryl-6-laurate', // INCI: Polyglyceryl-6 Laurate | emulsifier
  POLYGLYCERYL_6_DISTEARATE: 'polyglyceryl-6-distearate', // INCI: Polyglyceryl-6 Distearate | emulsifier
  POLYGLYCERYL_2_STEARATE: 'polyglyceryl-2-stearate', // INCI: Polyglyceryl-2 Stearate | emulsifier
  // add-to-db backlog, not the v27 return: higher polymerisation degree than the polyglyceryl-2/
  // 3/4/6 esters above, CIR-graded mild surfactant/solubilizer rather than a coverage stub.
  POLYGLYCERYL_10_LAURATE: 'polyglyceryl-10-laurate', // INCI: Polyglyceryl-10 Laurate | mild non-ionic surfactant, solubilizer
  // add-to-db backlog, lot 5.
  POLYGLYCERYL_3_METHYLGLUCOSE_DISTEARATE: 'polyglyceryl-3-methylglucose-distearate', // INCI: Polyglyceryl-3 Methylglucose Distearate | mild emulsifier, natural-marketed formulas
  // Tridecane and undecane are near-always co-listed as a plant-derived pair, but CosIng grades
  // them under different functions (perfuming vs. emollient) — that gap comes from the export,
  // not from Aurore's read, and is left unsmoothed in the fiches.
  TRIDECANE: 'tridecane', // INCI: Tridecane | C13 alkane, perfuming per CosIng
  UNDECANE: 'undecane', // INCI: Undecane | C11 alkane, skin conditioning / emollient per CosIng
  C9_12_ALKANE: 'c9-12-alkane', // INCI: C9-12 Alkane | solvent
  COCONUT_ALKANES: 'coconut-alkanes', // INCI: Coconut Alkanes | emollient, solvent

  // Lot 4 of the same v27 candidate return: family F (esters and emollients, minus
  // isoamyl-laurate and propylheptyl-caprylate above, already declared 2026-07-31), family I
  // (silicone / cationic polymer) and family J (generic vegetable oil).
  BIS_DIGLYCERYL_POLYACYLADIPATE_2: 'bis-diglyceryl-polyacyladipate-2', // INCI: Bis-Diglyceryl Polyacyladipate-2 | polymeric emollient ester
  SORBITAN_PALMITATE: 'sorbitan-palmitate', // INCI: Sorbitan Palmitate | non-ionic emulsifier
  // Pigment surface-treatment agent, near-exclusive to sunscreens and tinted formulas: the
  // interest is co-occurrence with UV filters, not a dermal axis of its own.
  ISOPROPYL_TITANIUM_TRIISOSTEARATE: 'isopropyl-titanium-triisostearate', // INCI: Isopropyl Titanium Triisostearate | titanium dioxide surface-treatment agent, emollient/emulsifier
  GLYCERYL_UNDECYLENATE: 'glyceryl-undecylenate', // INCI: Glyceryl Undecylenate | undecylenic acid glyceryl ester, emollient/emulsifier
  SODIUM_STEAROYL_LACTYLATE: 'sodium-stearoyl-lactylate', // INCI: Sodium Stearoyl Lactylate | anionic emulsifier
  SUCROSE_LAURATE: 'sucrose-laurate', // INCI: Sucrose Laurate | sugar ester, mild cleansing/emulsifying, distinct from sucrose-stearate
  // Ester of lauroyl sarcosine, distinct from sodium-lauroyl-sarcosinate above: different cation
  // and different esterifying alcohol.
  ISOPROPYL_LAUROYL_SARCOSINATE: 'isopropyl-lauroyl-sarcosinate', // INCI: Isopropyl Lauroyl Sarcosinate | sarcosinate ester, skin conditioning
  // Long combined form, distinct from both hydroxypropyl-guar (line above, TEXTURANTS_FONCTIONNELS)
  // and guar-hydroxypropyltrimonium-chloride (haircare): three separate INCI identities.
  // biome-ignore format: parser reads slug + INCI comment off one line, wrapping breaks it
  HYDROXYPROPYL_GUAR_HYDROXYPROPYLTRIMONIUM_CHLORIDE: 'hydroxypropyl-guar-hydroxypropyltrimonium-chloride', // INCI: Hydroxypropyl Guar Hydroxypropyltrimonium Chloride | cationic guar, antistatic/conditioning
  VINYL_DIMETHICONE: 'vinyl-dimethicone', // INCI: Vinyl Dimethicone | silicone, viscosity controlling
  // add-to-db backlog, lot 5. One official CosIng identity carrying an internal slash, not an
  // alias list — no `INCI:` marker, same trap as the family-G entries below (a marker would mint
  // a truncated `DIMETHICONE` key). Distinct from vinyl-dimethicone above.
  DIMETHICONE_VINYL_DIMETHICONE_CROSSPOLYMER: 'dimethicone-vinyl-dimethicone-crosspolymer', // silicone elastomer gel, soft-focus texturizer
  OLUS_OIL: 'olus-oil', // INCI: Olus Oil | vegetable-oil blend of unspecified composition, emollient

  // Lot 5 of the same v27 candidate return: family G (compound INCI with an internal slash),
  // family H (simple molecules) and family K (below-threshold, treated with the lot). The two
  // Eugenia Caryophyllus tokens of family K (Flower Extract, Bud Extract) are out of this lot:
  // D1 (2026-08-07, commit fa9bdabc) already merged both onto eugenia-caryophyllus-extract with
  // canonical_key intentionally NULL, superseding the split this doc used to call for.
  // No `INCI:` marker on the three family-G entries below and the family-K Tocopheryl one: each
  // name is one official CosIng identity carrying an internal slash, not an alias list, so a
  // marker would mint a truncated key (same trap as Cedrus Atlantica / Avena Sativa Leaf/Stem
  // Extract above). The bridge reaches them by humanised slug equality instead.
  PHYTOSTERYL_ISOSTEARYL_CETYL_STEARYL_BEHENYL_DIMER_DILINOLEATE:
    'phytosteryl-isostearyl-cetyl-stearyl-behenyl-dimer-dilinoleate', // hair/skin conditioning polymer ester
  OLEIC_LINOLEIC_LINOLENIC_POLYGLYCERIDES: 'oleic-linoleic-linolenic-polyglycerides', // polyglyceryl ester of unsaturated fatty acids, emulsifier
  CASTOR_OIL_IPDI_COPOLYMER: 'castor-oil-ipdi-copolymer', // film-forming castor oil / isophorone diisocyanate copolymer
  TRIHEPTANOIN: 'triheptanoin', // INCI: Triheptanoin | branched-chain medium triglyceride, emollient
  DEXTRAN: 'dextran', // INCI: Dextran | bacterial polysaccharide, binder/thickener, distinct from sodium-dextran-sulfate
  GLYCOLIPIDS: 'glycolipids', // INCI: Glycolipids | CosIng class name, not a single defined species
  TOCOPHERYL_LINOLEATE_OLEATE: 'tocopheryl-linoleate-oleate', // vitamin E ester blend, distinct from Tocopheryl Linoleate alone (CAS 36148-84-2)
  KOJIC_DIPALMITATE: 'kojic-dipalmitate', // INCI: Kojic Dipalmitate | lipophilic kojic acid ester, distinct from kojic-acid
  DIMETHYLMETHOXY_CHROMANYL_PALMITATE: 'dimethylmethoxy-chromanyl-palmitate', // INCI: Dimethylmethoxy Chromanyl Palmitate | substituted chroman ester
  // Absent from the 2020 CosIng snapshot algo-derm indexes (secondClass identity, no cosingRef):
  // likely a newer INCI or a supplier delivery-system name. Distinct from centella-asiatica above.
  CENTELLA_ASIATICA_VESICLES: 'centella-asiatica-vesicles', // INCI: Centella Asiatica (Indian Pennywort) Vesicles | vesicular delivery form

  HUMECTANTS_EMOLLIENTS_OCCLUSIFS: 'humectants-emollients-occlusifs', // General category
  PEPTIDES: 'peptides', // General category
  BIXA_ORELLANA: 'bixa-orellana', // INCI: Bixa Orellana Seed Extract / Annatto | source of bixin (natural dye)
  AMARANTHUS_CAUDATUS: 'amaranthus', // INCI: Amaranthus Caudatus Seed Extract
  OPHIOPOGON_JAPONICUS: 'ophiopogon-japonicus', // INCI: Ophiopogon Japonicus Root Extract (mondo grass)
  ISOSORBIDE_DICAPRYLATE: 'isosorbide-dicaprylate', // INCI: Isosorbide Dicaprylate | smart lipophilic humectant
  RICE_AMINO_ACIDS: 'rice-amino-acids', // INCI: Rice Amino Acids | rice amino acids, conditioning
  HUILE_BABASSU: 'huile-babassu', // INCI: Orbignya Oleifera Seed Oil | babassu oil, light emollient
  PINUS_PALUSTRIS: 'pinus-palustris', // INCI: Pinus Palustris Leaf Extract | pine, toning antioxidant
  VETIVERIA_ZIZANOIDES: 'vetiveria-zizanoides', // INCI: Vetiveria Zizanoides Root Extract | vetiver, soothing regenerating
  APHANIZOMENON_FLOS_AQUAE: 'aphanizomenon-flos-aquae', // INCI: Aphanizomenon Flos-Aquae Extract | nutritive blue-green algae
  ULVA_LACTUCA: 'ulva-lactuca', // INCI: Ulva Lactuca Extract | sea lettuce, rich in magnesium and elastin-like compounds (suppleness)
  CHLORELLA_VULGARIS: 'chlorella-vulgaris', // INCI: Chlorella Vulgaris Extract | green microalgae, dark-circle corrector and restructuring
  SPIRULINA_PLATENSIS: 'spirulina-platensis', // INCI: Spirulina Platensis Extract | blue microalgae, protein-rich superfood, revitalizing
  DUNALIELLA_SALINA: 'dunaliella-salina', // INCI: Dunaliella Salina Extract | orange microalgae, very rich in beta-carotene (glow effect and antioxidant)
  CHONDRUS_CRISPUS: 'chondrus-crispus', // INCI: Chondrus Crispus Extract | Irish moss, protective film-forming and natural gelling agent
  PALMARIA_PALMATA: 'palmaria-palmata', // INCI: Palmaria Palmata Extract | Dulse, toning, promotes microcirculation (complexion radiance)
  JANIA_RUBENS: 'jania-rubens', // INCI: Jania Rubens Extract | calcareous red algae, ultra-hydrating and cellular "anti-fatigue"
  LAMINARIA_DIGITATA: 'laminaria-digitata', // INCI: Laminaria Digitata Extract | brown algae, remineralizing and hydrating (rich in alginates)
  FUCUS_VESICULOSUS: 'fucus-vesiculosus', // INCI: Fucus Vesiculosus Extract | brown algae, detoxifying and draining (often used around the eye contour)
  ALARIA_ESCULENTA: 'alaria-esculenta', // INCI: Alaria Esculenta Extract | brown algae, collagen and elastin booster (firmness)
  UNDARIA_PINNATIFIDA: 'undaria-pinnatifida', // INCI: Undaria Pinnatifida Extract | Wakame, protects the extracellular matrix, antioxidant
  NMN: 'nmn',
  SPINACIA_OLERACEA: 'spinacia-oleracea', // INCI: Spinacia Oleracea Leaf Extract | spinach, anti-pollution antioxidant
  TARAXACUM_OFFICINALE: 'taraxacum-officinale', // INCI: Taraxacum Officinale Leaf Extract | dandelion, anti-pollution detoxifier
  ARISTOTELIA_CHILENSIS: 'aristotelia-chilensis', // INCI: Aristotelia Chilensis Fruit Extract | maqui berry, potent antioxidant
  TEPHROSIA_PURPUREA: 'tephrosia-purpurea', // INCI: Tephrosia Purpurea Seed Extract | urban anti-pollution
  AVENE_THERMAL_SPRING_WATER: 'avene-thermal-spring-water', // Avène thermal spring water | soothing, anti-irritant
  URIAGE_THERMAL_SPRING_WATER: 'uriage-thermal-spring-water', // Uriage thermal spring water | soothing, naturally remineralizing
  TRIPTERYGIUM_WILFORDII_CALLUS_EXTRACT: 'tripterygium-wilfordii-callus-extract',
  MYRTUS_COMMUNIS_LEAF_EXTRACT: 'myrtus-communis-leaf-extract',
  TASMANNIA_LANCEOLATA: 'tasmannia-lanceolata', // INCI: Tasmannia Lanceolata Fruit Extract | Australian spice, mattifying and anti-aging toning
  AQUABIOME: 'aquabiome', // Marine active complex | protects the marine skin microbiome
  O_CYMEN_5_OL: 'o-cymen-5-ol', // INCI: o-Cymen-5-ol (Biosol) | mild antimicrobial preservative, paraben alternative
  GLYCERYL_CAPRYLATE_CAPRATE: 'glyceryl-caprylate-caprate', // INCI: Glyceryl Caprylate/Caprate | multifunctional natural preservative, emollient
  MELANIN: 'melanin', // INCI: Melanin | biomimetic tinting and photoprotective pigment (UV/HEV)
  HYDROLYZED_YEAST_PROTEIN: 'hydrolyzed-yeast-protein', // INCI: Hydrolyzed Yeast Protein | beta-glucan-rich yeast hydrolysate, fortifying
  // Lot 3 of the v27 candidate return, family E. Yeast Extract is kept distinct from the
  // hydrolysate above — same source organism, different processing and identity.
  YEAST_EXTRACT: 'yeast-extract', // INCI: Yeast Extract | soluble yeast extract, skin conditioning and protecting
  YEAST_AMINO_ACIDS: 'yeast-amino-acids', // INCI: Yeast Amino Acids | yeast-derived amino acid blend, humectant
  MELIA_AZADIRACHTA: 'melia-azadirachta', // INCI: Melia Azadirachta Leaf Extract | neem leaf, purifying
  HOLY_BASIL: 'holy-basil', // INCI: Ocimum Sanctum Leaf Extract | holy basil (tulsi), antioxidant and soothing
  CORALLINA_OFFICINALIS: 'corallina-officinalis', // INCI: Corallina Officinalis Extract | red algae, mineral source
  LAVENDER_OIL: 'lavender-oil', // INCI: Lavandula Angustifolia Oil | lavender essential oil (contains fragrance allergens)
  GERANIUM_OIL: 'geranium-oil', // INCI: Pelargonium Graveolens Oil | rose geranium essential oil (contains fragrance allergens)
  CHLORPHENESIN: 'chlorphenesin', // INCI: Chlorphenesin | broad-spectrum preservative
  SODIUM_METABISULFITE: 'sodium-metabisulfite', // INCI: Sodium Metabisulfite | sulfite antioxidant preservative
  SODIUM_SULFITE: 'sodium-sulfite', // INCI: Sodium Sulfite | sulfite antioxidant, same sensitizing moiety as metabisulfite
  VANILLIN: 'vanillin', // INCI: Vanillin | main aroma molecule of vanilla, EU Annex III restricted
  FRAGRANCE: 'fragrance', // INCI: Parfum / Fragrance / Aroma | undisclosed scent compound, INCI umbrella term
  // The Annex III fragrance substances an INCI list has to name one by one. That spelling exists
  // precisely so a reader can spot them, and none of them reached a fiche: algo-derm grades all
  // twenty-three, aurore declared none. `Benzyl Alcohol` is deliberately not here: it stays on
  // NON_DISCRIMINANT_TOKENS, where its 547 products and its preservative role put it.
  LIMONENE: 'limonene', // INCI: Limonene | citrus peel terpene, oxidises on air
  LINALOOL: 'linalool', // INCI: Linalool | lavender and rosewood terpene alcohol
  CITRONELLOL: 'citronellol', // INCI: Citronellol | rose and geranium terpene alcohol
  GERANIOL: 'geraniol', // INCI: Geraniol | rose-scented terpene alcohol
  CITRAL: 'citral', // INCI: Citral | lemon-scented aldehyde, geranial and neral
  LINALYL_ACETATE: 'linalyl-acetate', // INCI: Linalyl Acetate | linalool ester, bergamot and lavender
  HEXYL_CINNAMAL: 'hexyl-cinnamal', // INCI: Hexyl Cinnamal | jasmine-type synthetic aldehyde
  ALPHA_ISOMETHYL_IONONE: 'alpha-isomethyl-ionone', // INCI: Alpha-Isomethyl Ionone | violet-type synthetic ketone
  COUMARIN: 'coumarin', // INCI: Coumarin | tonka and woodruff lactone, hay note
  BENZYL_SALICYLATE: 'benzyl-salicylate', // INCI: Benzyl Salicylate | floral ester, also a UV absorber
  BENZYL_BENZOATE: 'benzyl-benzoate', // INCI: Benzyl Benzoate | balsamic ester, also a solvent
  HYDROXYCITRONELLAL: 'hydroxycitronellal', // INCI: Hydroxycitronellal | lily-of-the-valley aldehyde
  FARNESOL: 'farnesol', // INCI: Farnesol | sesquiterpene alcohol, also a deodorant
  CINNAMAL: 'cinnamal', // INCI: Cinnamal | cinnamon bark aldehyde
  CINNAMYL_ALCOHOL: 'cinnamyl-alcohol', // INCI: Cinnamyl Alcohol | hyacinth-type alcohol, found in storax
  ISOEUGENOL: 'isoeugenol', // INCI: Isoeugenol | eugenol isomer, distinct from methyl eugenol
  AMYL_CINNAMAL: 'amyl-cinnamal', // INCI: Amyl Cinnamal | jasmine-type synthetic aldehyde
  AMYLCINNAMYL_ALCOHOL: 'amylcinnamyl-alcohol', // INCI: Amylcinnamyl Alcohol | reduced form of amyl cinnamal
  BENZYL_CINNAMATE: 'benzyl-cinnamate', // INCI: Benzyl Cinnamate | balsamic ester of Peru balsam
  ANISE_ALCOHOL: 'anise-alcohol', // INCI: Anise Alcohol | anise-scented aromatic alcohol
  EVERNIA_PRUNASTRI_EXTRACT: 'evernia-prunastri-extract', // INCI: Evernia Prunastri Extract | oakmoss, a natural mixture
  EVERNIA_FURFURACEA_EXTRACT: 'evernia-furfuracea-extract', // INCI: Evernia Furfuracea Extract | treemoss, a natural mixture
  METHYL_2_OCTYNOATE: 'methyl-2-octynoate', // INCI: Methyl 2-Octynoate | violet-leaf note, concentration-capped
  // EU 2023/1545 expanded the fragrance-allergen list beyond the 26 legacy Annex III substances
  // above: pinene (alpha/beta family) is one of the new entries, own labelling threshold and
  // peroxide-value condition.
  PINENE: 'pinene', // INCI: Pinene | pine/citrus terpene, SCCS-listed contact allergen (alpha/beta family)
  // add-to-db backlog, lot 4. Same EU 2023/1545 expansion as pinene above, own Annex III/343
  // entry; kept distinct from terpinen-4-ol per algo-derm's evidence note.
  TERPINEOL: 'terpineol', // INCI: Terpineol | pine/citrus terpene alcohol, SCCS-listed contact allergen
  PHENYLPROPANOL: 'phenylpropanol', // INCI: Phenylpropanol | aromatic alcohol, fragrance and preservative booster
  // add-to-db backlog, lot 3. Same role as phenylpropanol above, distinct molecule.
  PHENETHYL_ALCOHOL: 'phenethyl-alcohol', // INCI: Phenethyl Alcohol | aromatic alcohol, fragrance solvent and preservative booster
  RASPBERRY_KETONE: 'raspberry-ketone', // INCI: Raspberry Ketone | raspberry aroma molecule, tyrosinase substrate
  ALGAE_EXTRACT: 'algae-extract', // INCI: Algae Extract | generic algal extract, species not declared
  SEA_SALT: 'sea-salt', // INCI: Sea Salt | mineral salt, abrasive and texture agent
  HYDROXYDECENOIC_ACID_10: '10-hydroxydecenoic-acid', // INCI: 10-Hydroxydecenoic Acid | royal jelly fatty acid
  // `Leaf/Stem Extract` would split into a truncated `HEDERA HELIX LEAF` key, so the slash-free
  // corpus spellings are declared instead; the combined one arrives through the algo-derm bridge.
  HEDERA_HELIX_EXTRACT: 'hedera-helix-extract', // INCI: Hedera Helix Leaf Extract / Hedera Helix Extract | ivy saponins, falcarinol allergens
  ALUMINUM_CHLOROHYDRATE: 'aluminum-chlorohydrate', // INCI: Aluminum Chlorohydrate | antiperspirant aluminium salt
  // Moved out of the dental file: menthol cools a face mist as it cools a mouthwash, and
  // hydrogen peroxide oxidises wherever it is used.
  MENTHOL_DENTAL: 'menthol-dental', // INCI: Menthol | cooling agent, mildly anaesthetic
  HYDROGEN_PEROXIDE: 'hydrogen-peroxide', // INCI: Hydrogen Peroxide | oxidising bleaching agent
} as const

// Chelators, which bind the trace metals that would otherwise catalyse rancidity. The three
// biodegradable ones link: choosing them over EDTA is a formulation stance a reader can act on.
// `trisodium-edta` is declared here for its fiche but listed in FILLER_SLUGS, so the EDTA family
// stays treated as one block: its two siblings were already fillers.
export const CHELATANTS = {
  TRISODIUM_ETHYLENEDIAMINE_DISUCCINATE: 'trisodium-ethylenediamine-disuccinate', // INCI: Trisodium Ethylenediamine Disuccinate
  TETRASODIUM_GLUTAMATE_DIACETATE: 'tetrasodium-glutamate-diacetate', // INCI: Tetrasodium Glutamate Diacetate
  CAPRYLHYDROXAMIC_ACID: 'caprylhydroxamic-acid', // INCI: Caprylhydroxamic Acid / Caprylohydroxamic Acid | iron chelator
  TRISODIUM_EDTA: 'trisodium-edta', // INCI: Trisodium EDTA / Trisodium Ethylenediaminetetraacetate
  // Moved out of the haircare and dental files. Both chelate the same trace metals here.
  SODIUM_GLUCONATE_HAIR: 'sodium-gluconate-hair', // mild biodegradable chelator
  TETRASODIUM_PYROPHOSPHATE: 'tetrasodium-pyrophosphate', // INCI: Tetrasodium Pyrophosphate | calcium chelator and buffer
} as const

// Organic-acid preservatives and their salts. Not FILLERS: the is_filler taxonomy would cut the
// link, and a preservative system does tell a reader something about the product it is in.
// The high-reach salts of the same acids (Sodium Benzoate, Potassium Sorbate) stay on
// NON_DISCRIMINANT_TOKENS: they clear the 300-product bar, these do not.
export const CONSERVATEURS = {
  BENZOIC_ACID: 'benzoic-acid', // INCI: Benzoic Acid | acid-pH preservative, Annex V/1
  POTASSIUM_BENZOATE: 'potassium-benzoate', // INCI: Potassium Benzoate | benzoate salt, Annex V/1a
  SORBIC_ACID: 'sorbic-acid', // INCI: Sorbic Acid | antifungal acid preservative, Annex V/4
  DEHYDROACETIC_ACID: 'dehydroacetic-acid', // INCI: Dehydroacetic Acid | antifungal, Annex V/13
  SODIUM_DEHYDROACETATE: 'sodium-dehydroacetate', // INCI: Sodium Dehydroacetate | its sodium salt
  SODIUM_LEVULINATE: 'sodium-levulinate', // INCI: Sodium Levulinate | booster, not an Annex V entry
  LEVULINIC_ACID: 'levulinic-acid', // INCI: Levulinic Acid | pH adjuster and preservative booster
  // Both spellings normalise to distinct keys, so the para isomer is declared with its alias.
  P_ANISIC_ACID: 'p-anisic-acid', // INCI: p-Anisic Acid / Anisic Acid | fragrance and booster
  SODIUM_ANISATE: 'sodium-anisate', // INCI: Sodium Anisate | antimicrobial, paired with levulinate
  SODIUM_SALICYLATE: 'sodium-salicylate', // INCI: Sodium Salicylate | preservative salt, not a BHA
  // Moved out of the dental file. Both are Annex V antimicrobials used well beyond mouthwash.
  CHLORHEXIDINE: 'chlorhexidine', // INCI: Chlorhexidine Digluconate | broad-spectrum antimicrobial
  THYMOL: 'thymol', // INCI: Thymol | phenolic antiseptic
} as const

export const FILLERS = {
  // Aqueous solvents
  AQUA: 'aqua', // INCI: Aqua (Water) | universal solvent, inert
  PROPANEDIOL: 'propanediol', // INCI: Propanediol | neutral solvent/vehicle

  // pH adjusters & chelators
  CITRIC_ACID: 'citric-acid', // INCI: Citric Acid | pH adjuster, trace
  SODIUM_HYDROXIDE: 'sodium-hydroxide', // INCI: Sodium Hydroxide | pH adjuster, neutralized in the formula
  POTASSIUM_HYDROXIDE: 'potassium-hydroxide', // INCI: Potassium Hydroxide | pH adjuster
  TRIETHANOLAMINE: 'triethanolamine', // INCI: Triethanolamine | pH adjuster
  TROMETHAMINE: 'tromethamine', // INCI: Tromethamine | pH adjuster
  SODIUM_CITRATE: 'sodium-citrate', // INCI: Sodium Citrate | pH buffer
  DISODIUM_EDTA: 'disodium-edta', // INCI: Disodium EDTA | chelator, trace, skin-inert
  TETRASODIUM_EDTA: 'tetrasodium-edta', // INCI: Tetrasodium EDTA | chelator, trace

  // Thickeners / gelling agents
  CARBOMER: 'carbomer', // INCI: Carbomer | inert gelling agent, high tolerance
  XANTHAN_GUM: 'xanthan-gum', // INCI: Xanthan Gum | inert gelling agent
  ACRYLATES_CROSSPOLYMER: 'acrylates-c10-30-alkyl-acrylate-crosspolymer', // INCI: Acrylates/C10-30 Alkyl Acrylate Crosspolymer | inert gelling agent
  HYDROXYETHYLCELLULOSE: 'hydroxyethylcellulose', // INCI: Hydroxyethylcellulose / Hydroxyethyl Cellulose | inert thickener
  HYDROXYPROPYL_METHYLCELLULOSE: 'hydroxypropyl-methylcellulose', // INCI: Hydroxypropyl Methylcellulose | inert thickener
  SODIUM_POLYACRYLATE: 'sodium-polyacrylate', // INCI: Sodium Polyacrylate | inert thickener
  SCLEROTIUM_GUM: 'sclerotium-gum', // INCI: Sclerotium Gum | inert gelling agent

  // Fatty alcohols & structural emulsifiers
  CETYL_ALCOHOL: 'cetyl-alcohol', // INCI: Cetyl Alcohol | emulsion structuring agent, inert
  STEARYL_ALCOHOL: 'stearyl-alcohol', // INCI: Stearyl Alcohol | emulsion structuring agent, inert
  BEHENYL_ALCOHOL: 'behenyl-alcohol', // INCI: Behenyl Alcohol | emulsion structuring agent, inert
  PEG_100_STEARATE: 'peg-100-stearate', // INCI: PEG-100 Stearate | structural emulsifier
  CETEARETH_20: 'ceteareth-20', // INCI: Ceteareth-20 | structural emulsifier

  // Vehicle silicones
  DIMETHICONOL: 'dimethiconol', // INCI: Dimethiconol | inert vehicle/texture
  CYCLOPENTASILOXANE: 'cyclopentasiloxane', // INCI: Cyclopentasiloxane (D5) | inert vehicle
  CYCLOHEXASILOXANE: 'cyclohexasiloxane', // INCI: Cyclohexasiloxane (D6) | inert vehicle
  PHENYL_TRIMETHICONE: 'phenyl-trimethicone', // INCI: Phenyl Trimethicone | inert vehicle

  // Mineral oils & inert hydrocarbons
  MINERAL_OIL: 'mineral-oil', // INCI: Mineral Oil (Paraffinum Liquidum) | inert occlusive
  PETROLATUM: 'petrolatum', // INCI: Petrolatum | inert occlusive
  ISOHEXADECANE: 'isohexadecane', // INCI: Isohexadecane | light inert vehicle
  ISODODECANE: 'isododecane', // INCI: Isododecane | light inert vehicle
  ETHYLHEXYL_METHOXYCRYLENE: 'ethylhexyl-methoxycrylene', // INCI: Ethylhexyl Methoxycrylene | photostabiliser, quenches avobenzone

  // Synthetic vehicle esters
  DICAPRYLYL_CARBONATE: 'dicaprylyl-carbonate', // INCI: Dicaprylyl Carbonate | inert vehicle emollient
  COCO_CAPRYLATE_CAPRATE: 'coco-caprylate-caprate', // INCI: Coco-Caprylate/Caprate | inert vehicle emollient

  // Inert ionic salts
  SODIUM_CHLORIDE: 'sodium-chloride', // INCI: Sodium Chloride | basic salt, inert
  POTASSIUM_CHLORIDE: 'potassium-chloride', // INCI: Potassium Chloride | basic salt, inert

  // Mild emulsifiers
  GLYCERYL_STEARATE_CITRATE: 'glyceryl-stearate-citrate', // INCI: Glyceryl Stearate Citrate | mild emulsifier, barrier-biocompatible
  SUCROSE_STEARATE: 'sucrose-stearate', // INCI: Sucrose Stearate | sugar ester emulsifier, ultra-mild
} as const
