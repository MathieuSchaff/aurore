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
  heroVariant?: HeroVariant
}

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
