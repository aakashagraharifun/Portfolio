import { SEOHead } from '@/components/seo/SEOHead';
import { JourneyTimeline } from '@/components/portfolio/JourneyTimeline';

export default function Timeline() {
  return (
    <>
      <SEOHead
        title="Timeline & Journey"
        description="The full milestone journey of Aakash Agrahari — first lines of code, hackathon wins, startup contributions, and the latest shipped builds."
        keywords={['Aakash Agrahari timeline', 'Developer journey', 'Builder milestones']}
      />

      <div className="min-h-screen bg-white">
        <JourneyTimeline />
      </div>
    </>
  );
}
