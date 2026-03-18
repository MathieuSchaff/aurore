// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — barrel file
// Single place to see/import all seed data, slugs and maps.
// Nothing is merged here — every export keeps its original name and origin.
// ─────────────────────────────────────────────────────────────────────────────

// ── Ingredient ↔ Tag map ─────────────────────────────────────────────────────
// ingredientTagMap → Record<ingredientSlug, { primary, secondary, avoid }>
export {
  type IngredientAssociation,
  type IngredientTagMap,
  ingredientTagMap,
} from './IngredientsTags/seed-ingredients-tags'
// ── Ingredients ──────────────────────────────────────────────────────────────
// ingredientData   → flat array of all ingredients (all categories combined)
// INGREDIENT_SLUGS → master slug constants object (all categories merged)
export { type IngredientInput, ingredientData } from './ingredients/ingredient-data'
export { INGREDIENT_SLUGS } from './ingredients/ingredient-slugs'
// ── Products ─────────────────────────────────────────────────────────────────
// allProductData → flat array of all products (all brands combined)
export { allProductData } from './products/index'
// ── Product ↔ Ingredient map ─────────────────────────────────────────────────
// ALL_PRODUCT_INGREDIENTS_MAP → Record<productSlug, IngredientArray>   (nested)
// allIngredientProductTags    → flat array ready for DB insert
export {
  ALL_PRODUCT_INGREDIENTS_MAP,
  allIngredientProductTags,
} from './products/ingredients-products-tags'
// ── Product ↔ Tag map ────────────────────────────────────────────────────────
// allProductTagsMap → Record<productSlug, { primary, secondary, avoid }>
export { allProductTagsMap } from './products/product-tags'
// allProductSlugs → master slug constants object (all brands merged)
export { allProductSlugs } from './products/products-slugs'
// ── Tags ─────────────────────────────────────────────────────────────────────
// TAG_SLUGS → slug constants for all tags
// tagData   → flat array of all tag definitions
export { TAG_SLUGS, tagData } from './tags/seed-tags'
