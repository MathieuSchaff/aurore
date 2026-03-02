import { allProductData } from '../products'
import { allProductSlugs } from '../products/products-slugs'

/**
 * Vérifie la cohérence entre l'objet des slugs et le tableau de données.
 * @param {Object} slugsObj - L'objet contenant les constantes de slugs (allProductSlugs)
 * @param {Array} dataArray - Le tableau contenant les objets produits (allProductData)
 */
export const checkDataSlugIntegrity = (slugsObj, dataArray) => {
  const definedSlugs = Object.values(slugsObj)
  const dataSlugs = dataArray.map((p) => p.slug)

  const missingData = definedSlugs.filter((slug) => !dataSlugs.includes(slug))
  const orphans = dataSlugs.filter((slug) => !definedSlugs.includes(slug))
  const duplicates = dataSlugs.filter((slug, index) => dataSlugs.indexOf(slug) !== index)

  console.log("--- 🔎 RAPPORT D'INTÉGRITÉ DES PRODUITS ---")

  const isOk = missingData.length === 0 && orphans.length === 0 && duplicates.length === 0

  if (isOk) {
    console.log('✅ Parfait ! Tous les slugs ont des données associées et uniques.')
  } else {
    if (missingData.length > 0) {
      console.error(`❌ SLUGS MANQUANTS DANS LES DONNÉES (${missingData.length}) :`)
      console.table(missingData)
    }

    if (duplicates.length > 0) {
      console.warn(`⚠️ DOUBLONS DÉTECTÉS DANS LE TABLEAU (${[...new Set(duplicates)].length}) :`)
      console.table([...new Set(duplicates)])
    }

    if (orphans.length > 0) {
      console.error(
        `❓ SLUGS DANS LES DONNÉES MAIS ABSENTS DE LA LISTE OFFICIELLE (${orphans.length}) :`
      )
      console.table(orphans)
    }
  }

  console.log('-------------------------------------------')
  return isOk
}

// Utilisation :
checkDataSlugIntegrity(allProductSlugs, allProductData)
