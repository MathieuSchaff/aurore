import { productDetailSchema, productsPageSchema } from '@aurore/shared'

import { expect, type Page, test } from '@playwright/test'

import { loginAsSeed, registerFreshUser } from './helpers/auth'
import { gotoFirstProductDetail, resolveFirstSkincareSlug } from './helpers/catalog'
import { gotoSettled, waitForHydration, waitForSettledUrl } from './helpers/hydration'

function isApi(req: { url(): string }, path: string | RegExp): boolean {
  const u = req.url()
  if (typeof path === 'string') return u.endsWith(`/api${path}`)
  return path.test(u)
}

function detailedCollectionAction(page: Page) {
  return page.getByRole('button', {
    name: /Ajouter avec un statut ou un achat|Modifier ce produit dans ma collection/,
  })
}

// page.route cannot see the first SSR load, so mocked detail specs enter through the list
async function clientNavigateToDetail(
  page: Page,
  slug: string,
  listUrl = '/products?sort=name&profile_filter=false'
): Promise<void> {
  await gotoSettled(page, listUrl)
  const productLink = page.locator(`.list-card--product a[href="/products/${slug}"]`).first()
  await productLink.waitFor({ state: 'visible' })
  await productLink.click()
  await expect(page).toHaveURL(new RegExp(`/products/${slug}$`), { timeout: 15_000 })
}

test.beforeEach(async ({ page }) => {
  await loginAsSeed(page)
})

test.describe('Product detail: Modifier', () => {
  // Read-only tests. The tests that PATCH this product live in
  // product-edit.mutation.spec.ts (single-project file).
  test('"Modifier" button navigates to edit page with form prefilled', async ({ page }) => {
    const slug = await gotoFirstProductDetail(page)

    const productName = await page.getByRole('heading', { level: 1 }).innerText()

    await page.getByRole('link', { name: /Modifier/ }).click()

    await expect(page).toHaveURL(new RegExp(`/products/${slug}/edit$`))
    await expect(page.locator('#edit-name')).toHaveValue(productName)
    await expect(page.locator('#product-form-brand')).not.toHaveValue('')
    await expect(
      page.getByRole('radiogroup', { name: 'Type de produit' }).locator('label.chip--active')
    ).toBeVisible()
    await expect(
      page
        .getByRole('radiogroup', { name: 'Conditionnement du produit' })
        .locator('label.chip--active')
    ).toBeVisible()
  })

  test('"Annuler" returns to detail without firing PATCH', async ({ page }) => {
    const slug = await gotoFirstProductDetail(page)
    await page.getByRole('link', { name: /Modifier/ }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${slug}/edit$`))

    let patched = false
    page.on('request', (req) => {
      if (req.method() === 'PATCH' && /\/api\/products\//.test(req.url())) patched = true
    })

    await page.locator('#edit-notes').fill('this never gets sent')
    await page.getByRole('link', { name: 'Annuler', exact: true }).click()

    await expect(page).toHaveURL(new RegExp(`/products/${slug}$`))
    expect(patched).toBe(false)
  })
})

test.describe('Product detail: Ajouter à la collection (top-right)', () => {
  test('opens modal seeded with the current product', async ({ page }) => {
    await gotoFirstProductDetail(page)
    const productName = await page.getByRole('heading', { level: 1 }).innerText()
    const brand = await page.locator('.product-hero__eyebrow a').innerText()

    await detailedCollectionAction(page).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText(`${productName} · ${brand}`)).toBeVisible()
  })

  test('"Liste de souhaits" POSTs /user-products with current productId', async ({ page }) => {
    await gotoFirstProductDetail(page)

    await detailedCollectionAction(page).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const postPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && isApi(req, '/user-products')
    )

    await dialog.getByRole('button', { name: 'Liste de souhaits', exact: true }).click()

    const req = await postPromise
    const body = req.postDataJSON()
    expect(body.status).toBe('wishlist')
    expect(body.productId).toMatch(/^[0-9a-f-]{36}$/)

    await expect(dialog).toBeHidden({ timeout: 5_000 })
  })

  test('quick save adds a fresh user product as watched without opening the modal', async ({
    page,
  }) => {
    await registerFreshUser(page)
    await gotoFirstProductDetail(page)

    const postPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && isApi(req, '/user-products')
    )
    await page.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' }).click()

    const req = await postPromise
    expect(req.postDataJSON()).toMatchObject({ status: 'watched' })
    expect(req.headers().authorization).toMatch(/^Bearer /)
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(
      page.getByRole('button', { name: /Dans votre collection : Garde un œil/ })
    ).toBeVisible()
  })

  test('anonymous save redirects to login and preserves the product URL', async ({ page }) => {
    await page.context().clearCookies()
    const slug = await gotoFirstProductDetail(page)

    await page.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' }).click()

    await expect(page).toHaveURL(
      new RegExp(`/auth/login\\?redirect=%2Fproducts%2F${encodeURIComponent(slug)}$`)
    )
  })
})

test.describe('Product detail: Discussions tab', () => {
  test('switching to Discussions updates URL and shows form opener', async ({ page }) => {
    const slug = await gotoFirstProductDetail(page)

    await page.getByRole('tab', { name: /Discussions/ }).click()

    await expect(page).toHaveURL(new RegExp(`/products/${slug}/discussions`))
    await expect(page.getByRole('tab', { name: /Discussions/, selected: true })).toBeVisible()

    // Logged in, so ThreadForm is collapsed: "Ouvrir une discussion" CTA visible.
    // Waiting for it also acts as a proof the outlet's data has resolved before
    // the next test action, avoiding skeleton/transition click-interception.
    await expect(page.getByRole('button', { name: 'Ouvrir une discussion' })).toBeVisible({
      timeout: 10_000,
    })
  })

  test('opening discussion form reveals Sujet + Votre message inputs', async ({ page }) => {
    await gotoFirstProductDetail(page)
    await page.getByRole('tab', { name: /Discussions/ }).click()

    await page.getByRole('button', { name: 'Ouvrir une discussion' }).click()

    await expect(page.getByRole('heading', { name: 'Nouvelle discussion' })).toBeVisible()
    await expect(page.getByLabel(/^Sujet/)).toBeVisible()
    await expect(page.getByLabel(/^Votre message/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Publier la discussion' })).toBeVisible()
  })

  test('switching back to Infos returns to product info section', async ({ page }) => {
    const slug = await gotoFirstProductDetail(page)

    await page.getByRole('tab', { name: /Discussions/ }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${slug}/discussions`))
    // Wait for the discussions outlet to fully render before clicking back.
    await expect(page.getByRole('button', { name: 'Ouvrir une discussion' })).toBeVisible({
      timeout: 10_000,
    })

    await page.getByRole('tab', { name: 'Infos', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${slug}$`))
    await expect(
      page.getByRole('tab', { name: 'Infos', exact: true, selected: true })
    ).toBeVisible()
  })

  // Regression: the back button must return to the filtered list, not strand on
  // the product's own Infos tab. Tabs navigate with replace:true so opening
  // Discussions doesn't push a history entry that history.back() would land on.
  test('"Produits" back button returns to the filtered list, not the previous tab', async ({
    page,
  }) => {
    await page.goto('/products?category=skincare&sort=name')
    await expect(page).toHaveURL(/[?&]sort=name/)
    // Client-side nav from here on, so history.back() has a list entry to return to.
    await waitForHydration(page)
    await waitForSettledUrl(page)

    const firstCard = page.locator('.list-card--product a[href^="/products/"]').first()
    await expect(firstCard).toBeVisible({ timeout: 15_000 })
    await firstCard.click()
    await expect(page).toHaveURL(/\/products\/[^/]+$/)

    await page.getByRole('tab', { name: /Discussions/ }).click()
    await expect(page).toHaveURL(/\/discussions/)
    await expect(page.getByRole('button', { name: 'Ouvrir une discussion' })).toBeVisible({
      timeout: 10_000,
    })

    await page.getByRole('button', { name: 'Produits' }).click()

    // Back on the list with its search params intact, which proves history.back() ran
    // and that the Discussions tab did not stack an extra history entry.
    await expect(page).toHaveURL(/\/products\?[^/]*sort=name/)
  })
})

test.describe('Product detail: Lecture de la formule', () => {
  // FormulaReading only mounts when the product has an INCI.
  async function findSlugWithInci(page: Page): Promise<string> {
    const list = await page.request.get('/api/products?category=skincare&sort=name&limit=10')
    expect(list.ok()).toBe(true)
    const items = productsPageSchema.parse((await list.json()).data).items
    for (const item of items) {
      const detail = await page.request.get(`/api/products/${item.slug}`)
      if (!detail.ok()) continue
      if (productDetailSchema.parse((await detail.json()).data).inci) return item.slug
    }
    throw new Error('no seed product with an INCI in the first 10 skincare products')
  }

  async function gotoWithAssessment(page: Page, slug: string, assessment: unknown): Promise<void> {
    const detail = await page.request.get(`/api/products/${slug}`)
    expect(detail.ok()).toBe(true)
    const product = productDetailSchema.parse((await detail.json()).data)

    await page.route(`**/api/products/${slug}/page`, async (route) => {
      const response = await route.fetch()
      const json = await response.json()
      json.data.assessment = assessment
      await route.fulfill({ response, json })
    })

    await clientNavigateToDetail(
      page,
      slug,
      `/products?q=${encodeURIComponent(product.name)}&profile_filter=false`
    )
  }

  test('shows composition signals separately from the skin reading', async ({ page }) => {
    const slug = await findSlugWithInci(page)
    const assessment = {
      explanation: {
        topDrivers: [],
        topBenefitDrivers: [],
        confidenceFactors: [],
      },
      regulatoryFindings: [],
      interactions: [],
      coverage: { matched: 1, total: 4 },
      matchedEvidence: [],
      ingredientSignals: [
        {
          ingredient: 'PTFE',
          kind: 'pfas',
          confidence: 'high',
          note: 'Raw upstream wording must not reach the page.',
        },
        {
          ingredient: 'Polyethylene',
          kind: 'synthetic_polymer',
          confidence: 'low',
          note: 'Raw upstream wording must not reach the page.',
        },
      ],
    }

    await gotoWithAssessment(page, slug, assessment)

    const section = page.locator('.formula-reading')
    await expect(section.getByRole('heading', { name: 'Repères de composition' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(section.getByText(/famille des PFAS/i)).toBeVisible()
    await expect(section.getByText(/particule solide/)).toBeVisible()
    await expect(section.getByText('Raw upstream wording must not reach the page.')).toHaveCount(0)
    await expect(section.getByText('Rien de notable dans cette formule')).toHaveCount(0)
  })

  test('tag shows only for drivers whose roleAtDose passes the cut', async ({ page }) => {
    const slug = await findSlugWithInci(page)

    const passing = {
      activeRole: 'exfoliant',
      doseFactor: 0.9,
      confidence: 0.8,
      basis: 'concentration',
    }
    const failing = {
      activeRole: 'exfoliant',
      doseFactor: 0.2,
      confidence: 0.8,
      basis: 'concentration',
    }
    const estimate = { meanPct: 8, ciLowPct: 5, ciHighPct: 11 }

    // Deterministic oracle over both driver groups: a passing benefit driver, a
    // passing risk driver, one below the cut, and a bundle-style duplicated inci
    // where only one occurrence passes (must stay silent). Exactly two tags.
    const assessment = {
      explanation: {
        topDrivers: [
          {
            label: 'Salicylic Acid',
            inci: 'SALICYLIC ACID',
            source: 'matchedEvidence',
            axes: ['irritation'],
            contribution: 0.6,
          },
          {
            label: 'Citric Acid',
            inci: 'CITRIC ACID',
            source: 'matchedEvidence',
            axes: ['irritation'],
            contribution: 0.5,
          },
        ],
        topBenefitDrivers: [
          {
            label: 'Glycolic Acid',
            inci: 'GLYCOLIC ACID',
            axes: ['brightening'],
            contribution: 0.8,
          },
          { label: 'Lactic Acid', inci: 'LACTIC ACID', axes: ['brightening'], contribution: 0.4 },
        ],
        // Caveats must coexist with signals, not only with the empty state.
        confidenceFactors: [
          {
            factor: 'heuristic_only',
            description: 'Heuristic detections are pattern-based signals.',
            impact: 'negative',
          },
        ],
      },
      regulatoryFindings: [],
      interactions: [],
      coverage: { matched: 4, total: 6 },
      matchedEvidence: [
        {
          ingredient: 'glycolic acid',
          inci: 'GLYCOLIC ACID',
          concentrationEstimate: estimate,
          roleAtDose: passing,
        },
        {
          ingredient: 'lactic acid',
          inci: 'LACTIC ACID',
          concentrationEstimate: estimate,
          roleAtDose: failing,
        },
        {
          ingredient: 'salicylic acid',
          inci: 'SALICYLIC ACID',
          concentrationEstimate: estimate,
          roleAtDose: passing,
        },
        {
          ingredient: 'citric acid',
          inci: 'CITRIC ACID',
          concentrationEstimate: estimate,
          roleAtDose: passing,
        },
        {
          ingredient: 'citric acid',
          inci: 'CITRIC ACID',
          concentrationEstimate: estimate,
          roleAtDose: failing,
        },
      ],
    }

    await gotoWithAssessment(page, slug, assessment)

    const section = page.locator('.formula-reading')
    await expect(section).toBeVisible({ timeout: 15_000 })
    await expect(section.getByText('Lactic Acid')).toBeVisible()
    await expect(section.getByText('Citric Acid')).toBeVisible()

    // Glycolic (benefit) + Salicylic (risk) pass; Lactic is below the cut and
    // Citric has a below-cut duplicate occurrence, so neither gets the tag.
    const tags = section.locator('.formula-reading__dose-tag')
    await expect(tags).toHaveCount(2)
    await expect(tags.first()).toHaveText('probablement dosé pour agir')

    await expect(section.getByText(/reposent sur le nom des ingrédients/)).toBeVisible()
  })

  test('shows only declared and defensible solver concentrations', async ({ page }) => {
    const slug = await findSlugWithInci(page)
    const prior = { meanPct: 10, ciLowPct: 8, ciHighPct: 12 }
    const assessment = {
      explanation: {
        topDrivers: [],
        topBenefitDrivers: [],
        confidenceFactors: [],
      },
      regulatoryFindings: [],
      interactions: [],
      coverage: { matched: 4, total: 4 },
      matchedEvidence: [
        {
          ingredient: 'Niacinamide',
          inci: 'Niacinamide',
          concentrationEstimate: { ...prior, claimPct: 15 },
        },
        {
          ingredient: 'Glycerin',
          inci: 'Glycerin',
          concentrationEstimate: {
            ...prior,
            solverMeanPct: 10,
            solverCiLowPct: 5,
            solverCiHighPct: 15,
          },
        },
        {
          ingredient: 'Glycerin',
          inci: 'Glycerin',
          concentrationEstimate: {
            ...prior,
            solverMeanPct: 10,
            solverCiLowPct: 8,
            solverCiHighPct: 12,
          },
        },
        {
          ingredient: 'Panthenol',
          inci: 'Panthenol',
          concentrationEstimate: prior,
        },
      ],
    }

    await gotoWithAssessment(page, slug, assessment)

    const section = page.locator('.formula-concentrations')
    await expect(section).toBeVisible({ timeout: 15_000 })
    await expect(section.getByText('15\u00a0% (déclaré)')).toBeVisible()
    await expect(section.getByText('~8–12\u00a0%')).toBeVisible()
    await expect(section.getByText('Glycerin')).toHaveCount(1)
    await expect(section.getByText('présent · dose non estimable')).toBeVisible()
    await expect(section.getByText(/Indicatif, non confirmé par la marque/)).toBeVisible()
  })

  test('driver labels link to the ingredient page only when a slug is resolved', async ({
    page,
  }) => {
    const slug = await findSlugWithInci(page)

    // Mixed rendering is the norm: resolved labels become links, unresolved
    // ones stay deliberate plain text (never a search-page fallback).
    const assessment = {
      explanation: {
        topDrivers: [
          {
            label: 'Salicylic Acid',
            inci: 'Salicylic Acid',
            source: 'matchedEvidence',
            axes: ['irritation'],
            contribution: 0.6,
            ingredientSlug: 'salicylic-acid',
          },
          {
            label: 'Limonene',
            inci: 'Limonene',
            source: 'matchedEvidence',
            axes: ['irritation'],
            contribution: 0.4,
            ingredientSlug: null,
          },
        ],
        topBenefitDrivers: [
          {
            label: 'Niacinamide',
            inci: 'Niacinamide',
            axes: ['brightening'],
            contribution: 0.8,
            ingredientSlug: 'niacinamide',
          },
        ],
        confidenceFactors: [],
      },
      regulatoryFindings: [],
      interactions: [],
      coverage: { matched: 3, total: 5 },
      matchedEvidence: [],
    }

    await gotoWithAssessment(page, slug, assessment)

    const section = page.locator('.formula-reading')
    await expect(section).toBeVisible({ timeout: 15_000 })

    await expect(section.getByRole('link', { name: 'Niacinamide' })).toHaveAttribute(
      'href',
      '/ingredients/niacinamide'
    )
    await expect(section.getByRole('link', { name: 'Salicylic Acid' })).toHaveAttribute(
      'href',
      '/ingredients/salicylic-acid'
    )
    await expect(section.getByText('Limonene')).toBeVisible()
    await expect(section.getByRole('link', { name: 'Limonene' })).toHaveCount(0)
  })

  test('says so instead of vanishing when the assessment surfaces nothing', async ({ page }) => {
    const slug = await findSlugWithInci(page)

    // Assessment ran fine but found nothing to surface: the section must state
    // it calmly, with the confidence caveat, rather than disappear (silence is
    // indistinguishable from an error).
    const assessment = {
      explanation: {
        topDrivers: [],
        topBenefitDrivers: [],
        confidenceFactors: [
          {
            factor: 'low_coverage',
            description: 'Low database coverage; score reliability is reduced.',
            impact: 'negative',
          },
        ],
      },
      regulatoryFindings: [],
      interactions: [],
      coverage: { matched: 1, total: 8 },
      matchedEvidence: [],
    }

    await gotoWithAssessment(page, slug, assessment)

    const section = page.locator('.formula-reading')
    await expect(section).toBeVisible({ timeout: 15_000 })
    await expect(section.getByText('Rien de notable dans cette formule')).toBeVisible()
    await expect(section.getByText(/pas assez de contexte/)).toBeVisible()
    await expect(section.getByText(/1 ingrédient reconnu sur 8/)).toBeVisible()
  })
})

test.describe('Product detail: Profil de la formule', () => {
  // Both tests fetch-then-modify the detail endpoint under test. Deliberate
  // deviation from the rule that says do not mock the stack: the assertions need a tag
  // mix no seed product guarantees. Only data.tags is rewritten.

  async function mockDetailTags(
    page: Page,
    slug: string,
    tags: Array<{ relevance: string; tagName: string; tagSlug: string; tagCategory: string }>
  ): Promise<void> {
    await page.route(`**/api/products/${slug}/page`, async (route) => {
      const response = await route.fetch()
      const json = await response.json()
      json.data.product.tags = tags.map((t, i) => ({
        ...t,
        productTagId: `mock-tag-${i}`,
        productId: json.data.product.id,
      }))
      await route.fulfill({ response, json })
    })
  }

  test('groups neutral tags by category, hides avoid and off-scope ones', async ({ page }) => {
    const slug = await resolveFirstSkincareSlug(page)

    // One tag per rendered category, plus an avoid-relevance tag and an
    // off-scope category: both must stay hidden and their rows self-hide.
    const tags = [
      {
        relevance: 'secondary',
        tagName: 'Rétinoïdes',
        tagSlug: 'retinoides',
        tagCategory: 'actif_class',
      },
      {
        relevance: 'primary',
        tagName: 'Apaisant',
        tagSlug: 'apaisant',
        tagCategory: 'skin_effect',
      },
      {
        relevance: 'secondary',
        tagName: 'Matifiant',
        tagSlug: 'matifiant',
        tagCategory: 'skin_effect',
      },
      {
        relevance: 'secondary',
        tagName: 'Traitement',
        tagSlug: 'step-traitement',
        tagCategory: 'routine_step_v2',
      },
      { relevance: 'avoid', tagName: 'Visage', tagSlug: 'zone-visage', tagCategory: 'skin_zone' },
      {
        relevance: 'secondary',
        tagName: 'Peaux sensibles',
        tagSlug: 'peaux-sensibles',
        tagCategory: 'concern',
      },
    ]

    await mockDetailTags(page, slug, tags)

    await clientNavigateToDetail(page, slug)

    const section = page.locator('.formula-profile')
    await expect(section).toBeVisible({ timeout: 15_000 })
    await expect(section.getByRole('heading', { name: 'Profil de la formule' })).toBeVisible()

    await expect(section.getByText("Famille d'actif")).toBeVisible()
    await expect(section.getByText('Rétinoïdes')).toBeVisible()
    await expect(section.getByText('Apaisant')).toBeVisible()
    await expect(section.getByText('Matifiant')).toBeVisible()
    await expect(section.getByText('Traitement')).toBeVisible()

    // Avoid-relevance tag hidden and its whole category row self-hides.
    await expect(section.getByText('Visage')).toHaveCount(0)
    await expect(section.getByText('Zone', { exact: true })).toHaveCount(0)
    // concern is not part of the formula profile block.
    await expect(section.getByText('Peaux sensibles')).toHaveCount(0)
  })

  test('whole block self-hides when no tag survives the filters', async ({ page }) => {
    const slug = await resolveFirstSkincareSlug(page)

    await mockDetailTags(page, slug, [
      { relevance: 'avoid', tagName: 'Visage', tagSlug: 'zone-visage', tagCategory: 'skin_zone' },
      {
        relevance: 'secondary',
        tagName: 'Peaux sensibles',
        tagSlug: 'peaux-sensibles',
        tagCategory: 'concern',
      },
    ])

    await clientNavigateToDetail(page, slug)

    // "En bref" proves the Infos tab rendered (the first seed product has a kind).
    await expect(page.getByRole('heading', { name: 'En bref' })).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.formula-profile')).toHaveCount(0)
  })
})
