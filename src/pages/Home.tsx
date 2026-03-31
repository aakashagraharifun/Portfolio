import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { photographerInfo } from '@/data/photographer';
import { getFeaturedProjects } from '@/services/projectService';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '@/types';
import { JourneyTimeline } from '@/components/portfolio/JourneyTimeline';

/**
 * Homepage with live Supabase data fetching
 * Showcases Aakash's best work with real-time updates from the admin portal
 */
export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const projects = await getFeaturedProjects(4);
      setFeaturedProjects(projects);
      setLoading(false);
    }
    loadProjects();
  }, []);

  return (
    <>
      <SEOHead />
      
      <div className="min-h-screen">
        {/* Hero Section - Immersive Split Layout */}
        <section className="relative h-screen w-full overflow-hidden bg-background">
          <div className="absolute inset-0 z-0">
            {/* Subtle base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
            
            {/* Background Video - Subtle Layer */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-20 grayscale"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Content Side */}
            <motion.div 
              className="w-full md:w-1/2 text-left space-y-8 mt-20 md:mt-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium tracking-widest uppercase rounded-full border border-primary/20">
                    Portfolio 2026
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tighter leading-none text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <span className="block">{photographerInfo.name.split(' ')[0]}</span>
                  <span className="block font-medium text-primary/90">{photographerInfo.name.split(' ')[1]}</span>
                </motion.h1>
              </div>

              <motion.div
                className="space-y-6 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground border-l-2 border-primary/30 pl-6">
                  {photographerInfo.tagline}
                </p>
                
                <p className="text-lg font-light leading-relaxed text-muted-foreground/80">
                  {photographerInfo.heroIntroduction}
                </p>

                <div className="pt-4">
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-sm text-sm font-light tracking-widest hover:bg-foreground/90 transition-all group"
                  >
                    VIEW PROJECTS
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Image Side - Aakash with Trophy */}
            <motion.div 
              className="w-full md:w-1/2 relative flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative aspect-[3/4] w-full max-w-md group">
                <div className="absolute -inset-4 bg-primary/5 rounded-sm -z-10 blur-2xl transition-colors duration-700" />
                <div className="absolute -top-8 -right-8 w-32 h-32 border-t border-right border-primary/20 rounded-tr-3xl -z-10" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 border-b border-left border-primary/20 rounded-bl-3xl -z-10" />
                
                <div className="relative h-full w-full overflow-hidden rounded-sm shadow-2xl border border-white/10">
                  <img 
                    src="/hero-aakash.jpg" 
                    alt="Aakash Agrahari holding trophy" 
                    className="h-full w-full object-cover grayscale-[20%] relative z-10 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-20" />
                  <div className="absolute bottom-6 left-6 z-30">
                    <span className="text-white text-xs font-light tracking-widest uppercase opacity-80 block mb-1">GCU Hackathon Winner</span>
                    <span className="text-white text-xl font-medium tracking-tight">EUPHUISM 2026</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <ScrollIndicator />
          </motion.div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-24 md:py-32 border-t border-border bg-accent/5">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4 px-6">
              <h2 className="text-4xl md:text-5xl font-light tracking-wide">
                Selected Works
              </h2>
              <p className="text-lg text-muted-foreground font-light tracking-wide">
                A showcase of technical innovation and product design
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 md:px-8 max-w-7xl mx-auto">
            {loading ? (
              <div className="col-span-full flex items-center justify-center h-64">
                <Loader2 className="size-12 animate-spin opacity-20" />
              </div>
            ) : (
              featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  aspectRatio="landscape"
                  showCategory={true}
                  index={index}
                />
              ))
            )}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="flex justify-center mt-20 px-6">
              <Link
                to="/portfolio"
                className="group relative inline-flex items-center gap-3 text-lg font-light tracking-widest text-foreground py-2"
              >
                <span>EXPLORE ALL ARCHIVES</span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* The Animated Path Journey Section */}
        <JourneyTimeline />
      </div>
    </>
  );
}
