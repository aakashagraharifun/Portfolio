import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { photographerInfo } from '@/data/photographer';
import { getFeaturedProjects, getHomepageTimeline, getLatestBlogs, getGalleryImages, getSkills } from '@/services/contentService';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectPreviewModal } from '@/components/portfolio/ProjectPreviewModal';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArrowRight, Loader2, Play, MousePointer2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '@/types';
import { JourneyTimeline } from '@/components/portfolio/JourneyTimeline';
import { GallerySection, BlogSection, SkillsSection } from '@/components/portfolio/PublicSections';
import { F1PageLoader } from '@/components/layout/F1PageLoader';

/**
 * MASTER HOMEPAGE - THE BUILDER STATEMENT
 * Bold Light Mode, Electric Yellow Accents, Modern Typography
 */
export default function Home() {
  const [data, setData] = useState({ 
    projects: [] as Project[], 
    blogs: [] as any[], 
    gallery: [] as any[], 
    skills: [] as any[],
    timeline: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        // Using Promise.allSettled so one failing fetch doesn't crash the WHOLE site
        const results = await Promise.allSettled([
          getFeaturedProjects(4),
          getLatestBlogs(3),
          getGalleryImages(8, true),
          getSkills(),
          getHomepageTimeline()
        ]);
        
        setData({ 
          projects: results[0].status === 'fulfilled' ? results[0].value : [],
          blogs: results[1].status === 'fulfilled' ? results[1].value : [],
          gallery: results[2].status === 'fulfilled' ? results[2].value : [],
          skills: results[3].status === 'fulfilled' ? results[3].value : [],
          timeline: results[4].status === 'fulfilled' ? results[4].value : []
        });
      } catch (err) {
        console.error("Home Data Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loaderVisible) return (
    <F1PageLoader onComplete={() => setLoaderVisible(false)} />
  );

  return (
    <>
      <SEOHead />
      
      <div className="min-h-screen bg-white">
        {/* BIG STATEMENT HERO - Veeshal Inspired */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-primary px-6 md:px-12 selection:bg-black selection:text-primary pt-24 pb-24 md:pt-28 md:pb-32">
          <div className="absolute inset-0 z-0">
             <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-10 grayscale mix-blend-overlay">
                <source src="/hero-video.mp4" type="video/mp4" />
             </video>
          </div>

          <div className="relative z-10 w-full max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <span className="bg-black text-primary px-3 py-1 font-black text-xs uppercase tracking-widest inline-block">PORTFOLIO 2026</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/50">GUWAHATI • INDIA, BUTWAL • NEPAL</span>
              </div>
              <h1 className="text-[20vw] md:text-[18vw] leading-[0.8] font-black uppercase tracking-tighter text-black select-none pointer-events-none">
                BUILDER<br /><span className="text-transparent stroke-black" style={{ WebkitTextStroke: '2px black' }}>CREATOR.</span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 max-w-3xl space-y-8"
            >
              <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-black leading-tight border-l-8 border-black pl-6">
                BUILDER, FULL STACK DEVELOPER, AI ENTHUSIAST
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/portfolio" className="group h-16 px-10 bg-black text-primary flex items-center gap-3 font-black uppercase text-sm tracking-widest hover:bg-black/90 transition-all shadow-[8px_8px_0px_white] hover:shadow-none">
                  VIEW PROJECTS <ArrowRight className="size-4 transition-transform group-hover:translate-x-2" />
                </Link>
                <div className="h-16 w-16 border-4 border-black flex items-center justify-center cursor-pointer hover:bg-black hover:text-primary transition-all">
                  <Play className="size-6 fill-current" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Projects with BIG TYPE */}
        {data.projects.length > 0 && (
          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-4">
                  <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">SELECTED BUILDS</div>
                  <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none italic">THE ARIVE.</h2>
                </div>
                <Link 
                  to="/portfolio" 
                  className="group h-16 px-12 border-4 border-black font-black uppercase text-xs tracking-widest flex items-center gap-4 hover:bg-black hover:text-primary transition-all mb-4"
                >
                  VIEW ALL <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-8 max-w-7xl mx-auto">
              {data.projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  aspectRatio="landscape"
                  index={index}
                  onOpen={setSelectedProject}
                />
              ))}
            </div>
          </section>
        )}

        {/* Journey - Interactive Scroll Path */}
        <JourneyTimeline items={data.timeline.length > 0 ? data.timeline : undefined} />

        {/* Gallery */}
        {data.gallery.length > 0 && <GallerySection images={data.gallery} />}

        {/* Skills Marquee */}
        <SkillsSection skills={data.skills} />
        
        {/* CTA Banner */}
        <section className="py-12 md:py-16 bg-white border-t-2 border-border mb-12">
            <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-8">
                 <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic">WANT TO <br />START?</h2>
                 <Link to="/contact" className="h-16 px-12 bg-primary text-black border-4 border-black flex items-center font-black uppercase text-sm tracking-widest hover:bg-black hover:text-primary transition-all">
                    BUILD TOGETHER
                 </Link>
            </div>
        </section>

        <ProjectPreviewModal
          project={selectedProject}
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </>
  );
}
