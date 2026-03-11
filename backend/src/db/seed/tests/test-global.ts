import { ingredientTagMap } from '../IngredientsTags/seed-ingredients-tags'
import { ingredientData } from '../ingredients/index'
import { INGREDIENT_SLUGS } from '../ingredients/ingredient-slugs'
import { allProductData } from '../products/index'
import { allIngredientProductTags } from '../products/ingredients-products-tags'
import { allProductTagsMap } from '../products/product-tags'
import { allProductSlugs } from '../products/products-slugs'
import { TAG_SLUGS, tagData } from '../tags/seed-tags'

/**
 * Audit global du système de données (Silencieux).
 * Vérifie l'intégrité des Produits, Ingrédients, Liaisons et Tags.
 */
export function runGlobalSilentAudit(): void {
  const errors: string[] = []
  const details: string[] = []

  // --- 1. INTÉGRITÉ DES PRODUITS ---
  const definedProdSlugs = Object.values(allProductSlugs) as string[]
  const dataProdSlugs = allProductData
    .map((p) => p.slug)
    .filter((s): s is string => typeof s === 'string')

  const missingProd = definedProdSlugs.filter((s) => !dataProdSlugs.includes(s))
  const ghostProd = dataProdSlugs.filter((s) => !definedProdSlugs.includes(s))

  if (missingProd.length > 0) {
    errors.push(`❌ Produits : ${missingProd.length} slugs manquants dans les données.`)
    details.push(`   Slugs manquants: ${missingProd.join(', ')}`)
  }
  if (ghostProd.length > 0) {
    errors.push(`👻 Produits : ${ghostProd.length} slugs fantômes (non déclarés).`)
    details.push(`   Slugs fantômes: ${ghostProd.join(', ')}`)
  }

  // --- 2. INTÉGRITÉ DES INGRÉDIENTS ---
  const ingDataSlugs = ingredientData.map((i) => i.slug as string)
  const ingConfigSlugs = Object.values(INGREDIENT_SLUGS) as string[]
  const ingConfigSet = new Set(ingConfigSlugs)

  const missingIng = ingConfigSlugs.filter((s) => !ingDataSlugs.includes(s))
  const ghostIng = ingDataSlugs.filter((s) => !ingConfigSet.has(s))

  if (missingIng.length > 0) {
    errors.push(`❌ Ingrédients : ${missingIng.length} fiches manquantes.`)
    details.push(`   Fiches manquantes: ${missingIng.join(', ')}`)
  }
  if (ghostIng.length > 0) {
    errors.push(`👻 Ingrédients : ${ghostIng.length} slugs non déclarés.`)
    details.push(`   Slugs non déclarés: ${ghostIng.join(', ')}`)
  }

  // --- 3. COHÉRENCE DES TAGS ---
  const configTagSlugs = Object.values(TAG_SLUGS) as string[]
  const seedTagSlugs = new Set(tagData.map((t) => t.slug))

  const missingTagSeeds = configTagSlugs.filter((slug) => !seedTagSlugs.has(slug))

  if (missingTagSeeds.length > 0) {
    errors.push(
      `❌ Tags : ${missingTagSeeds.length} slugs définis dans TAG_SLUGS n'ont pas de données dans tagData.`
    )
    details.push(`   Tags sans données: ${missingTagSeeds.join(', ')}`)
  }

  // --- 4. LIAISONS & MAPS ---
  const productSlugsSet = new Set(dataProdSlugs)
  const unknownLinks = allIngredientProductTags.filter((a) => !productSlugsSet.has(a.productSlug))

  if (unknownLinks.length > 0) {
    const uniqueUnknownSlugs = [...new Set(unknownLinks.map((a) => a.productSlug))]
    errors.push(
      `⚠️ Liaison : ${unknownLinks.length} liens vers des produits inexistants (${uniqueUnknownSlugs.length} slugs uniques).`
    )
    details.push(`   Produits inexistants liés: ${uniqueUnknownSlugs.join(', ')}`)
  }

  const taggedProdSlugs = Object.keys(allProductTagsMap)
  const untaggedProducts = dataProdSlugs.filter((s) => !taggedProdSlugs.includes(s))

  if (untaggedProducts.length > 0) {
    errors.push(`❌ Tags Produits : ${untaggedProducts.length} produits sans entrée dans la map.`)
    details.push(`   Produits sans tags: ${untaggedProducts.join(', ')}`)
  }

  const ingWithoutTags = ingConfigSlugs.filter((slug) => {
    const entry = ingredientTagMap[slug as keyof typeof ingredientTagMap]
    return !entry || entry.primary.length + entry.secondary.length === 0
  })

  if (ingWithoutTags.length > 0) {
    errors.push(`❌ Tags Ingrédients : ${ingWithoutTags.length} ingrédients sans aucun tag.`)
    details.push(`   Ingrédients sans tags: ${ingWithoutTags.join(', ')}`)
  }

  // --- RAPPORT FINAL ---
  if (errors.length > 0) {
    console.error('🛑 AUDIT : ERREURS DÉTECTÉES')
    for (let i = 0; i < errors.length; i++) {
      console.error(errors[i])
      if (details[i]) console.log(details[i])
    }
  } else {
    console.log('✨ Audit : Tout est synchronisé (Produits, Ingrédients, Tags).')
  }
}

runGlobalSilentAudit()
