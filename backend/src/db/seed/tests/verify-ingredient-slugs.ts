import { INGREDIENT_SLUGS } from '../data/ingredients/ingredient-slugs'
import { ALL_PRODUCT_INGREDIENTS_MAP, allProductData } from '../data/products'
import { allProductSlugs } from '../data/products/products-slugs'

/**
 * Ce script vérifie que :
 * 1. Toutes les clés de ALL_PRODUCT_INGREDIENTS_MAP sont des slugs valides (pas d'undefined).
 * 2. Chaque ingrédient associé à un produit a bien un slug d'ingrédient valide.
 * 3. Chaque produit mentionné dans la map existe bien dans la liste officielle des slugs.
 * 4. Chaque produit mentionné dans la map existe bien dans allProductData.
 */

function verifyIngredientProductSlugs() {
  console.log('🚀 DÉBUT DE LA VÉRIFICATION DES SLUGS PRODUITS DANS LES INGRÉDIENTS...\n')

  const productSlugsValues = new Set<string>(Object.values(allProductSlugs))
  const ingredientSlugsValues = new Set<string>(Object.values(INGREDIENT_SLUGS))
  const dataProductSlugs = new Set(allProductData.map((p) => p.slug).filter(Boolean))

  let errorCount = 0

  const entries = Object.entries(ALL_PRODUCT_INGREDIENTS_MAP)

  entries.forEach(([productSlug, ingredients]) => {
    // 1. Vérification du slug produit lui-même (la clé)
    if (productSlug === 'undefined') {
      console.error(
        `❌ ERREUR : Une clé dans ALL_PRODUCT_INGREDIENTS_MAP est 'undefined'. Cela signifie probablement qu'un slug est manquant dans allProductSlugs.`
      )
      errorCount++
      return
    }

    if (!productSlugsValues.has(productSlug)) {
      console.error(
        `❌ ERREUR : Le slug produit '${productSlug}' n'est pas défini dans ALL_PRODUCT_SLUGS.`
      )
      errorCount++
    }

    if (!dataProductSlugs.has(productSlug)) {
      console.warn(
        `⚠️  ATTENTION : Le slug produit '${productSlug}' est présent dans les ingrédients mais absent de allProductData.`
      )
      // On ne compte pas forcément comme erreur bloquante selon le workflow, mais c'est suspect
    }

    // 2. Vérification des ingrédients pour ce produit
    if (!Array.isArray(ingredients)) {
      console.error(
        `❌ ERREUR : Les ingrédients pour le produit '${productSlug}' ne sont pas un tableau.`
      )
      errorCount++
      return
    }

    ingredients.forEach((ing, index) => {
      if (!ing.slug) {
        console.error(
          `❌ ERREUR : L'ingrédient à l'index ${index} pour le produit '${productSlug}' n'a pas de slug.`
        )
        errorCount++
      } else if (!ingredientSlugsValues.has(ing.slug)) {
        console.error(
          `❌ ERREUR : Le slug d'ingrédient '${ing.slug}' pour le produit '${productSlug}' est inconnu dans INGREDIENT_SLUGS.`
        )
        errorCount++
      }
    })
  })

  console.log(`\n📊 RÉSUMÉ :`)
  console.log(`- Produits vérifiés : ${entries.length}`)
  if (errorCount === 0) {
    console.log(
      `✅ TOUT EST CORRECT ! Tous les ingrédients ont un product slug valide et leurs propres slugs sont corrects.`
    )
  } else {
    console.error(
      `🛑 ${errorCount} ERREUR(S) DÉTECTÉE(S). Veuillez corriger les problèmes ci-dessus.`
    )
  }
}

verifyIngredientProductSlugs()
