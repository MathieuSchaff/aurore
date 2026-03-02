import { join } from 'node:path' // Import pour gérer les chemins

import { INGREDIENT_SLUGS } from '../ingredients/seed-ingredients'
import { allIngredientProductTags } from './ingredients-products-tags'
import { allProductSlugs } from './products-slugs' // On importe la liste de tous les slugs

const inputData = allIngredientProductTags as any[]
const fullMap: Record<string, any[]> = {}

// 1. On construit la Map en mémoire
inputData.forEach((item) => {
  const pSlug = item.productSlug
  if (!pSlug) return

  if (!fullMap[pSlug]) fullMap[pSlug] = []

  const entry: any = { slug: item.ingredientSlug }
  if (item.concentrationValue) entry.value = item.concentrationValue
  if (item.concentrationUnit) entry.unit = item.concentrationUnit
  if (item.notes) entry.notes = item.notes

  fullMap[pSlug].push(entry)
})

// 2. Préparation des remplacements (Triés par longueur pour éviter les collisions)
const ingredientReplacements = Object.entries(INGREDIENT_SLUGS).sort(
  (a, b) => b[1].length - a[1].length
)

const productReplacements = Object.entries(allProductSlugs).sort(
  (a, b) => b[1].length - a[1].length
)

let mapString = JSON.stringify(fullMap, null, 2)

// 3. Remplacement des clés produits par les constantes
productReplacements.forEach(([key, value]) => {
  const regex = new RegExp(`"${value}":`, 'g')
  mapString = mapString.replace(regex, `[allProductSlugs.${key}]:`)
})

// 4. Remplacement des valeurs slugs par les constantes
ingredientReplacements.forEach(([key, value]) => {
  const regex = new RegExp(`"slug": "${value}"`, 'g')
  mapString = mapString.replace(regex, `"slug": INGREDIENT_SLUGS.${key}`)
})

// 5. Construction du contenu
const fileContent = `
import { INGREDIENT_SLUGS } from '../ingredients/seed-ingredients';
import { allProductSlugs } from './products-slug';

export const PRODUCT_INGREDIENTS_MAP: Record<string, any[]> = ${mapString};

export const allIngredientProductTags = Object.entries(PRODUCT_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
);
`

// 6. C'EST ICI QUE CA CHANGE :
// On définit le chemin de sortie pour qu'il soit relatif au script actuel
const outputPath = join(import.meta.dir, 'productIngredients.ts')

await Bun.write(outputPath, fileContent)

console.log(`✅ Succès ! Fichier généré ici : ${outputPath}`)
