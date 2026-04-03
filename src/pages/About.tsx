import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';
import { supabase } from '@/lib/supabase';
import { getSocials } from '@/services/contentService';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { getSocialHref, getSocialIcon } from '@/lib/socialPlatforms';

/**
 * MASTER ABOUT PAGE - 100% DYNAMIC BUILDER PROFILE
 * Fetches real-time identity and socials from Supabase.
 */
export default function About() {
  const [profile, setProfile] = useState<any>(null);
  const [socials, setSocials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIdentity() {
      try {
        const [profileRes, socialsRes] = await Promise.all([
          supabase.from('profile').select('*').single(),
          getSocials()
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        setSocials(socialsRes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadIdentity();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
       <Loader2 className="size-12 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <>
      <SEOHead 
        title={`About — ${profile?.name || 'Aakash'}`} 
        description={profile?.bio || "The mission, the stack, and the builder behind the projects."}
      />
      
      <div className="min-h-screen bg-white">
        <section className="pt-32 md:pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">THE ORIGIN.</div>
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black italic">
                   {profile?.tagline?.split(' ')[0] || 'FULL STACK'} <br />
                   <span className="text-primary border-b-8 border-black">
                     {profile?.tagline?.split(' ').slice(1).join(' ') || 'BUILDER.'}
                   </span>
                </h1>
              </div>

              <div className="space-y-8 text-xl font-medium tracking-tight text-black/80 leading-relaxed max-w-2xl">
                 <p>{profile?.bio || "No biography provided yet. Head to the Admin panel to define your mission."}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t-4 border-black pt-12">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 italic">BATTLE TESTED</h4>
                    <ul className="space-y-3">
                       <li className="text-sm font-black uppercase">React / Next.js</li>
                       <li className="text-sm font-black uppercase">Supabase / PostgreSQL</li>
                       <li className="text-sm font-black uppercase">Python / AI Engines</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 italic">RECOGNITION</h4>
                    <ul className="space-y-3">
                       <li className="text-sm font-black uppercase">PRAJUKTI-GCU Hackathon Winner 2026</li>
                       <li className="text-sm font-black uppercase">USTM 8th NEGC 2026 Innovation Winner</li>
                       <li className="text-sm font-black uppercase">RUNNER UP IN Codestellation, under CodeWar 7.0 at AEC</li>
                       <li className="text-sm font-black uppercase">Startup Cofounder - Intellaris Studio</li>
                    </ul>
                 </div>
              </div>

              <div className="pt-12 border-t-4 border-black">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 italic">LITERATURE PROFILE</h4>
                <a 
                  href="https://aakashpoems.cloud" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-block w-full bg-black p-8 md:p-12 lg:px-10 border-4 border-primary hover:shadow-[12px_12px_0px_rgba(255,214,0,0.4)] transition-all overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 text-left">
                    <div className="space-y-6 flex-1 min-w-0">
                      <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary uppercase tracking-tighter leading-none italic transition-all duration-500 whitespace-nowrap">
                        AAKASHPOEMS.CLOUD
                      </h3>
                      <p className="text-sm md:text-base font-bold text-white/60 leading-relaxed max-w-xl uppercase tracking-tight">
                        Where code meets abstract emotion. A dedicated space for my Poetry, Novels, and literary experiments.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-[0.2em] border-b-2 border-primary pb-1 group-hover:gap-6 transition-all shrink-0">
                      EXPLORE PROFILE <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-10 text-[10rem] md:text-[14rem] font-black text-white/[0.03] pointer-events-none select-none uppercase italic leading-none">POEM</div>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-8">
                 {socials.length > 0 ? socials.map((social) => {
                   const Icon = getSocialIcon(social.platform);

                   return (
                     <a
                       key={social.id}
                       href={getSocialHref(social.platform, social.url)}
                       target="_blank"
                       rel="noreferrer"
                       className="group flex h-16 items-center gap-4 border-2 border-black px-5 hover:bg-black hover:text-primary transition-all"
                     >
                       <Icon className="size-5" />
                       <span className="text-xs font-black uppercase tracking-[0.24em]">{social.platform}</span>
                       <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                     </a>
                   );
                 }) : (
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">
                     Add your socials in Admin to show them here.
                   </p>
                 )}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="relative"
            >
               <div className="aspect-[3/4] bg-primary border-4 border-black shadow-[24px_24px_0px_black] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={profile?.portrait_url || "/portrait.jpg"} className="w-full h-full object-cover" alt={profile?.name || "Builder"} />
               </div>
               <div className="absolute -bottom-6 -right-6 bg-black text-white p-6 space-y-1 hidden md:block">
                  <span className="text-[10px] font-black uppercase tracking-widest block text-primary">LOCATION</span>
                  <p className="text-sm font-bold uppercase tracking-tighter">{profile?.location || "GUWAHATI • INDIA, BUTWAL • NEPAL"}</p>
               </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
