import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  showCategory?: boolean;
  index?: number;
  onOpen?: (project: Project) => void;
}

/**
 * BRUTALIST PROJECT CARD
 * Opens a floating preview instead of navigating away.
 */
export function ProjectCard({
  project,
  aspectRatio,
  showCategory = true,
  index = 0,
  onOpen
}: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const ratio = aspectRatio || 'landscape';

  const aspectRatioClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    square: 'aspect-square'
  };

  const hasExternalLinks = project.liveUrl || project.githubUrl;
  const handleOpen = () => onOpen?.(project);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpen();
          }
        }}
        className="group relative block cursor-pointer border-2 border-border bg-white shadow-[0px_0px_0px_black] transition-all duration-500 hover:border-primary hover:shadow-[12px_12px_0px_rgba(255,214,0,1)] focus:outline-none focus-visible:border-primary focus-visible:shadow-[12px_12px_0px_rgba(255,214,0,1)]"
        aria-label={`Open preview for ${project.title}`}
      >
        <div className={cn('relative overflow-hidden bg-accent/10', aspectRatioClasses[ratio])}>
          <motion.img
            src={project.coverImage || '/placeholder-project.jpg'}
            alt={project.title}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-700 grayscale group-hover:scale-105 group-hover:grayscale-0',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setIsLoaded(true)}
          />

          <div className="absolute top-4 left-4 z-20">
            {project.isPinned && (
              <div className="mb-2 w-fit border-2 border-black bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black">
                Pinned
              </div>
            )}
            {showCategory && (
              <div className="translate-y-2 bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {project.category || 'Mission'}
              </div>
            )}
          </div>

          {hasExternalLinks && (
            <div className="absolute top-4 right-4 z-20 flex gap-2 translate-y-2 opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-9 items-center justify-center border-2 border-black bg-white transition-all duration-300 hover:border-primary hover:bg-primary"
                  title="View live project"
                >
                  <ExternalLink className="size-4 text-black" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-9 items-center justify-center border-2 border-black bg-white transition-all duration-300 hover:border-primary hover:bg-primary"
                  title="View source code"
                >
                  <Github className="size-4 text-black" />
                </a>
              )}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="flex items-end justify-between border-t-2 border-border p-6 transition-colors group-hover:border-primary">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none italic transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {project.year} • {project.location || 'Build'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="flex size-10 items-center justify-center border-2 border-border transition-all duration-300 hover:border-primary hover:bg-primary"
                title="View live project"
              >
                <ExternalLink className="size-4 text-black" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="flex size-10 items-center justify-center border-2 border-border transition-all duration-300 hover:border-primary hover:bg-primary"
                title="View source code"
              >
                <Github className="size-4 text-black" />
              </a>
            )}
            <div className="flex size-12 items-center justify-center border-2 border-border transition-all group-hover:border-primary group-hover:bg-primary">
              <ArrowUpRight className="size-5 text-black" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
