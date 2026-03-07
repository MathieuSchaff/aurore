import { ingredientTagMap } from '../IngredientsTags/seed-ingredients-tags'
import { ingredientData } from '../ingredients/index'
import { INGREDIENT_SLUGS } from '../ingredients/ingredient-slugs'
import { allProductData } from '../products/index'
import { allIngredientProductTags } from '../products/ingredients-products-tags'
import { allProductTagsMap } from '../products/product-tags'
import { allProductSlugs } from '../products/products-slugs'
// Nouvel import pour le test des tags
import { TAG_SLUGS, tagData } from '../tags/seed-tags'

/**
 * Audit global du système de données (Silencieux).
 * Vérifie l'intégrité des Produits, Ingrédients, Liaisons et Tags.
 */
export function runGlobalSilentAudit(): void {
  const errors: string[] = []

  // --- 1. INTÉGRITÉ DES PRODUITS ---
  const definedProdSlugs = Object.values(allProductSlugs) as string[]
  const dataProdSlugs = allProductData
    .map((p) => p.slug)
    .filter((s): s is string => typeof s === 'string')

  const missingProd = definedProdSlugs.filter((s) => !dataProdSlugs.includes(s))
  const ghostProd = dataProdSlugs.filter((s) => !definedProdSlugs.includes(s))

  if (missingProd.length > 0)
    errors.push(`❌ Produits : ${missingProd.length} slugs manquants dans les données.`)
  if (ghostProd.length > 0)
    errors.push(`👻 Produits : ${ghostProd.length} slugs fantômes (non déclarés).`)

  // --- 2. INTÉGRITÉ DES INGRÉDIENTS ---
  const ingDataSlugs = ingredientData.map((i) => i.slug as string)
  const ingConfigSlugs = Object.values(INGREDIENT_SLUGS) as string[]
  const ingConfigSet = new Set(ingConfigSlugs)

  const missingIng = ingConfigSlugs.filter((s) => !ingDataSlugs.includes(s))
  const ghostIng = ingDataSlugs.filter((s) => !ingConfigSet.has(s))

  if (missingIng.length > 0) errors.push(`❌ Ingrédients : ${missingIng.length} fiches manquantes.`)
  if (ghostIng.length > 0) errors.push(`👻 Ingrédients : ${ghostIng.length} slugs non déclarés.`)

  // --- 3. COHÉRENCE DES TAGS (Nouveau Test) ---
  const configTagSlugs = Object.values(TAG_SLUGS) as string[]
  const seedTagSlugs = new Set(tagData.map((t) => t.slug))

  const missingTagSeeds = configTagSlugs.filter((slug) => !seedTagSlugs.has(slug))

  if (missingTagSeeds.length > 0) {
    errors.push(
      `❌ Tags : ${missingTagSeeds.length} slugs définis dans TAG_SLUGS n'ont pas de données dans tagData.`
    )
    // Optionnel : lister les slugs manquants pour faciliter la correction
    // console.warn("Slugs de tags manquants:", missingTagSeeds);
  }

  // --- 4. LIAISONS & MAPS ---
  const productSlugsSet = new Set(dataProdSlugs)
  const unknownLinks = allIngredientProductTags.filter((a) => !productSlugsSet.has(a.productSlug))

  if (unknownLinks.length > 0)
    errors.push(`⚠️ Liaison : ${unknownLinks.length} liens vers des produits inexistants.`)

  const taggedProdSlugs = Object.keys(allProductTagsMap)
  const untaggedProducts = dataProdSlugs.filter((s) => !taggedProdSlugs.includes(s))

  if (untaggedProducts.length > 0)
    errors.push(`❌ Tags Produits : ${untaggedProducts.length} produits sans entrée dans la map.`)

  const ingWithoutTags = ingConfigSlugs.filter((slug) => {
    const entry = ingredientTagMap[slug as keyof typeof ingredientTagMap]
    return !entry || entry.primary.length + entry.secondary.length === 0
  })

  if (ingWithoutTags.length > 0)
    errors.push(`❌ Tags Ingrédients : ${ingWithoutTags.length} ingrédients sans aucun tag.`)

  // --- RAPPORT FINAL ---
  if (errors.length > 0) {
    console.error('🛑 AUDIT : ERREURS DÉTECTÉES')
    for (const error of errors) {
      console.log(error)
    }
  } else {
    console.log('✨ Audit : Tout est synchronisé (Produits, Ingrédients, Tags).')
  }
}
runGlobalSilentAudit()
