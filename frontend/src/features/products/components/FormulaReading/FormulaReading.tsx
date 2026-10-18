import type { PreferenceTargets } from '@aurore/shared'
import { filterRiskDriversAtDose } from '@aurore/shared'

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
import './FormulaReading.css'

type RiskAxis = keyof typeof RISK_AXIS_PHRASE
type BenefitAxis = keyof typeof BENEFIT_AXIS_PHRASE

// A missing slug has no ingredient page to link to
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
  // Catalogue filters use linked ingredients, not names parsed from INCI
  // A preference based on a parsed name could exclude this product
  linkedIngredients: readonly LinkedIngredient[]
  className?: string
  // The collection dialog already supplies h2
  headingLevel?: 'h2' | 'h3'
  title?: string
  foldRegulatory?: boolean
}

export function FormulaReading({
  assessment,
  viewerId,
  profileSlugs,
  linkedIngredients,
  preferenceTargets,
  className,
  headingLevel = 'h2',
  title = 'Lecture de la formule',
  foldRegulatory = false,
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

  // Preferences need a canonical key
  // Duplicate links share one choice
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
  // Missing dose evidence cannot support a dose claim
  // Every occurrence must qualify when the INCI repeats an ingredient
  const dosedInci = new Map<string, boolean>()
  for (const m of matchedEvidence) {
    const pass =
      !!m.roleAtDose &&
      m.roleAtDose.doseFactor >= DOSE_SIGNAL_MIN_DOSE_FACTOR &&
      m.roleAtDose.confidence >= DOSE_SIGNAL_MIN_CONFIDENCE
    dosedInci.set(m.inci, (dosedInci.get(m.inci) ?? true) && pass)
  }
  // Interaction drivers contain rule IDs and render separately
  const drivers = filterRiskDriversAtDose(
    explanation.topDrivers.filter((d) => d.source !== 'interaction' && d.axes.length > 0),
    matchedEvidence
  )
  // Engine notes are English, so only translated rules reach the page
  const interactionLines = interactions
    .map((i) => ({ id: i.id, phrase: INTERACTION_PHRASE[i.id] }))
    .filter((i): i is { id: string; phrase: string } => !!i.phrase)
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
    <section className={clsx('formula-reading', className)} aria-label={title}>
      <SectionHeader title={title} as={headingLevel} />

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
        <div className="formula-reading__group formula-reading__group--benefits">
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
                  {phrase && (
                    <span className="formula-reading__phrase">
                      <span className="formula-reading__separator"> : </span>
                      {phrase}
                    </span>
                  )}
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
        <div className="formula-reading__group formula-reading__group--notes">
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
                  {phrase && (
                    <span className="formula-reading__phrase">
                      <span className="formula-reading__separator"> : </span>
                      {phrase}
                    </span>
                  )}
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
                <span className="formula-reading__phrase">
                  <span className="formula-reading__separator"> : </span>
                  {line.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {regulatoryLines.length > 0 && (
        <details
          className="formula-reading__group formula-reading__regulatory"
          open={!foldRegulatory}
        >
          <summary>
            <Subhead className="formula-reading__subhead">
              <Scale size={13} aria-hidden="true" />
              Cadre réglementaire
            </Subhead>
          </summary>
          <p className="formula-reading__explainer">
            Ces repères concernent des ingrédients et les territoires cités. Leur présence ne permet
            pas de conclure à la conformité de ce produit, notamment sans concentration déclarée.
          </p>
          <ul role="list" className="formula-reading__list">
            {regulatoryLines.map((line) => (
              <li key={line.key} className="formula-reading__item">
                {line.label && <span className="formula-reading__label">{line.label}</span>}
                <span className="formula-reading__phrase">{line.text}</span>
              </li>
            ))}
          </ul>
        </details>
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
            // The collapsed list is unmounted, so its ID must not be referenced
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
              <ul role="list" id={declareListId} className="ui-stack-list">
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
