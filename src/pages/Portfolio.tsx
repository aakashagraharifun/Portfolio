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
      
      <div className="min-h-screen">
        {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-6 lg:px-8 border-b border-border bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4">
              Projects
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
              Every project is a story — hackathon sprints, shipped products, and creative experiments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Portfolio Grid */}
      <section className="py-12 md:py-16 px-2 md:px-4 min-h-[400px]">
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
