import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, BookOpen, Star, Plus } from 'lucide-react';

/**
 * WINDOWED GALLERY SECTION (HOMEPAGE)
 * Distinctive 'Untitled' Window UI for 4 Featured Moments.
 */
export function GallerySection({ images }: { images: any[] }) {
  const featured = images.slice(0, 4);

  return (
    <section className="py-24 md:py-32 bg-white px-6 md:px-12 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">LIVE FEED.</div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none italic">
               MOMENTS <br />CAPTURED.
            </h2>
          </div>
          <Link 
            to="/gallery" 
            className="group h-16 px-12 border-4 border-black font-black uppercase text-xs tracking-widest flex items-center gap-4 hover:bg-black hover:text-primary transition-all"
          >
            VIEW ALL <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </Link>
        </div>

        {/* BRUTALIST WINDOW UI */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="relative max-w-4xl mx-auto"
        >
           {/* Window Header */}
           <div className="bg-[#1a1a1a] h-12 border-4 border-black border-b-0 flex items-center px-6 justify-between rounded-t-xl overflow-hidden shadow-[20px_20px_0px_rgba(255,214,0,1)]">
              <div className="flex gap-2">
                 <div className="size-3 rounded-full bg-[#FF5F57]" />
                 <div className="size-3 rounded-full bg-[#FFBD2E]" />
                 <div className="size-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">untitled_moments.jpg</span>
              <div className="w-12 h-1 bg-white/10 rounded" />
           </div>

           {/* Window Body - 4-Pic Grid */}
           <div className="bg-[#1a1a1a] p-3 md:p-6 border-4 border-black rounded-b-xl grid grid-cols-2 gap-3 md:gap-6 shadow-[20px_20px_0px_rgba(255,214,0,1)]">
              {featured.length > 0 ? featured.map((img, i) => (
                <div key={img.id} className="aspect-[4/3] bg-[#2a2a2a] overflow-hidden group border-2 border-white/5 relative">
                   <img 
                    src={img.image_url} 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt={img.caption || 'Moment'} 
                   />
                   <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors pointer-events-none" />
                </div>
              )) : (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-[#2a2a2a] flex items-center justify-center border-2 border-white/5">
                     <Camera className="text-white/10 size-12" />
                  </div>
                ))
              )}
           </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * BLOG FEED SECTION
 */
export function BlogSection({ blogs }: { blogs: any[] }) {
  return (
    <section className="py-24 md:py-32 bg-white px-6 md:px-12 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-24 space-y-4">
           <div className="bg-black text-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">THE JOURNAL.</div>
           <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none italic">LATEST <br />STORIES.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.length > 0 ? blogs.map((blog, i) => (
            <motion.div 
               key={blog.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="group border-t-2 border-black pt-8 space-y-6"
            >
               <span className="text-[10px] font-black uppercase tracking-[.3em] text-muted-foreground italic">
                 {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
               </span>
               <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-tight group-hover:text-primary transition-colors">
                 {blog.title}
               </h3>
               <p className="text-lg text-black/60 font-medium line-clamp-3">
                 {blog.excerpt}
               </p>
               <Link to={`/blog/${blog.slug}`} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                  READ ARTICLE <ArrowRight size={16} />
               </Link>
            </motion.div>
          )) : (
            <div className="col-span-3 h-48 border-4 border-dashed border-black/10 flex items-center justify-center font-black uppercase text-black/20 italic">No chronicles found.</div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * SKILLS MARQUEE SECTION
 */
export function SkillsSection({ skills }: { skills: any[] }) {
  return (
    <section className="py-24 bg-white border-t-2 border-black selection:bg-black selection:text-primary overflow-hidden">
       <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex justify-between items-end">
          <div className="space-y-4">
            <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">BATTLE TESTED.</div>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic">TECH STACK.</h2>
          </div>
       </div>

       <div className="flex gap-4 px-4 overflow-hidden mask-fade-horizontal">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 whitespace-nowrap"
          >
             {[...skills, ...skills, ...skills].map((skill, i) => (
                <div key={`${skill.id}-${i}`} className="h-20 px-10 border-4 border-black bg-white flex items-center gap-4 hover:bg-primary transition-all group">
                   <Star className="size-5 fill-current opacity-20 group-hover:opacity-100" />
                   <span className="text-2xl font-black uppercase italic tracking-tighter">{skill.name}</span>
                </div>
             ))}
          </motion.div>
       </div>
    </section>
  );
}
