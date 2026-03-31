import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Trophy, Rocket, Briefcase, Sparkles } from 'lucide-react';

interface JourneyPoint {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: any;
  position: { x: number; y: number };
}

const points: JourneyPoint[] = [
  {
    id: 1,
    year: '2022',
    title: 'ARGU Journey Begins',
    description: 'Started B.Tech in Computer Science at Assam Royal Global University.',
    icon: GraduationCap,
    position: { x: 200, y: 100 }
  },
  {
    id: 2,
    year: '2024',
    title: 'The Great Build',
    description: 'Won 1st Place at GCU Hackathon with CrewSpace AI.',
    icon: Trophy,
    position: { x: 600, y: 300 }
  },
  {
    id: 3,
    year: '2025',
    title: 'Startup Launch',
    description: 'Founding Intellaris Studio and building the future of Pulse Global.',
    icon: Rocket,
    position: { x: 300, y: 550 }
  },
  {
    id: 4,
    year: '2026',
    title: 'The Infinite Horizon',
    description: 'Scaling innovations and winning the next frontier of AI.',
    icon: Sparkles,
    position: { x: 700, y: 750 }
  }
];

/**
 * Interactive Journey Timeline with SVG Path Animation
 * Inspired by the user provided image - wavy path with floating nodes
 */
export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-light tracking-wide uppercase">The Builder's Path</h2>
        <p className="mt-4 text-muted-foreground font-light">A visual odyssey through education, hackathons, and company builds.</p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto h-[900px]">
        {/* SVG Path Layer */}
        <svg
          viewBox="0 0 1000 900"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background blurred path */}
          <path
            d="M 100 0 Q 100 100 200 100 T 400 200 T 600 300 T 500 450 T 300 550 T 500 650 T 700 750 T 400 900"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary/5"
          />
          
          {/* Animated drawing path */}
          <motion.path
            d="M 100 0 Q 100 100 200 100 T 400 200 T 600 300 T 500 450 T 300 550 T 500 650 T 700 750 T 400 900"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary"
            style={{ pathLength }}
            strokeDasharray="0 1"
          />
        </svg>

        {/* Nodes Layer */}
        {points.map((point, index) => {
          // Logic to show icons only when the path reaches them
          const threshold = (index + 1) / (points.length + 1);
          const opacity = useTransform(scrollYProgress, [threshold - 0.1, threshold], [0, 1]);
          const scale = useTransform(scrollYProgress, [threshold - 0.1, threshold], [0.5, 1]);

          return (
            <motion.div
              key={point.id}
              className="absolute z-20"
              style={{
                left: `${(point.position.x / 1000) * 100}%`,
                top: `${(point.position.y / 900) * 100}%`,
                opacity,
                scale
              }}
            >
              {/* Node Icon */}
              <div className="relative group">
                <div className="size-16 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform duration-500 group-hover:scale-110">
                  <point.icon className="size-7 text-primary" />
                </div>
                
                {/* Content Box */}
                <motion.div 
                  className={`absolute top-1/2 -translate-y-1/2 ${index % 2 === 0 ? 'left-24' : 'right-24 text-right'} w-64 p-4 bg-accent/10 backdrop-blur-md border border-border rounded-sm`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-xs font-medium tracking-[0.2em] text-primary uppercase">{point.year}</span>
                  <h3 className="text-lg font-light tracking-wide mt-1">{point.title}</h3>
                  <p className="text-xs text-muted-foreground font-light mt-2 line-clamp-3 leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
                
                {/* Visual pulses */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
