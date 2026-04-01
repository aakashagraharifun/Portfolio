import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllWins } from '@/services/winService';
import { Win } from '@/types';
import { Trophy, Calendar, Award, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Wins() {
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWins() {
      const data = await getAllWins();
      setWins(data);
      setLoading(false);
    }
    loadWins();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="size-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 selection:bg-primary">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="relative border-l-8 border-primary pl-8 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-black/40 mb-4"
          >
            <Trophy className="size-4" />
            <span>Victory Archive</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85]"
          >
            THE HALL OF <br />
            <span className="text-primary stroke-black stroke-1 drop-shadow-[4px_4px_0px_black]">CHAMPIONS</span>
          </motion.h1>
        </div>
      </section>

      {/* Wins Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid gap-12 lg:gap-24">
          {wins.length > 0 ? (
            wins.map((win, index) => (
              <motion.div
                key={win.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative grid lg:grid-cols-[1fr_0.8fr] gap-12 items-start"
              >
                <div className="space-y-8">
                  {/* Position Badge */}
                  <div className="inline-flex items-center gap-4 bg-black text-primary px-6 py-3 border-r-4 border-b-4 border-primary/40">
                    <span className="text-2xl font-black uppercase tracking-tighter italic">
                      {win.position}
                    </span>
                    <div className="h-8 w-px bg-primary/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                      {win.eventDate}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
                      {win.title}
                    </h2>
                    <div className="flex items-center gap-2">
                       <Award className="size-4 text-primary" />
                       <span className="text-xs font-black uppercase tracking-widest text-black/40 italic">VICTORY</span>
                    </div>
                  </div>

                  {/* Story Box */}
                  <div className="border-4 border-black bg-white p-8 md:p-10 shadow-[12px_12px_0px_black] group-hover:shadow-[16px_16px_0px_rgba(255,214,0,1)] transition-all duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-6 flex items-center gap-2">
                      <Sparkles className="size-3" />
                      DETAILS
                    </p>
                    <p className="text-lg md:text-xl font-medium leading-relaxed text-black/80">
                      {win.description}
                    </p>
                  </div>
                </div>

                {/* Certificate Column */}
                <div className="relative lg:sticky lg:top-32 group/cert">
                  {win.certificateUrl ? (
                    <div className="relative border-4 border-black bg-black overflow-hidden aspect-[4/3] shadow-[12px_12px_0px_rgba(0,0,0,0.1)]">
                      <img
                        src={win.certificateUrl}
                        alt={`${win.title} Certificate`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/cert:scale-105 group-hover/cert:opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cert:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
                         <a 
                           href={win.certificateUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="bg-primary text-black px-6 py-3 font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                         >
                           FULL CERTIFICATE
                         </a>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] border-4 border-black border-dashed flex flex-col items-center justify-center p-12 text-center bg-white">
                       <Trophy className="size-20 text-black/10 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Certificate being processed</p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                     <div className="flex gap-2">
                        <div className="size-2 rounded-full bg-primary" />
                        <div className="size-2 rounded-full bg-black" />
                        <div className="size-2 rounded-full bg-black/20" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-black/40">OFFICIAL RECOGNITION</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center border-4 border-black border-dashed">
               <Trophy className="size-24 mx-auto text-black/10 mb-6" />
               <h3 className="text-2xl font-black uppercase italic">Victory Collection Empty</h3>
               <p className="text-black/40 uppercase text-xs font-bold tracking-widest mt-2">More records coming soon...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
