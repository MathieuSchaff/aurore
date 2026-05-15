import { Footer } from '../Footer/Footer'
import { Hero, type HeroVariant } from '../Hero/Hero'
import { AppEntriesSection } from '../sections/AppEntriesSection'
import { FinalCTASection } from '../sections/FinalCTASection'
import { FlowSection } from '../sections/FlowSection'
import { PhilosophySection } from '../sections/PhilosophySection'
import { PillarsSection } from '../sections/PillarsSection'
import { ProblemSection } from '../sections/ProblemSection'

import './HomePage.css'

export type HomePageProps = {
  /**
   * Switch hero positioning if you want to A/B test in production.
   * Default 'base' = "Votre skincare, au même endroit." (recommended).
   */
  heroVariant?: HeroVariant
}

/**
 * Aurore homepage — version foret light, Hero A "Base personnelle".
 *
 * Composition (in render order):
 *   - Hero (Base by default)
 *   - 01 · Problem
 *   - 02 · Pillars
 *   - 03 · App entries
 *   - 04 · Flow
 *   - 05 · Philosophy (deep bg)
 *   - Final CTA
 *   - Footer
 *
 * Le thème est piloté par les attributs `data-theme` / `data-variant` posés sur <html>
 * par le ThemeToggle existant du repo. Aucun JS interne à cette page n'est requis.
 */
export function HomePage({ heroVariant = 'base' }: HomePageProps) {
  return (
    <div className="aur-page">
      <main>
        <Hero variant={heroVariant} />
        <ProblemSection />
        <PillarsSection />
        <AppEntriesSection />
        <FlowSection />
        <PhilosophySection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}
