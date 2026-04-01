import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  showCategory?: boolean;
  index?: number;
}

/**
 * BRUTALIST PROJECT CARD
 * High-impact, bold borders, yellow accents, and sharp typography
 * Now includes direct project & GitHub links
 */
export function ProjectCard({ 
  project, 
  aspectRatio, 
  showCategory = true,
  index = 0 
}: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const ratio = aspectRatio || 'landscape';
  
  const aspectRatioClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    square: 'aspect-square'
  };

  const hasExternalLinks = project.liveUrl || project.githubUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/project/${project.slug}`}
        className="group block relative border-2 border-border hover:border-primary transition-all duration-500 bg-white shadow-[0px_0px_0px_black] hover:shadow-[12px_12px_0px_rgba(255,214,0,1)]"
      >
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-accent/10', aspectRatioClasses[ratio])}>
          <motion.img
            src={project.coverImage || '/placeholder-project.jpg'}
            alt={project.title}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setIsLoaded(true)}
          />
          
          {/* Top Label */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-black text-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              {project.category || "Mission"}
            </div>
          </div>

          {/* External Link Buttons — hover-reveal, top-right */}
          {hasExternalLinks && (
            <div className="absolute top-4 right-4 z-20 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="size-9 bg-white border-2 border-black flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                  title="View Live"
                >
                  <ExternalLink className="size-4 text-black" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="size-9 bg-white border-2 border-black flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                  title="Source Code"
                >
                  <Github className="size-4 text-black" />
                </a>
              )}
            </div>
          )}

          {/* Bottom Label Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Box */}
        <div className="p-6 border-t-2 border-border group-hover:border-primary transition-colors flex justify-between items-end">
          <div className="space-y-1">
             <h3 className="text-2xl font-black uppercase tracking-tighter leading-none italic group-hover:text-primary transition-colors">
                {project.title}
             </h3>
             <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                {project.year} • {project.location || "Build"}
             </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick external links — always visible, compact */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="size-10 border-2 border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                title="View Live"
              >
                <ExternalLink className="size-4 text-black" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="size-10 border-2 border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                title="Source Code"
              >
                <Github className="size-4 text-black" />
              </a>
            )}
            <div className="size-12 border-2 border-border group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all">
               <ArrowUpRight className="size-5 text-black" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
