import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const DR_IDRISS_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.DR_IDRISS_THE_DEPUFFER]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-rougeurs et anti-cernes',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Hydratant lipidique doux',
    },
    {
      slug: INGREDIENT_SLUGS.ARNICA,
      notes: 'Arnica Montana – réduit les gonflements et ecchymoses, drainant',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Centella Asiatica – apaise les rougeurs visibles',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Extrait d avoine – apaisant, barrière',
    },
  ],

  [allProductSlugs.DR_IDRISS_MAJOR_FADE_HYPER_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Inhibe le transfert des mélanosomes, anti-taches, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN,
      notes: 'Inhibiteur de tyrosinase – anti-taches puissant',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      notes: 'Chélateur du cuivre / inhibiteur de tyrosinase – dépigmentant',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Extrait de réglisse – anti-inflammatoire, dépigmentant doux',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient barrière',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – émollient nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.AVOCADO_OIL,
      notes: 'Huile d avocat – émollient',
    },
  ],

  [allProductSlugs.DR_IDRISS_MAJOR_FADE_ACTIVE_SEAL]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Tetrahexyldecyl Ascorbate – vitamine C liposoluble stable, anti-taches, collagène',
    },
    {
      slug: INGREDIENT_SLUGS.BUTYLRESORCINOL,
      notes: '4-Butylresorcinol – inhibiteur puissant de tyrosinase, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramides (NP/AP/EOP) – reconstruction de la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Lipide barrière biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Précurseur de céramides – renforce la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHION,
      notes: 'Glutathion oxydé – antioxydant, éclaircissant',
    },
  ],

  [allProductSlugs.DR_IDRISS_MAJOR_FADE_DISCO_BLOCK]: [
    {
      slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
      notes: 'Hexylrésorcinol – éclaircissant, inhibiteur de tyrosinase, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Complexe céramides (NP/AP/NS/AS/EOP) – renfort de la barrière solaire',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Lipide barrière',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – émollient protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT,
      notes: 'Extrait de curcuma – antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.AVOBENZONE,
      value: 3,
      unit: '%',
      notes: 'Filtre UVA chimique',
    },
    {
      slug: INGREDIENT_SLUGS.HOMOSALATE,
      value: 7,
      unit: '%',
      notes: 'Filtre UVB chimique',
    },
    {
      slug: INGREDIENT_SLUGS.OCTOCRYLENE,
      value: 10,
      unit: '%',
      notes: 'Filtre UVB chimique stabilisant',
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_SALICYLATE,
      value: 5,
      unit: '%',
      notes: 'Octisalate – filtre UVB chimique',
    },
  ],

  [allProductSlugs.DR_IDRISS_MAJOR_FADE_FLASH_MASK]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      value: 15,
      unit: '%',
      notes: 'AHA exfoliant puissant – renouvellement cellulaire, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      value: 3,
      unit: '%',
      notes: 'AHA doux – exfoliant et hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
      notes: 'Acide tranexamique – anti-taches, anti-inflammatoire, unifie le teint',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 – réduit l irritation post-exfoliation',
    },
  ],

  [allProductSlugs.DR_IDRISS_LEFT_UN_RED_REDUCER_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      value: 10,
      unit: '%',
      notes: 'Acide azélaïque – séborégulateur, anti-rougeurs, anti-rosacée',
    },
    {
      slug: INGREDIENT_SLUGS.ENOXOLONE,
      notes: 'Acide glycyrrhétinique – anti-inflammatoire puissant, calme les rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
      notes: 'Bisabolol – apaisant, réduit l irritation',
    },
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_PALMITATE,
      notes: 'Vitamine C liposoluble – antioxydant stabilisateur',
    },
  ],

  [allProductSlugs.DR_IDRISS_LEFT_UN_RED_CALMBACK_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Zinc PCA – séborégulateur, apaisant, anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
      notes: 'Flocons d avoine colloïdaux – calmant, anti-démangeaisons, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'BioEcolia® – prébiotique, équilibre le microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – renforce la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 – apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Zinc gluconate – apaisement complémentaire',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
  ],
}

export const DR_IDRISS_PRODUCT_INGREDIENTS = Object.entries(DR_IDRISS_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
