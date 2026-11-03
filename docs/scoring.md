# Formula assessment

Aurore can analyse a product formula from its INCI list.

The goal is not to give medical advice or to tell users what to buy.

The goal is simpler: help users understand a formula, compare products, and keep track of useful warnings or benefits while doing their own research.

The assessment is computed on the backend.
The frontend receives the assessment payload; the ingredient dataset stays on the backend.

---

## What it is

The formula assessment looks at an INCI list and returns a short summary.

It can help answer questions like:

- does this formula contain ingredients that may be irritating?
- does it contain useful ingredient families?
- how much of the INCI list was actually recognised?
- is the result reliable enough to trust, or should it be treated carefully?

It is a research helper, not a medical verdict.

---

## What it is not

The assessment is not:

- a medical diagnosis;
- a treatment recommendation;
- a dermatology opinion;
- a safety score;
- a universal product ranking;
- a guarantee that a product will work;
- a guarantee that a product is compliant with regulations.

Aurore does not try to say: “this product is good” or “this product is bad”.

It gives context so the user can make their own decision.

---

## Engine

The assessment logic lives in a separate library called `algo-derm`.

`algo-derm` is versioned and MIT licensed.

In Aurore, it is included in the backend as a vendored tarball:

```text
vendor/algo-derm.tgz
```

This means the app can be built and run without access to a private package registry.

The ingredient dataset and scoring logic stay on the backend.
They are not shipped to the browser.

---

## Input

The backend calls `analyzeINCI`.

The main input is the ordered INCI list.

The written order is part of the declaration. Alphabetical ordering and other qualifications
can limit what ingredient position says; recognition alone does not establish a concentration.

The analysis can also use optional context, such as:

- leave-on or rinse-off product;
- formula type, for example serum, cream, gel, cleanser, lotion or sunscreen;
- estimated pH;
- concentration claims from the packaging;
- user profile context, such as sensitive skin, acne-prone skin, rosacea or pregnancy.

---

## Output

One route serves the assessment:

```text
GET /api/products/:slug/dermo-score
```

It is public. A bearer token is optional, and only changes the user profile passed to the engine.

The response is the full `ProductAssessment` envelope that `algo-derm` returns, with two additions
made by Aurore. `algo-derm` also ships a flattened summary helper; Aurore does not use it.

Top level:

- `rating`: `low`, `medium` or `high`;
- `overallRisk`: a bounded risk signal between `0` and `1`;
- `confidence`: a bounded number;
- `confidenceLabel`: the wording that goes with it;
- `coverage`: `matched`, `heuristicOnly`, `unmatched`, `total` and `ratio`;
- `productAxisRisk`: the risk per axis;
- `productBenefits`: the benefit per axis;
- `contributors`: the per-ingredient contributions behind those two;
- `interactions`: signals that come from a pair of ingredients, not from one;
- `matchedEvidence`: what the evidence database recognised;
- `unmatchedIngredients`: what it did not;
- `heuristicFlags`: what was guessed from a pattern instead of curated evidence;
- `regulatoryNotes` and `regulatoryFindings`;
- `declarationOnlyRisk`: true when a risk rests on the declaration alone;
- `context`: the leave-on flag and formula type used for the run.

`explanation` carries what the product page reads:

- `topRiskAxis` and `topDrivers`;
- `topBenefitAxis` and `topBenefitDrivers`;
- `confidenceFactors`: why confidence landed where it did;
- `limitationNotes`: what the reading cannot tell.

The two Aurore additions:

- `ingredientSignals`, so the page can show a signal next to each ingredient;
- an `ingredientSlug` on every driver of `topDrivers` and `topBenefitDrivers`, so a driver links to
  its ingredient page without a second request.

Product and ingredient tags are not in this response. They are stored in the database and served by
the product routes.

The engine also builds an `ingredientResolution` object. It is deliberately nonenumerable, so it
never reaches the JSON payload and stays available for debugging and audit surfaces on the backend.

---

## How the assessment works

The result is based on three main things.

### 1. Ingredient signals

The engine looks at known ingredient properties.

Some ingredients can bring possible benefits.
Some can bring possible risks.
Some are mostly neutral or depend heavily on context.

### 2. Product context

The same ingredient can matter differently depending on the product.

For example:

- leave-on vs rinse-off;
- cleanser vs serum;
- low or high pH;
- sensitive skin;
- acne-prone skin;
- rosacea;
- pregnancy.

The engine uses this context to adjust the assessment.

### 3. Confidence

The engine also checks how much of the INCI list it actually understands.

If many ingredients are unknown, the result becomes less confident.

A high rating with low confidence should not be shown as a strong signal.

---

## Unknown ingredients

Unknown ingredients do not break the analysis.

Instead, they:

- lower the confidence;
- lower the coverage ratio;
- appear in the explanation layer.

They are not silently ignored.

Aurore shows caveats when:

- confidence is low;
- coverage is below `0.6`;
- the result is based only on declaration-level information;
- regulatory notes are present.

Regulatory notes are informational only.
They are not a compliance certificate.

---

## Scraped INCI lists

INCI lists from retailer websites are often messy.

They can contain:

- broken separators;
- marketing text;
- labels;
- legal text;
- formatting errors.

The assessment service prepares the stored INCI with `cleanInciString` before calling
`analyzeINCI`. This read-side preparation does not update the catalogue.

Storage uses a separate governed normalizer during creation, editing and catalogue ingest,
with conservation checks for declarations and damage evidence. Ingredient linking, preview
tokens, preview suggestions and historical cleanups have their own contracts.
A declared quantity is not automatically a structured known concentration, and a retained
optional declaration does not by itself authorize a certain ingredient link.

See [catalogue intake and normalization](commands/catalog.md),
[linking and cleanup safeguards](commands/data-writes.md), and [data audits](commands/data-audits.md).
The engine also resolves aliases internally; resolving a name does not validate its source.
Catalogue statistics and taxonomy findings use their own SQL scopes and counting units.
They do not measure assessment confidence or ingredient identity coverage.

---

## Limits

The assessment has clear limits.

It does not provide:

- medical advice;
- diagnosis;
- treatment advice;
- clinical efficacy prediction;
- exact formula reconstruction;
- guaranteed regulatory compliance;
- full routine-level interaction modelling.

The engine is still pre-1.0.

Its calibration can change between versions.

The tag definitions are versioned with `TAG_DEFS_VERSION`, and the app pins the version it consumes.

---

## Integration and tests

The backend integration lives in:

```text
backend/src/features/dermo-score/
```

It follows the usual backend pattern:

```text
Route → Service → DB
```

The integration tests use the real engine output, not only mocks.

They check things like:

- risk bounds;
- coverage;
- valid `rating` values;
- behaviour on a real INCI string.

## Data maintenance and transport provenance

Applying a bounded ingredient-link change does not itself adopt a new engine, validate a
manufacturer source or recalculate stored tags. Keep engine comparison, data reconciliation
and delivery evidence separate. See [data operation controls](commands/data-writes.md#evidence-for-a-bounded-data-change).
A correction to the Bun/Drizzle timestamp decoder affects transport of audit instants,
not the formula model, evidence grades or calibration. Exact operation receipts retain
PostgreSQL precision under the [date contract](conventions/dates.md).
