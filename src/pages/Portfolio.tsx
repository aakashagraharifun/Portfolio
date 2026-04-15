import { useState, useEffect } from 'react';
import { getAllProjects } from '@/services/projectService';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { ProjectPreviewModal } from '@/components/portfolio/ProjectPreviewModal';
import { SEOHead } from '@/components/seo/SEOHead';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Project } from '@/types';

/**
 * Portfolio page with live dynamic project grid
 * Connects to your Supabase CMS for real-time project management
 */
export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
      setLoading(false);
    }
    loadProjects();
  }, []);

  return (
    <>
      <SEOHead 
        title="Projects"
        description="Browse my complete archive — hackathon-winning projects, web apps, startup contributions, and creative experiments."
      />
      
      <div className="min-h-screen bg-white">
        {/* Simplified Header - No Hero Section */}
        <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="inline-block bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black mb-4">THE ARCHIVE</div>
          <p className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight max-w-3xl">
            Every project is a story — hackathon sprints, shipped products, and creative experiments.
          </p>
        </section>

        {/* Dynamic Portfolio Grid */}
        <section className="pb-24 px-2 md:px-4 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-16 animate-spin opacity-20 text-primary" />
          </div>
        ) : projects.length > 0 ? (
          <PortfolioGrid projects={projects} onOpenProject={setSelectedProject} />
        ) : (
          <div className="text-center py-24 space-y-4">
            <p className="text-muted-foreground font-light">The archive is currently empty.</p>
            <p className="text-sm font-light uppercase tracking-widest text-primary/50">Stand by for upcoming builds.</p>
          </div>
        )}
      </section>

        {/* Bottom spacing */}
        <div className="h-24" />

        <ProjectPreviewModal
          project={selectedProject}
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </>
  );
}
