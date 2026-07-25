import { HeroSection } from '../components/sections/HeroSection'
import { StatsBar } from '../components/sections/StatsBar'
import { ServicesGrid } from '../components/sections/ServicesGrid'
import { FleetShowcase } from '../components/sections/FleetShowcase'
import { WhyNETS } from '../components/sections/WhyNETS'
import { IndustriesSection } from '../components/sections/IndustriesSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { CTABanner } from '../components/sections/CTABanner'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <FleetShowcase />
      <WhyNETS />
      <IndustriesSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  )
}
