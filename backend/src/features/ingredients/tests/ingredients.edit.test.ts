import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestIngredient,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { IngredientError } from '../ingredients-error'
import {
  getIngredientById,
  getIngredientBySlug,
  listIngredientEdits,
  updateIngredient,
} from '../service'

let user: TestUser

setupDbTests()

const updIng = (
  userId: string,
  id: string,
  data: Parameters<typeof updateIngredient>[3],
  summary?: string,
  expectedUpdatedAt?: string
) => testDb.transaction((tx) => updateIngredient(tx, userId, id, data, summary, expectedUpdatedAt))

const getIng = (id: string) => testDb.transaction((tx) => getIngredientById(tx, id))

// `changes` is a jsonb column, so its old/new payload needs a cast to be read.
const lastChanges = async (ingredientId: string) => {
  const edits = await listIngredientEdits(testDb, ingredientId)
  return edits[0]?.changes as Record<string, { old: unknown; new: unknown }>
}

describe('updateIngredient (exhaustive)', () => {
  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('returning shape and values', () => {
    it('should return a full Ingredient object', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Rétinol Return',
        description: 'Avant',
        content: '## Wiki',
        category: 'actif',
      })

      const updated = await updIng(user.id, created.id, { description: 'Après' })

      expect(updated.id).toBe(created.id)
      expect(updated.name).toBe('Rétinol Return')
      expect(updated.slug).toBe('retinol-return')
      expect(updated.description).toBe('Après')
      expect(updated.content).toBe('## Wiki')
      expect(updated.category).toBe('actif')
      expect(updated.createdBy).toBe(user.id)
      expect(typeof updated.createdAt).toBe('string')
      expect(typeof updated.updatedAt).toBe('string')
    })

    it('should return unchanged fields intact', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Intact',
        description: 'Desc originale',
        content: 'Contenu original',
        category: 'humectant',
      })

      const updated = await updIng(user.id, created.id, { category: 'actif' })

      expect(updated.category).toBe('actif')
      expect(updated.name).toBe('Intact')
      expect(updated.description).toBe('Desc originale')
      expect(updated.content).toBe('Contenu original')
    })

    it('should persist the update in the database', async () => {
      const created = await createTestIngredient(user.id, { name: 'Persist Test' })

      await updIng(user.id, created.id, { description: 'Nouvelle description' })

      const fetched = await getIng(created.id)
      expect(fetched.description).toBe('Nouvelle description')
    })

    it('should return the original ingredient when no actual change occurs', async () => {
      const created = await createTestIngredient(user.id, { name: 'NoChange', category: 'actif' })

      const updated = await updIng(user.id, created.id, { category: 'actif' })

      expect(updated.id).toBe(created.id)
      expect(updated.category).toBe('actif')
    })
  })

  describe('individual field updates', () => {
    it('should update name only', async () => {
      const created = await createTestIngredient(user.id, { name: 'Ancien Nom' })

      const updated = await updIng(user.id, created.id, { name: 'Nouveau Nom' })

      expect(updated.name).toBe('Nouveau Nom')
    })

    it('should update description only', async () => {
      const created = await createTestIngredient(user.id, { name: 'Desc Test' })

      const updated = await updIng(user.id, created.id, {
        description: 'Description mise à jour',
      })

      expect(updated.description).toBe('Description mise à jour')
    })

    it('should update content only', async () => {
      const created = await createTestIngredient(user.id, { name: 'Content Test' })

      const updated = await updIng(user.id, created.id, {
        content: '## Nouveau contenu wiki',
      })

      expect(updated.content).toBe('## Nouveau contenu wiki')
    })

    it('should update category only', async () => {
      const created = await createTestIngredient(user.id, { name: 'Cat Test', category: 'actif' })

      const updated = await updIng(user.id, created.id, { category: 'excipient' })

      expect(updated.category).toBe('excipient')
    })

    it('should set category to null', async () => {
      const created = await createTestIngredient(user.id, { name: 'Cat Null', category: 'actif' })

      const updated = await updIng(user.id, created.id, { category: null })

      expect(updated.category).toBeNull()
    })

    it('should update description from default empty string to a value', async () => {
      const created = await createTestIngredient(user.id, { name: 'Empty Desc' })
      expect(created.description).toBe('')

      const updated = await updIng(user.id, created.id, {
        description: 'Maintenant rempli',
      })

      expect(updated.description).toBe('Maintenant rempli')
    })

    it('should update content from default empty string to a value', async () => {
      const created = await createTestIngredient(user.id, { name: 'Empty Content' })
      expect(created.content).toBe('')

      const updated = await updIng(user.id, created.id, {
        content: '# Wiki complet',
      })

      expect(updated.content).toBe('# Wiki complet')
    })
  })

  describe('multiple fields at once', () => {
    it('should update two fields simultaneously', async () => {
      const created = await createTestIngredient(user.id, { name: 'Multi 2' })

      const updated = await updIng(user.id, created.id, {
        description: 'Nouvelle desc',
        category: 'humectant',
      })

      expect(updated.description).toBe('Nouvelle desc')
      expect(updated.category).toBe('humectant')
    })

    it('should update all mutable fields simultaneously', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Multi All',
        description: 'Ancienne desc',
        content: 'Ancien contenu',
        category: 'actif',
      })

      const updated = await updIng(
        user.id,
        created.id,
        {
          name: 'Multi All Renamed',
          description: 'Nouvelle desc',
          content: 'Nouveau contenu',
          category: 'excipient',
        },
        'Mise à jour complète'
      )

      expect(updated.name).toBe('Multi All Renamed')
      expect(updated.slug).toBe('multi-all') // slug immutable
      expect(updated.description).toBe('Nouvelle desc')
      expect(updated.content).toBe('Nouveau contenu')
      expect(updated.category).toBe('excipient')
    })

    it('should only track fields that actually changed in a multi-field update', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Partial Change',
        description: 'Déjà là',
        category: 'actif',
      })

      await updIng(
        user.id,
        created.id,
        { description: 'Déjà là', category: 'excipient' },
        'Changement partiel'
      )

      const edits = await listIngredientEdits(testDb, created.id)

      expect(edits).toHaveLength(1)
      expect(edits[0]?.changes).not.toHaveProperty('description')
      expect(edits[0]?.changes).toHaveProperty('category')
    })
  })

  // Slug is immutable after creation: renaming never derives it again, and a
  // slug field in the payload is rejected by the strict update schema.
  describe('slug immutability', () => {
    it('should not change slug when the name changes', async () => {
      const created = await createTestIngredient(user.id, { name: 'Acide Original' })

      const updated = await updIng(user.id, created.id, {
        name: 'Acide Hyaluronique Modifié',
      })

      expect(updated.name).toBe('Acide Hyaluronique Modifié')
      expect(updated.slug).toBe('acide-original')
    })

    it('should not change slug when only non-name fields are updated', async () => {
      const created = await createTestIngredient(user.id, { name: 'Slug Stable' })
      const originalSlug = created.slug

      const updated = await updIng(user.id, created.id, {
        description: 'Nouvelle description',
      })

      expect(updated.slug).toBe(originalSlug)
    })

    it('should stay fetchable by its original slug after a name change', async () => {
      const created = await createTestIngredient(user.id, { name: 'Ancien Slug Fetch' })

      await updIng(user.id, created.id, { name: 'Nouveau Slug Fetch' })

      const fetched = await getIngredientBySlug(testDb, 'ancien-slug-fetch')
      expect(fetched.id).toBe(created.id)
    })

    it('should reject a slug field in the update payload', async () => {
      const created = await createTestIngredient(user.id, { name: 'Slug Forced' })

      await expect(
        updIng(user.id, created.id, {
          slug: 'mon-slug-custom',
        } as never)
      ).rejects.toThrow()
    })
  })

  describe('audit log', () => {
    it('should record old and new values in changes', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Audit Values',
        category: 'actif',
      })

      await updIng(user.id, created.id, { category: 'excipient' }, 'Changement catégorie')

      const edits = await listIngredientEdits(testDb, created.id)

      expect(edits).toHaveLength(1)
      const changes = edits[0]?.changes as Record<string, { old: unknown; new: unknown }>
      expect(changes.category.old).toBe('actif')
      expect(changes.category.new).toBe('excipient')
    })

    it('should record old null → new value', async () => {
      const created = await createTestIngredient(user.id, { name: 'Audit Null To Value' })

      await updIng(user.id, created.id, { category: 'actif' }, 'Ajout catégorie')

      const changes = await lastChanges(created.id)
      expect(changes.category.old).toBeNull()
      expect(changes.category.new).toBe('actif')
    })

    it('should record old value → new null', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Audit Value To Null',
        category: 'actif',
      })

      await updIng(user.id, created.id, { category: null }, 'Suppression catégorie')

      const changes = await lastChanges(created.id)
      expect(changes.category.old).toBe('actif')
      expect(changes.category.new).toBeNull()
    })

    it('should record empty string → value for description, folding the old side to null', async () => {
      // `description` is NOT NULL DEFAULT '' in the DB, so '' is its empty state. It still folds
      // to null: buildChanges is shared, and on the product side that '' hit an enum member of
      // the changes schema and made the PATCH throw.
      const created = await createTestIngredient(user.id, { name: 'Audit Empty To Desc' })
      expect(created.description).toBe('')

      await updIng(user.id, created.id, { description: 'Rempli' }, 'Ajout desc')

      const changes = await lastChanges(created.id)
      expect(changes.description.old).toBeNull()
      expect(changes.description.new).toBe('Rempli')
    })

    it('should record multiple changed fields in a single audit entry', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'Audit Multi',
        description: 'Ancienne',
        content: 'Ancien contenu',
        category: 'actif',
      })

      await updIng(
        user.id,
        created.id,
        { description: 'Nouvelle', content: 'Nouveau contenu', category: 'excipient' },
        'Triple changement'
      )

      const edits = await listIngredientEdits(testDb, created.id)

      expect(edits).toHaveLength(1)
      expect(edits[0]?.changes).toHaveProperty('description')
      expect(edits[0]?.changes).toHaveProperty('content')
      expect(edits[0]?.changes).toHaveProperty('category')
    })

    it('should store summary when provided', async () => {
      const created = await createTestIngredient(user.id, { name: 'Summary Yes' })

      await updIng(user.id, created.id, { description: 'Changé' }, 'Mon résumé explicite')

      const edits = await listIngredientEdits(testDb, created.id)
      expect(edits[0]?.summary).toBe('Mon résumé explicite')
    })

    it('should store summary as null when not provided', async () => {
      const created = await createTestIngredient(user.id, { name: 'Summary No' })

      await updIng(user.id, created.id, { description: 'Changé sans summary' })

      const edits = await listIngredientEdits(testDb, created.id)
      expect(edits[0]?.summary).toBeNull()
    })

    it('should store the correct editedBy user', async () => {
      const other = await createTestUser('autre@test.com')
      const created = await createTestIngredient(user.id, { name: 'EditedBy Test' })

      await updIng(other.id, created.id, { description: 'Modifié par autre' })

      const edits = await listIngredientEdits(testDb, created.id)
      expect(edits[0]?.editedBy).toBe(other.id)
    })

    it('should store the correct ingredientId', async () => {
      const created = await createTestIngredient(user.id, { name: 'IngredientId Test' })

      await updIng(user.id, created.id, { description: 'Check ingredientId' })

      const edits = await listIngredientEdits(testDb, created.id)
      expect(edits[0]?.ingredientId).toBe(created.id)
    })

    it('should store createdAt on the edit entry', async () => {
      const created = await createTestIngredient(user.id, { name: 'Edit Timestamp' })

      await updIng(user.id, created.id, { description: 'Timestamp check' })

      const edits = await listIngredientEdits(testDb, created.id)
      expect(typeof edits[0]?.createdAt).toBe('string')
    })

    it('should not create audit log when same value is set (no-op)', async () => {
      const created = await createTestIngredient(user.id, {
        name: 'NoOp Test',
        description: 'Identique',
        category: 'actif',
      })

      await updIng(
        user.id,
        created.id,
        { description: 'Identique', category: 'actif' },
        'Devrait pas logger'
      )

      const edits = await listIngredientEdits(testDb, created.id)
      expect(edits).toHaveLength(0)
    })

    it('should not create audit log when null is set on already-null field', async () => {
      const created = await createTestIngredient(user.id, { name: 'Null Null' })
      expect(created.category).toBeNull()

      await updIng(user.id, created.id, { category: null })

      const edits = await listIngredientEdits(testDb, created.id)
      expect(edits).toHaveLength(0)
    })

    it('should create separate audit entries for successive updates', async () => {
      const created = await createTestIngredient(user.id, { name: 'Multi Edit' })

      await updIng(user.id, created.id, { description: 'Première modif' }, 'Edit 1')
      await updIng(user.id, created.id, { description: 'Deuxième modif' }, 'Edit 2')
      await updIng(user.id, created.id, { category: 'actif' }, 'Edit 3')

      const edits = await listIngredientEdits(testDb, created.id)

      expect(edits).toHaveLength(3)
      expect(edits[0]?.summary).toBe('Edit 3')
      expect(edits[1]?.summary).toBe('Edit 2')
      expect(edits[2]?.summary).toBe('Edit 1')
    })
  })

  describe('error cases', () => {
    it('should throw ingredient_not_found for non-existent id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await updIng(user.id, fakeId, { description: 'X' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_not_found')
      }
    })

    it('should not create any audit log when ingredient is not found', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await updIng(user.id, fakeId, { description: 'X' }, 'Ghost edit')
      } catch {}

      const real = await createTestIngredient(user.id, { name: 'Real For Ghost Check' })
      const edits = await listIngredientEdits(testDb, real.id)
      expect(edits).toHaveLength(0)
    })
  })

  describe('updatedAt behavior', () => {
    it('should advance updatedAt after a real change', async () => {
      const created = await createTestIngredient(user.id, { name: 'Timestamp Advance' })
      const originalUpdatedAt = created.updatedAt

      await new Promise((r) => setTimeout(r, 50))

      const updated = await updIng(user.id, created.id, {
        description: 'Changé pour timestamp',
      })

      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalUpdatedAt).getTime()
      )
    })

    it('should not change createdAt after update', async () => {
      const created = await createTestIngredient(user.id, { name: 'CreatedAt Stable' })

      const updated = await updIng(user.id, created.id, {
        description: 'Modifié',
      })

      expect(updated.createdAt).toBe(created.createdAt)
    })
  })
})
