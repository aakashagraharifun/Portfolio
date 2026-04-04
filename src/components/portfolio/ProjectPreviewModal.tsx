import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, X, ArrowUpRight, Code2, Calendar, MapPin, Trophy } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectPreviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectPreviewModal({ project, isOpen, onClose }: ProjectPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex h-full max-h-[92vh] w-full max-w-[96rem] flex-col overflow-hidden border-2 border-black bg-[#f6f1e7] shadow-[18px_18px_0px_rgba(255,214,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-black bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  Project Preview
                </span>
                <span className="hidden max-w-[48vw] truncate text-[10px] font-black uppercase tracking-[0.25em] text-black/50 md:block">
                  {project.title}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex size-11 items-center justify-center border-2 border-black bg-white transition-colors hover:bg-black hover:text-primary"
                aria-label="Close project preview"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid min-h-full lg:grid-cols-[1.35fr_0.65fr]">
                <div className="border-b-2 border-black bg-[#fdfbf7] p-5 md:p-8 lg:border-b-0 lg:border-r-2">
                  <div className="relative flex min-h-[340px] items-start justify-center overflow-hidden border-2 border-black bg-[radial-gradient(circle_at_top_left,_rgba(255,214,0,0.18),_transparent_42%),linear-gradient(135deg,#ffffff_0%,#f6f1e7_100%)] p-2 md:min-h-[520px] md:p-4 lg:min-h-[640px]">
                    <img
                      src={project.coverImage || '/placeholder-project.jpg'}
                      alt={project.title}
                      className="w-full h-auto object-contain object-top"
                    />


                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="border-2 border-black bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black">
                        {project.category || 'Build'}
                      </span>
                      {project.highlight && (
                        <span className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                          {project.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-[#fbf8f1] p-5 md:p-8">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-black/55">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="size-4" />
                        {project.year}
                      </span>
                      {project.location && (
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="size-4" />
                          {project.location}
                        </span>
                      )}
                    </div>

                    {project.isHackathon && (
                      <div className="border-4 border-black bg-primary p-6 space-y-4 shadow-[8px_8px_0px_black] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Trophy className="size-24 -rotate-12" />
                        </div>
                        <div className="relative z-10 flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-black/60">
                            <Trophy className="size-3" />
                            <span>HACKATHON WIN</span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-black leading-none pt-1">
                            {project.hackathonPosition || 'Participant'}
                          </h3>
                          <p className="text-xs font-black uppercase tracking-widest text-black/40">@ {project.hackathonName || 'Incredible Event'}</p>
                        </div>
                        
                        {project.hackathonDescription && (
                          <div className="relative z-10 bg-white/30 backdrop-blur-sm p-4 border-2 border-black/10">
                            <p className="text-xs font-bold leading-relaxed text-black/80 italic">
                                "{project.hackathonDescription}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-2 border-black bg-white p-5 md:p-6">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-black/40">
                        Description
                      </p>
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-black/75 md:text-base">
                        {project.description || 'No project description has been added yet.'}
                      </p>
                    </div>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="border-2 border-black bg-white p-5 md:p-6">
                        <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-black/45">
                          <Code2 className="size-4" />
                          <span>Tech Stack</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="border-2 border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border-2 border-black bg-white p-5 md:p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-black md:text-5xl">
                          {project.title}
                        </h2>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-black/45">
                          {project.year} • {project.location || 'Build'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex size-14 items-center justify-center border-2 border-black bg-white transition-colors hover:bg-primary"
                            title="Open live project"
                          >
                            <ExternalLink className="size-5 text-black" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex size-14 items-center justify-center border-2 border-black bg-white transition-colors hover:bg-primary"
                            title="Open GitHub repository"
                          >
                            <Github className="size-5 text-black" />
                          </a>
                        )}
                        <Link
                          to={`/project/${project.slug}`}
                          className="flex size-14 items-center justify-center border-2 border-black bg-white transition-colors hover:bg-primary"
                          title="Open full project page"
                        >
                          <ArrowUpRight className="size-5 text-black" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
