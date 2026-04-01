import { SEOHead } from '@/components/seo/SEOHead';
import { JourneyTimeline } from '@/components/portfolio/JourneyTimeline';

export default function Timeline() {
  return (
    <>
      <SEOHead
        title="Timeline"
        description="Explore the full milestone journey from the first step to the latest build."
      />

      <div className="min-h-screen bg-white">
        <JourneyTimeline />
      </div>
    </>
  );
}
