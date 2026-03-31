import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';
import { supabase } from '@/lib/supabase';
import { getSocials } from '@/services/contentService';
import { Github, Linkedin, Mail, Loader2 } from 'lucide-react';

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

  const getPlatformLink = (platform: string) => {
    const s = socials.find(s => s.platform.toLowerCase().includes(platform.toLowerCase()));
    return s ? s.url : '#';
  };

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
        <section className="pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            
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
                       <li className="text-sm font-black uppercase">PRAJUKTI-GCU Hackathon Winner 2026, GIRIJANANDA CHOWDHURY UNIVERSITY</li>
                       <li className="text-sm font-black uppercase">USTM 8th NEGC 2026 AI & Innovation Competition Winner</li>
                       <li className="text-sm font-black uppercase">RUNNER UP IN CODEWAR 7.0, PYROKINESIS 2026 BY ASSAM ENGINEERING COLLEGE</li>
                       <li className="text-sm font-black uppercase">Startup Cofounder - Intellaris Studio</li>
                      
                    </ul>
                 </div>
              </div>

              <div className="flex gap-6 pt-8">
                 <a href={getPlatformLink('github')} target="_blank" rel="noreferrer" className="size-16 border-2 border-black flex items-center justify-center hover:bg-black hover:text-primary transition-all">
                    <Github className="size-6" />
                 </a>
                 <a href={getPlatformLink('linkedin')} target="_blank" rel="noreferrer" className="size-16 border-2 border-black flex items-center justify-center hover:bg-black hover:text-primary transition-all">
                    <Linkedin className="size-6" />
                 </a>
                 <a href={getPlatformLink('mail')} target="_blank" rel="noreferrer" className="size-16 border-2 border-black flex items-center justify-center hover:bg-black hover:text-primary transition-all">
                    <Mail className="size-6" />
                 </a>
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
               <div className="absolute -bottom-10 -right-10 bg-black text-primary p-8 space-y-2 hidden md:block border-4 border-primary">
                  <span className="text-xs font-black uppercase tracking-widest block border-b border-primary pb-2">LOCATION</span>
                  <p className="text-lg font-black uppercase tracking-tighter">{profile?.location || "GUWAHATI • INDIA, BUTWAL • NEPAL"}</p>
               </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
