import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'PORTFOLIO', path: '/portfolio' },
  { name: 'WINS', path: '/wins' },
  { name: 'TIMELINE', path: '/timeline' },
  { name: 'BLOG', path: '/blog' },
  { name: 'ABOUT', path: '/about' },
  { name: 'CONTACT', path: '/contact' },
];

/**
 * MASTER NAVIGATION HEADER
 * High-contrast, Brutalist design with purposeful micro-animations.
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b-2',
      scrolled ? 'bg-white/95 backdrop-blur-xl border-primary py-4' : 'bg-transparent border-transparent py-6'
    )}>
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <div className="bg-black text-primary px-3 py-1 font-black text-sm uppercase tracking-widest">AA</div>
          <span className="font-black text-lg text-black uppercase tracking-tighter hover:text-primary transition-colors">Aakash Agrahari</span>
        </Link>

        {/* Desktop Nav - Clean & Bold */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "inline-flex h-11 items-center border-2 px-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all",
                "border-transparent text-black hover:border-black hover:bg-white",
                isActiveRoute(link.path) && "border-black bg-white text-black shadow-[4px_4px_0px_black]"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-black hover:text-primary transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b-8 border-primary p-12 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "border-2 px-6 py-4 text-4xl font-black uppercase tracking-tighter text-black transition-colors italic",
                    "border-transparent hover:border-black hover:bg-primary",
                    isActiveRoute(link.path) && "border-black bg-black text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
