import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';
import { BlogContentRenderer } from '@/components/blog/BlogContentRenderer';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Share2 } from 'lucide-react';

/**
 * MASTER BLOG DETAIL PAGE
 * Professional, high-end editorial reading experience.
 */
export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase.from('blog').select('*').eq('slug', slug).single();
        if (error) throw error;
        setBlog(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="size-12 animate-spin text-primary opacity-20" />
    </div>
  );

  if (!blog) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white space-y-8">
       <h1 className="text-4xl font-black uppercase text-black/10">STORY NOT FOUND.</h1>
       <Link to="/blog" className="px-8 h-14 bg-black text-primary flex items-center font-black uppercase text-xs tracking-widest">
          RETURN TO JOURNAL.
       </Link>
    </div>
  );

  return (
    <>
      <SEOHead title={`${blog.title} — Aakash Agrahari`} description={blog.excerpt} />
      
      <div className="min-h-screen bg-white">
        {/* HERO ARTICLE HEADER */}
        <header className="pt-48 pb-24 px-6 md:px-12 border-b-8 border-black">
          <div className="max-w-5xl mx-auto space-y-12">
            <Link to="/blog" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors group">
              <ArrowLeft className="group-hover:-translate-x-2 transition-transform" /> BACK TO JOURNAL
            </Link>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">ARTICLE // 01</div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                 </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none text-black selection:bg-primary">
                {blog.title}
              </h1>
            </div>

            <p className="text-2xl md:text-3xl font-black italic tracking-tight text-black/40 leading-tight max-w-3xl border-l-8 border-primary pl-10">
               {blog.excerpt}
            </p>
          </div>
        </header>

        {/* ARTICLE CONTENT */}
        <article className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-3xl mx-auto">
             {blog.cover_image && (
               <div className="aspect-video mb-24 border-4 border-black shadow-[24px_24px_0px_rgba(255,214,0,1)] overflow-hidden">
                  <img src={blog.cover_image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={blog.title} />
               </div>
             )}

             <BlogContentRenderer content={blog.content} />

             <div className="mt-32 pt-12 border-t-4 border-black flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex gap-4">
                   <div className="size-16 border-2 border-black flex items-center justify-center bg-primary font-black uppercase tracking-widest text-xs italic">END.</div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-widest">WRITTEN BY.</span>
                      <p className="font-black uppercase tracking-tighter">AAKASH AGRAHARI</p>
                   </div>
                </div>
                <button className="flex items-center gap-4 text-xs font-black uppercase tracking-widest group border-b-2 border-black pb-2 hover:border-primary transition-all">
                  SHARE ARTICLE <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                </button>
             </div>
          </div>
        </article>
      </div>
    </>
  );
}
