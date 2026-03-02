import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const THERAMID_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.THERAMID_EVEN_IN]: [
    {
      slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
      notes: 'Partie du complexe TXA-Kojic 4%',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      notes: 'Partie du complexe TXA-Kojic 4%',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN,
      value: 2,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_GLUCOSAMINE,
      value: 2,
      unit: '%',
      notes: 'NAG Amino Monosaccharide',
    },
  ],

  [allProductSlugs.THERAMID_TETRAMID_CEF]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      value: 20,
      unit: '%',
      notes: 'Vitamine C Tetra (liposoluble), Ascorbosilane et Ascorbyl Glucoside',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      value: 1,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.FERULIC_ACID,
      value: 0.5,
      unit: '%',
    },
  ],

  [allProductSlugs.THERAMID_A_RETINYL_RETINOATE]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      value: 0.1,
      unit: '%',
      notes: 'Pur encapsulé liposomal',
    },
    {
      slug: INGREDIENT_SLUGS.RETINYL_RETINOATE,
      value: 0.06,
      unit: '%',
      notes: 'Encapsulé liposomal',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_RETINOYL_HYALURONATE,
      value: 0.06,
      unit: '%',
      notes: 'HyRetin TM',
    },
  ],

  [allProductSlugs.THERAMID_COPPER_PEPTIDE]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
      value: 3,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      value: 13,
      unit: '%',
      notes: 'Munapsys, Peptides Bio, NeoclairPro et Progeline',
    },
  ],

  [allProductSlugs.THERAMID_CERAMIDE_TREATMENT]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      value: 3,
      unit: '%',
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      value: 1,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      value: 1,
      unit: '%',
      notes: 'CICA',
    },
  ],

  [allProductSlugs.THERAMID_CLINICAL_VITAMIN_A]: [
    {
      slug: INGREDIENT_SLUGS.GRANACTIVE_RETINOID,
      value: 5,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      value: 0.3,
      unit: '%',
      notes: 'Encapsulé',
    },
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      value: 0.1,
      unit: '%',
      notes: 'Pur encapsulé liposomal',
    },
  ],

  [allProductSlugs.THERAMID_AZID]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      value: 15,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
      value: 1,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      value: 1,
      unit: '%',
    },
  ],

  [allProductSlugs.THERAMID_LINO_8]: [
    {
      slug: INGREDIENT_SLUGS.LINOLEIC_ACID,
      value: 8,
      unit: '%',
      notes: 'Acides Linoléique et Linolénique',
    },
    {
      slug: INGREDIENT_SLUGS.VITAMIN_K1,
      value: 1,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.COQ10,
      value: 1,
      unit: '%',
    },
  ],

  [allProductSlugs.THERAMID_SMOOTHING_TREATMENT]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 10,
      unit: '%',
      notes: 'PHA',
    },
    {
      slug: INGREDIENT_SLUGS.MANDELIC_ACID,
      value: 10,
      unit: '%',
      notes: 'AHA',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      value: 5,
      unit: '%',
    },
  ],

  [allProductSlugs.THERAMID_DERMA_PEPTIDES]: [
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      value: 35,
      unit: '%',
      notes: 'Mélange de 9 peptides biomimétiques (Matrixyl, Munapsys, etc.)',
    },
  ],

  [allProductSlugs.THERAMID_HAPCA_FILLER]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      value: 5,
      unit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      value: 3,
      unit: '%',
      notes: 'Inclut Primalhyal Ultrafiller (1%) et Primalhyal 3K (2%)',
    },
  ],
}
