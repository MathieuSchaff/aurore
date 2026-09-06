import type { PreferenceTargets } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
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
import type { ProductDermoAssessment } from '@/lib/queries/products'
import { avoidedIngredientNames } from './avoidedIngredients'
import { formatIngredientSignals } from './ingredientSignals'
import { formatRegulatoryFindings } from './regulatoryFindings'
import { filterRiskDriversAtDose } from './riskDrivers'
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
  assessment: ProductDermoAssessment | null
  viewerId: string | null
  profileSlugs: ReadonlySet<string>
  preferenceTargets: PreferenceTargets
  // Rows of product_ingredients, the only source the catalogue filter can honour.
  // Driver labels below are parsed from products.inci and diverge from it, so a
  // rule declared on a driver could hide this very product.
  linkedIngredients: readonly LinkedIngredient[]
  className?: string
  // h2 under the catalogue page's h1
  // h3 inside the collection sheet, whose dialog title is already the h2
  headingLevel?: 'h2' | 'h3'
}

// Surfaces the algo-derm assessment: signals and their reason, never a score or
// verdict (excluded by the product vision).
export function FormulaReading({
  assessment,
  viewerId,
  profileSlugs,
  linkedIngredients,
  preferenceTargets,
  className,
  headingLevel = 'h2',
}: FormulaReadingProps) {
  const [declareOpen, setDeclareOpen] = useState(false)
  const declareListId = useId()
  const Subhead = headingLevel === 'h2' ? 'h3' : 'h4'

  const relevantAxes = useMemo(() => {
    const axes = new Set<RiskAxis>()
    for (const s of profileSlugs) {
      for (const axis of PROFILE_RELEVANT_AXES[s as keyof typeof PROFILE_RELEVANT_AXES] ?? []) {
        axes.add(axis)
      }
    }
    return axes
  }, [profileSlugs])

  // Unkeyed sheets carry no identity a preference can attach to, so they are
  // absent. Two sheets can share a key; keep the first name.
  const declarable = useMemo(() => {
    const nameByKey = new Map<string, string>()
    for (const i of linkedIngredients) {
      if (i.ingredientCanonicalKey && !nameByKey.has(i.ingredientCanonicalKey)) {
        nameByKey.set(i.ingredientCanonicalKey, i.ingredientName)
      }
    }
    return [...nameByKey].map(([canonicalKey, name]) => ({ canonicalKey, name }))
  }, [linkedIngredients])

  const avoidedNames = useMemo(
    () => avoidedIngredientNames(declarable, preferenceTargets.ingredients),
    [declarable, preferenceTargets]
  )
  const stanceByCanonicalKey = useMemo(
    () =>
      new Map(preferenceTargets.ingredients.map((target) => [target.canonicalKey, target.stance])),
    [preferenceTargets.ingredients]
  )

  if (!assessment) return null

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
  const drivers = filterRiskDriversAtDose(
    explanation.topDrivers.filter((d) => d.source !== 'interaction' && d.axes.length > 0),
    matchedEvidence
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
    <section className={clsx('formula-reading', className)}>
      <SectionHeader title="Lecture de la formule" as={headingLevel} />

      {!hasSignal && <p className="formula-reading__empty">{NO_SIGNAL_PHRASE}</p>}

      {avoidedNames.length > 0 && (
        <div className="formula-reading__group">
          <Subhead className="formula-reading__subhead">
            <Bookmark size={13} aria-hidden="true" />
            {AVOIDED_HEADING}
          </Subhead>
          <p className="formula-reading__explainer">{avoidedInFormulaPhrase(avoidedNames)}</p>
        </div>
      )}

      {benefitDrivers.length > 0 && (
        <div className="formula-reading__group">
          <Subhead className="formula-reading__subhead">
            <Sparkles size={13} aria-hidden="true" />
            Points forts
          </Subhead>
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
          <Subhead className="formula-reading__subhead">À noter dans cette formule</Subhead>
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
          <Subhead className="formula-reading__subhead">Repères de composition</Subhead>
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
          <Subhead className="formula-reading__subhead">
            <Scale size={13} aria-hidden="true" />
            Cadre réglementaire
          </Subhead>
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
          <Subhead className="formula-reading__subhead">
            <GitMerge size={13} aria-hidden="true" />
            Interactions
          </Subhead>
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

      {viewerId && declarable.length > 0 && (
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
                      currentStance={stanceByCanonicalKey.get(i.canonicalKey) ?? null}
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
        {coverage.matched > 1 ? 's' : ''} sur les {coverage.total} de la liste INCI · pas un avis
        médical.
      </p>
    </section>
  )
}
