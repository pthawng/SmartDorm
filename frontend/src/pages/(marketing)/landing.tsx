/**
 * Landing Page — composes property-search feature.
 * THIN PAGE: No business logic. Only composition.
 */

import {
  HeroSection,
  StatsBar,
  FeaturedProperties,
  HowItWorks,
  CTASection,
} from '@/features/property-search';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedProperties />
      <HowItWorks />
      <CTASection />
    </>
  );
}
