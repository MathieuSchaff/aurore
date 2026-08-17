import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Bookmark, ChevronDown, GitMerge, Info, Scale, Sparkles } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import {
  BENEFIT_AXIS_PHRASE,
  CONFIDENCE_FACTOR_PHRASE,
  DOSE_SIGNAL_MIN_CONFIDENCE,
  DOSE_SIGNAL_MIN_DOSE_FACTOR,
  DOSE_SIGNAL_PHRASE,
  INTERACTION_PHRASE,
  NO_SIGNAL_PHRASE,
  PROFILE_RELEVANT_AXES,
  RISK_AXIS_PHRASE,
} from '@/constants/derm'
import { AVOIDED_HEADING, avoidedInFormulaPhrase } from '@/constants/preferences'
import { IngredientMarkButtons } from '@/features/profile/components/IngredientMarkButtons/IngredientMarkButtons'
import { productQueries } from '@/lib/queries/products'
import { preferenceTargetQueries } from '@/lib/queries/profile'
import { avoidedIngredientNames } from './avoidedIngredients'
import { formatIngredientSignals } from './ingredientSignals'
import { formatRegulatoryFindings } from './regulatoryFindings'
import './FormulaReading.css'

type RiskAxis = keyof typeof RISK_AXIS_PHRASE
type BenefitAxis = keyof typeof BENEFIT_AXIS_PHRASE

// Unresolved labels (~35%) are the norm, not an error: plain text on purpose,
// never a link to an empty search page.
function DriverLabel({ label, slug }: { label: string; slug: string | null }) {
  if (!slug) return <span className="formula-reading__label">{label}</span>
  return (
    <Link
      to="/ingredients/$slug"
      params={{ slug }}
      className="formula-reading__label formula-reading__label--link"
    >
      {label}
    </Link>
  )
}

type LinkedIngredient = {
  ingredientName: string
  ingredientCanonicalKey: string | null
}

interface FormulaReadingProps {
  slug: string
  userKey: string | null
  profileSlugs: ReadonlySet<string>
  // Rows of product_ingredients, the only source the catalogue filter can honour.
  // Driver labels below are parsed from products.inci and diverge from it, so a
  // rule declared on a driver could hide this very product.
  linkedIngredients: readonly LinkedIngredient[]
}

// Surfaces the algo-derm assessment: signals and their reason, never a score or
// verdict (excluded by the product vision).
export function FormulaReading({
  slug,
  userKey,
  profileSlugs,
  linkedIngredients,
}: FormulaReadingProps) {
  const { data: assessment, isError } = useQuery(productQueries.dermoScore(slug, userKey))
  const { data: preferenceTargets } = useQuery({
    ...preferenceTargetQueries.list(),
    enabled: !!userKey,
  })
  const [declareOpen, setDeclareOpen] = useState(false)
  const declareListId = useId()

  const relevantAxes = useMemo(() => {
    const axes = new Set<RiskAxis>()
    for (const s of profileSlugs) {
      for (const axis of PROFILE_RELEVANT_AXES[s] ?? []) axes.add(axis)
    }
    return axes
  }, [profileSlugs])

  // Unkeyed sheets carry no identity a preference can attach to, so they are
  // absent (F3). Two sheets can share a key; keep the first name.
  const declarable = useMemo(() => {
    const nameByKey = new Map<string, string>()
    for (const i of linkedIngredients) {
      if (i.ingredientCanonicalKey && !nameByKey.has(i.ingredientCanonicalKey)) {
        nameByKey.set(i.ingredientCanonicalKey, i.ingredientName)
      }
    }
    return [...nameByKey].map(([canonicalKey, name]) => ({ canonicalKey, name }))
  }, [linkedIngredients])

  // The query is client-side on an SSR'd page, so `preferenceTargets` is
  // undefined while it loads and when it fails alike; showing nothing then is
  // the honest default — a mention is never denied, only deferred.
  const avoidedNames = useMemo(
    () => avoidedIngredientNames(declarable, preferenceTargets?.ingredients),
    [declarable, preferenceTargets]
  )

  // Loading and errors stay silent; an assessed formula with nothing to
  // surface must say so instead (a mute vanish reads the same as a failure).
  if (isError || !assessment) return null

  const {
    explanation,
    ingredientSignals,
    regulatoryFindings,
    interactions,
    coverage,
    matchedEvidence,
  } = assessment
  const ingredientSignalLines = formatIngredientSignals(ingredientSignals ?? [])
  const regulatoryLines = formatRegulatoryFindings(regulatoryFindings)
  // roleAtDose exists only for ingredients with an authored role curve (today:
  // exfoliants); absence means "no dose signal", not "not dosed to act".
  // Bundle INCI can repeat one inci at different doses while rendered drivers
  // are deduped upstream: every occurrence must pass the cut, silence otherwise.
  const dosedInci = new Map<string, boolean>()
  for (const m of matchedEvidence) {
    const pass =
      !!m.roleAtDose &&
      m.roleAtDose.doseFactor >= DOSE_SIGNAL_MIN_DOSE_FACTOR &&
      m.roleAtDose.confidence >= DOSE_SIGNAL_MIN_CONFIDENCE
    dosedInci.set(m.inci, (dosedInci.get(m.inci) ?? true) && pass)
  }
  // Keep ingredient/heuristic signals only; interaction rules render in their own
  // section with a human note (their topDrivers label is a raw rule id). Drop drivers
  // with no axis: matched evidence that carries no concern is noise here.
  const drivers = explanation.topDrivers.filter(
    (d) => d.source !== 'interaction' && d.axes.length > 0
  )
  // The lib's own `note` is English curator prose; only a rule with FR phrasing
  // reaches the page, the rest go quiet rather than leak it.
  const interactionLines = interactions
    .map((i) => ({ id: i.id, phrase: INTERACTION_PHRASE[i.id] }))
    .filter((i): i is { id: string; phrase: string } => !!i.phrase)
  // Benefit drivers carry no `source` and are never interaction-derived; keep all.
  const benefitDrivers = explanation.topBenefitDrivers.filter((d) => d.axes.length > 0)
  const hasSignal =
    avoidedNames.length > 0 ||
    benefitDrivers.length > 0 ||
    drivers.length > 0 ||
    ingredientSignalLines.length > 0 ||
    regulatoryLines.length > 0 ||
    interactionLines.length > 0

  const caveats = explanation.confidenceFactors
    .map((f) => CONFIDENCE_FACTOR_PHRASE[f.factor])
    .filter((phrase): phrase is string => !!phrase)

  return (
    <section className="formula-reading product-section">
      <SectionHeader title="Lecture de la formule" as="h2" />

      {!hasSignal && <p className="formula-reading__empty">{NO_SIGNAL_PHRASE}</p>}

      {avoidedNames.length > 0 && (
        <div className="formula-reading__group">
          <h3 className="formula-reading__subhead">
            <Bookmark size={13} aria-hidden="true" />
            {AVOIDED_HEADING}
          </h3>
          <p className="formula-reading__explainer">{avoidedInFormulaPhrase(avoidedNames)}</p>
        </div>
      )}

      {benefitDrivers.length > 0 && (
        <div className="formula-reading__group">
          <h3 className="formula-reading__subhead">
            <Sparkles size={13} aria-hidden="true" />
            Points forts
          </h3>
          <ul role="list" className="formula-reading__list">
            {benefitDrivers.map((d) => {
              const phrase = (d.axes as BenefitAxis[])
                .map((a) => BENEFIT_AXIS_PHRASE[a])
                .filter(Boolean)
                .join(', ')
              return (
                <li key={d.label} className="formula-reading__item">
                  <DriverLabel label={d.label} slug={d.ingredientSlug} />
                  {phrase && <span className="formula-reading__phrase"> — {phrase}</span>}
                  {d.inci && dosedInci.get(d.inci) && (
                    <span className="formula-reading__dose-tag">{DOSE_SIGNAL_PHRASE}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {drivers.length > 0 && (
        <div className="formula-reading__group">
          <h3 className="formula-reading__subhead">À noter dans cette formule</h3>
          <ul role="list" className="formula-reading__list">
            {drivers.map((d) => {
              const axes = d.axes as RiskAxis[]
              const relevant = axes.some((a) => relevantAxes.has(a))
              const phrase = axes
                .map((a) => RISK_AXIS_PHRASE[a])
                .filter(Boolean)
                .join(', ')
              return (
                <li
                  key={`${d.label}-${d.source}`}
                  className="formula-reading__item"
                  data-relevant={relevant || undefined}
                >
                  <DriverLabel label={d.label} slug={d.ingredientSlug} />
                  {phrase && <span className="formula-reading__phrase"> — {phrase}</span>}
                  {d.inci && dosedInci.get(d.inci) && (
                    <span className="formula-reading__dose-tag">{DOSE_SIGNAL_PHRASE}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {ingredientSignalLines.length > 0 && (
        <div className="formula-reading__group">
          <h3 className="formula-reading__subhead">Repères de composition</h3>
          <p className="formula-reading__explainer">
            Ces repères décrivent la composition. Ils restent séparés de la lecture cutanée.
          </p>
          <ul role="list" className="formula-reading__list">
            {ingredientSignalLines.map((line) => (
              <li key={line.key} className="formula-reading__item">
                <span className="formula-reading__label">{line.label}</span>
                <span className="formula-reading__phrase"> — {line.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {regulatoryLines.length > 0 && (
        <div className="formula-reading__group">
          <h3 className="formula-reading__subhead">
            <Scale size={13} aria-hidden="true" />
            Cadre réglementaire
          </h3>
          <p className="formula-reading__explainer">
            Restrictions et interdictions officielles applicables à certains ingrédients.
          </p>
          <ul role="list" className="formula-reading__list">
            {regulatoryLines.map((line) => (
              <li key={line.key} className="formula-reading__item">
                {line.label && <span className="formula-reading__label">{line.label}</span>}
                <span className="formula-reading__phrase">{line.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {interactionLines.length > 0 && (
        <div className="formula-reading__group">
          <h3 className="formula-reading__subhead">
            <GitMerge size={13} aria-hidden="true" />
            Interactions
          </h3>
          <ul role="list" className="formula-reading__list">
            {interactionLines.map((i) => (
              <li key={i.id} className="formula-reading__item">
                {i.phrase}
              </li>
            ))}
          </ul>
        </div>
      )}

      {caveats.length > 0 && (
        <div className="formula-reading__caveats">
          {caveats.map((phrase) => (
            <p key={phrase} className="formula-reading__caveat">
              {phrase}
            </p>
          ))}
        </div>
      )}

      {userKey && declarable.length > 0 && (
        <div className="formula-reading__declare">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeclareOpen((open) => !open)}
            aria-expanded={declareOpen}
            // The list is unmounted while collapsed, so pointing at its id would
            // leave a dangling reference for assistive tech.
            aria-controls={declareOpen ? declareListId : undefined}
          >
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`formula-reading__declare-chevron${
                declareOpen ? ' formula-reading__declare-chevron--open' : ''
              }`}
            />
            Utiliser un ingrédient de cette formule dans mes recherches
          </Button>

          {declareOpen && (
            <div className="formula-reading__declare-panel">
              <p className="formula-reading__explainer">
                « Sans » retire de vos recherches les produits qui en contiennent, « Avec » n'y
                garde que ceux qui en contiennent au moins un. Retirable d'un tap depuis votre
                profil.
              </p>
              <ul
                role="list"
                id={declareListId}
                className="formula-reading__declare-list ui-stack-list"
              >
                {declarable.map((i) => (
                  <li key={i.canonicalKey}>
                    <IngredientMarkButtons
                      canonicalKey={i.canonicalKey}
                      name={i.name}
                      stances={['exclude', 'require']}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="formula-reading__footnote">
        <Info size={12} aria-hidden="true" />
        Estimation sur {coverage.matched} ingrédient{coverage.matched > 1 ? 's' : ''} reconnu
        {coverage.matched > 1 ? 's' : ''} sur {coverage.total} · pas un avis médical.
      </p>
    </section>
  )
}
