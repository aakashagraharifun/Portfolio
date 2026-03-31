import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';
import { getLatestBlogs } from '@/services/contentService';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, BookOpen } from 'lucide-react';

/**
 * MASTER BLOG HUB
 * A high-impact journal listing all builder chronicles.
 */
export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getLatestBlogs(100);
      setBlogs(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="size-12 animate-spin text-primary" />
    </div>
  );

  return (
    <>
      <SEOHead title="Blog — Aakash Agrahari" description="The technical journal of a builder and creator." />
      
      <div className="min-h-screen bg-white pt-48 pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-24 space-y-4">
             <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">THE JOURNAL.</div>
             <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-none">JOURNAL.</h1>
          </div>

          <div className="space-y-16">
            {blogs.length > 0 ? blogs.map((blog, i) => (
              <motion.article 
                key={blog.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative border-t-8 border-black pt-12 grid grid-cols-1 md:grid-cols-4 gap-12"
              >
                <div className="md:col-span-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">
                     {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                   </span>
                </div>
                
                <div className="md:col-span-3 space-y-8">
                   <Link to={`/blog/${blog.slug}`} className="block group underline-offset-8 decoration-primary decoration-8 hover:underline">
                      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-tight text-black group-hover:text-primary transition-all">
                        {blog.title}
                      </h2>
                   </Link>
                   <p className="text-xl md:text-2xl font-medium tracking-tight text-black/60 leading-relaxed max-w-2xl line-clamp-3">
                     {blog.excerpt}
                   </p>
                   <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-6 h-14 px-8 border-4 border-black bg-white text-xs font-black uppercase tracking-widest hover:bg-black hover:text-primary transition-all">
                      READ CHRONICLE <ArrowRight size={18} />
                   </Link>
                </div>
              </motion.article>
            )) : (
              <div className="py-24 border-4 border-dashed border-black/10 flex items-center justify-center font-black uppercase text-black/20 italic text-2xl">
                No chronicles found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
