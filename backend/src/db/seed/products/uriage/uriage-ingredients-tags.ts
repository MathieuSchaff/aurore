import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const URIAGE_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.URIAGE_XEMOSE_C8_PLUS_CORPS]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP, // à créer si absent
      notes: 'Céramide NP — restaure la barrière lipidique',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS, // à créer si absent
      notes: 'Céramide NS — cohésion intercellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP, // à créer si absent
      notes: 'Céramide EOP — barrière et rétention hydrique',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP, // à créer si absent
      notes: 'Céramide AP — intégrité de la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES, // NP + NS + EOP + AP
      notes: '4 céramides biomimétiques (NP/NS/EOP/AP)',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      value: 10,
      unit: '%',
      notes: 'Beurre de karité relipidant',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Lipide barrière biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Sphingolipide anti-inflammatoire barrière',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Lipide occlusif émollient',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, // = ASIATICOSIDE
      notes: 'Asiaticoside apaisant anti-grattage',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA doux NMF hydratant',
    },
  ],
  [allProductSlugs.URIAGE_XEMOSE_C8_PLUS_VISAGE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      value: 10,
      unit: '%',
      notes: 'Beurre de karité 10%',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient occlusif',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Précurseur de céramides, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Composant lipidique de la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Centella Asiatica réparatrice',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrissant, renforce la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Émollient, protège la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],
  [allProductSlugs.URIAGE_HYSEAC_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: '5,8% AHA purs (glycolique + malique + lactique)',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA pur, exfoliant doux',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Sébum-régulateur, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Apaisant, anti-bactérien',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Technologie NEUROBIOX anti-stress',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Anti-inflammatoire, apaisant',
    },
  ],
  [allProductSlugs.URIAGE_CICA_DAILY_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Réparateur, régénérant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratant, repulpant',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Vitamine B5, apaisant et unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Anti-imperfections, purifiant',
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-inflammatoire, anti-rougeurs, unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Enoxolone — anti-inflammatoire, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Antioxydant',
    },
  ],
  [allProductSlugs.URIAGE_DEPIDERM_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Complexe 20% Vitamine C (ascorbyl tetraisopalmitate), unifiant et éclatant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-taches, unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Enoxolone — anti-inflammatoire, prévention des taches post-acnéiques',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: 'AHA exfoliant, éclat',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA doux, unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
  [allProductSlugs.URIAGE_XEMOSE_HUILE_LAVANTE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Relipidant, nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],
  [allProductSlugs.URIAGE_XEMOSE_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      value: 10,
      unit: '%',
      notes: 'Relipidant majeur',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Antioxydant',
    },
  ],
  [allProductSlugs.URIAGE_GEL_SURGRAS]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant, améliore le confort cutané',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE_CREME]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE_TEINTE]: [
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
      notes: 'Filtre UV large spectre (Tinosorb S)',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
  ],
}

// Export original pour compatibilité descendante
export const URIAGE_PRODUCT_INGREDIENTS = Object.entries(URIAGE_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
