import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { GraduationCap, Trophy, Rocket, Briefcase, Sparkles, Loader2, ArrowDown } from 'lucide-react';
import { getTimeline } from '@/services/contentService';
import { cn } from '@/lib/utils';

interface JourneyPoint {
  id: string;
  year: string;
  title: string;
  description: string;
  icon_type: string;
}

const DEMO_POINTS: JourneyPoint[] = [
  { id: '1', year: '2022', title: 'The Start', description: 'Began the engineering journey at ARGU.', icon_type: 'cap' },
  { id: '2', year: '2024', title: 'GCU Winner', description: 'Won #1 at Euphuism 2026 with CrewSpace.', icon_type: 'trophy' },
  { id: '3', year: '2025', title: 'Startup Lab', description: 'Building Intellaris Studio from scratch.', icon_type: 'rocket' },
  { id: '4', year: '2026', title: 'The Future', description: 'Scaling AI-native workflow engines.', icon_type: 'sparkles' }
];

/**
 * MASTER JOURNEY TIMELINE - THE BUILDER PATH
 * Brutalist aesthetic with high-impact path animation.
 */
export function JourneyTimeline({ items }: { items?: JourneyPoint[] }) {
  const [points, setPoints] = useState<JourneyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(items)) {
      setPoints(items);
      setLoading(false);
    } else {
      // Fallback/Direct fetch if needed
      async function fetchTimeline() {
        try {
          const data = await getTimeline();

          if (data && data.length > 0) {
            setPoints(data);
          } else {
            setPoints(DEMO_POINTS);
          }
        } catch (e) {
          setPoints(DEMO_POINTS);
        } finally {
          setLoading(false);
        }
      }
      fetchTimeline();
    }
  }, [items]);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="size-12 animate-spin text-primary opacity-20" />
    </div>
  );

  return <TimelineContent points={points} />;
}

function TimelineContent({ points }: { points: JourneyPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 80%"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001
  });

  // Much taller for more "travel time" per scroll
  const totalHeight = Math.max(1200, points.length * 450);

  const getIcon = (type: string) => {
    switch (type) {
      case 'cap': return GraduationCap;
      case 'trophy': return Trophy;
      case 'rocket': return Rocket;
      case 'briefcase': return Briefcase;
      default: return Sparkles;
    }
  };

  const getPointPosition = (index: number, total: number) => {
     // Increased vertical space for easier scrolling
     const y = (index + 0.5) * (totalHeight / total);
     // Wide oscillation for the 'Veeshal' curve feel
     const x = 500 + Math.sin(index * 2) * 280;
     return { x, y };
  };

  return (
    <section ref={containerRef} className="relative pt-32 pb-48 bg-white border-t-2 border-black overflow-hidden selection:bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-32 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-block bg-primary text-black px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_black]">THE SHIP LOG</div>
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">MISSION<br />PROGRESS.</h2>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
             <ArrowDown className="size-10 mt-8 text-primary" />
          </motion.div>
        </div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto" style={{ height: `${totalHeight}px` }}>
        {/* Animated Background Line */}
        <svg
          viewBox={`0 0 1000 ${totalHeight}`}
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Static Line */}
          <path
            d={`M 500 0 ${points.map((_, i) => {
              const pos = getPointPosition(i, points.length);
              return `L ${pos.x} ${pos.y}`;
            }).join(' ')} L 500 ${totalHeight}`}
            stroke="#E5E7EB"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Animated Building Line */}
          <motion.path
            d={`M 500 0 ${points.map((_, i) => {
              const pos = getPointPosition(i, points.length);
              return `L ${pos.x} ${pos.y}`;
            }).join(' ')} L 500 ${totalHeight}`}
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* Yellow Highlight Line */}
          <motion.path
            d={`M 500 0 ${points.map((_, i) => {
              const pos = getPointPosition(i, points.length);
              return `L ${pos.x} ${pos.y}`;
            }).join(' ')} L 500 ${totalHeight}`}
            stroke="#FFD600"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />
        </svg>

        {/* Milestone Nodes */}
        {points.map((point, index) => (
          <TimelineNode 
            key={point.id}
            point={point}
            index={index}
            totalPoints={points.length}
            totalHeight={totalHeight}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
      
      {/* Bottom spacing to anchor the timeline end */}
      <div className="h-12" />
    </section>
  );
}

function TimelineNode({ 
  point, 
  index, 
  totalPoints, 
  totalHeight, 
  scrollYProgress 
}: { 
  point: JourneyPoint; 
  index: number; 
  totalPoints: number; 
  totalHeight: number;
  scrollYProgress: any;
}) {
  const getPointPosition = (index: number, total: number) => {
    const y = (index + 0.5) * (totalHeight / total);
    const x = 500 + Math.sin(index * 2) * 280;
    return { x, y };
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'cap': return GraduationCap;
      case 'trophy': return Trophy;
      case 'rocket': return Rocket;
      case 'briefcase': return Briefcase;
      default: return Sparkles;
    }
  };

  const pos = getPointPosition(index, totalPoints);
  const threshold = (index + 0.5) / totalPoints;
  
  const opacity = useTransform(scrollYProgress, [threshold - 0.1, threshold], [0, 1]);
  const scale = useTransform(scrollYProgress, [threshold - 0.1, threshold], [0.5, 1]);
  const rotate = useTransform(scrollYProgress, [threshold - 0.1, threshold], [-45, 0]);
  const Icon = getIcon(point.icon_type);

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${(pos.x / 1000) * 100}%`,
        top: `${(pos.y / totalHeight) * 100}%`,
        opacity,
        scale,
        rotate,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative group">
        <div className="size-24 rounded-none bg-primary border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_black] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300">
          <Icon className="size-10 text-black" />
        </div>
        
        <motion.div 
          className={`absolute top-1/2 -translate-y-1/2 ${pos.x > 500 ? 'left-32' : 'right-32 text-right'} w-80 p-8 bg-white border-4 border-black shadow-[12px_12px_0px_rgba(255,214,0,0.4)] transition-all`}
        >
          <span className="text-[12px] font-black tracking-[0.4em] text-primary uppercase block mb-3 border-b-2 border-primary pb-2 w-fit">{point.year}</span>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight italic">{point.title}</h3>
          <p className="text-sm text-black font-bold mt-4 leading-relaxed tracking-tight">
            {point.description}
          </p>
        </motion.div>
        
        {/* Motion pulse effect */}
        <div className="absolute inset-0 bg-primary/40 -z-10 group-hover:scale-150 group-hover:opacity-0 transition-all duration-1000" />
      </div>
    </motion.div>
  );
}
