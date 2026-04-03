import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSocials } from '@/services/contentService';
import { ArrowUpRight } from 'lucide-react';
import { getSocialHref, getSocialIcon } from '@/lib/socialPlatforms';

/**
 * MASTER DYNAMIC FOOTER
 * Fetches all live links from Supabase socials.
 */
export function Footer() {
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    async function loadLinks() {
      const data = await getSocials();
      setSocials(data);
    }
    loadLinks();
  }, []);

  return (
    <footer className="bg-white border-t-2 border-black selection:bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-black text-primary px-3 py-1 font-black text-sm uppercase">AA</div>
              <span className="font-black text-2xl uppercase tracking-tighter italic">BUILDER.</span>
            </div>
            <p className="text-xl font-black uppercase tracking-tight text-black leading-tight max-w-sm">
              SHIPPING AI PRODUCTS AND <span className="text-primary border-b-4 border-black">HACKATHON WINNING</span> INTERFACES. 
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">NAVIGATION</h4>
            <div className="flex flex-col gap-4 text-sm font-black uppercase tracking-widest text-black">
              <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
              <Link to="/portfolio" className="hover:text-primary transition-colors">PROJECTS</Link>
              <Link to="/about" className="hover:text-primary transition-colors">ABOUT</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">CONTACT</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">LIVE CHANNELS</h4>
            <div className="flex flex-col gap-4">
              {socials.length > 0 ? socials.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <a 
                    key={social.id} 
                    href={getSocialHref(social.platform, social.url)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex justify-between items-center group text-sm font-black uppercase text-black"
                  >
                    <div className="flex items-center gap-3 group-hover:text-primary transition-colors">
                      <Icon className="size-4" />
                      <span>{social.platform}</span>
                    </div>
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              }) : (
                 <span className="text-xs text-muted-foreground">Manage links in Admin.</span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            © 2026 AAKASH AGRAHARI — BUILT BY HAND.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="bg-black text-primary px-2 py-0.5">TECHIE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
