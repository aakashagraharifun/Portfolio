import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * F1_PAGELOADER - THE HIGH VELOCITY ENTRANCE
 * Ultra-realistic CSS F1 car with millisecond-perfect scene handoffs.
 */
export function F1PageLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'racing' | 'fading'>('racing');

  useEffect(() => {
    // The blink of an eye: Car finishes at exactly 0.8s
    const timer1 = setTimeout(() => {
      setPhase('fading');
    }, 800);

    // Hard-cut to homepage at exactly 1.0s total
    const timer2 = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {phase === 'racing' ? (
          <motion.div 
            key="race"
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }} // 0 millisecond exit delay
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* THE SYNCED PAINT TRAIL */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: ['-100%', '-50%', '-50%', '0%'] }}
              transition={{ 
                duration: 0.8, 
                times: [0, 0.3, 0.6, 1],
                ease: "linear"
              }}
              className="absolute inset-0 bg-primary z-10"
            />

            {/* THE HIGH-FIDELITY, PROPORTIONAL F1 MACHINE */}
            <motion.div
              initial={{ x: '-100vw', y: 0 }}
              animate={{ 
                x: ['-100vw', '0vw', '1vw', '150vw'],
                y: [0, -1.5, 1.5, -0.8, 0, 0.8, 0] // High-Frequency Engine Vibration
              }}
              transition={{ 
                duration: 0.8, 
                times: [0, 0.3, 0.6, 1], 
                ease: "linear",
                y: { repeat: Infinity, duration: 0.03 }
              }}
              className="absolute z-[100] flex items-center justify-center pointer-events-none"
              style={{ left: '50%', marginLeft: '-280px' }}
            >
              <div className="relative w-[560px] h-[140px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] scale-90 md:scale-100">
                
                {/* 1. REAR WING (Complex Aero) */}
                <div className="absolute bottom-10 left-0 w-24 h-16 bg-red-600 rounded-tl-xl rounded-bl-sm z-10 border-l-4 border-black flex flex-col justify-between py-1 pr-1">
                  <div className="w-full h-2 bg-black rounded-sm" />
                  <div className="w-16 h-2 bg-black rounded-sm self-end" />
                  <div className="w-12 h-2 bg-black rounded-sm self-end" />
                  <div className="absolute top-[-8px] right-0 w-4 h-[120%] bg-black rounded-r-md skew-x-12" />
                </div>

                {/* 2. REAR SUSPENSION & GEARBOX */}
                <div className="absolute bottom-5 left-10 w-28 h-6 bg-neutral-900 border-b-2 border-neutral-700 z-0" />

                {/* 3. MAIN CHASSIS & CARBON FLOOR */}
                <div className="absolute bottom-4 left-16 w-[420px] h-3 bg-neutral-900 rounded-full z-0 shadow-lg" />
                <div className="absolute bottom-7 left-20 w-[300px] h-10 bg-gradient-to-r from-red-800 via-red-600 to-red-600 rounded-b-xl z-10 shadow-inner" />

                {/* 4. SIDE PODS & INTAKES */}
                <div className="absolute bottom-10 left-36 w-52 h-10 bg-red-600 rounded-tl-full rounded-tr-3xl z-20 shadow-lg border-b-2 border-red-800 overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-10 left-80 w-10 h-10 bg-black rounded-l-2xl rounded-r-sm skew-x-[-15deg] z-20" />

                {/* 5. ENGINE COVER / AIRBOX */}
                <div className="absolute bottom-16 left-28 w-48 h-12 bg-red-600 z-10 border-t-2 border-red-500 rounded-tl-3xl" style={{ clipPath: 'polygon(0% 100%, 15% 0%, 100% 0%, 100% 100%)' }} />
                <div className="absolute bottom-24 left-[135px] w-12 h-5 bg-black rounded-tl-[20px] rounded-bl-sm z-20 skew-x-[-15deg]" />

                {/* 6. COCKPIT, DRIVER & HALO */}
                <div className="absolute bottom-[60px] left-[240px] w-20 h-10 bg-black rounded-tl-3xl z-0" />
                <div className="absolute bottom-[64px] left-[260px] w-10 h-10 bg-yellow-400 rounded-full border-[5px] border-black z-10 shadow-inner">
                  <div className="absolute top-1.5 right-0 w-6 h-4 bg-black rounded-full" />
                </div>
                <div className="absolute bottom-[74px] left-[230px] w-32 h-6 border-t-[6px] border-r-[6px] border-black rounded-tr-3xl skew-x-[30deg] z-20 transform translate-x-2" />

                {/* 7. SLOPING NOSE CONE */}
                <div className="absolute bottom-7 left-[320px] w-48 h-8 bg-red-600 z-10 rounded-tr-xl" style={{ clipPath: 'polygon(0% 0%, 80% 60%, 100% 90%, 100% 100%, 0% 100%)' }} />
                <div className="absolute bottom-7 left-[450px] w-32 h-3 bg-red-600 z-10 rounded-r-full" />

                {/* 8. COMPLEX FRONT WING */}
                <div className="absolute bottom-3 left-[460px] w-28 h-10 bg-red-600 rounded-tl-3xl rounded-r-lg z-10 border-b-[6px] border-black flex flex-col justify-end p-0.5">
                  <div className="absolute -top-3 right-0 w-5 h-16 bg-black rounded-t-md skew-x-12" />
                  <div className="w-[85%] h-1 bg-black rounded-full mb-1 ml-2" />
                  <div className="w-[90%] h-1 bg-black rounded-full mb-1 ml-1" />
                  <div className="w-full h-1 bg-black rounded-full" />
                </div>

                {/* 9. MASSIVE REAR WHEEL (Animated, Pirelli Style) */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.12, ease: "linear" }}
                  className="absolute -bottom-3 left-4 w-[100px] h-[100px] bg-neutral-900 rounded-full border-[10px] border-neutral-800 flex items-center justify-center z-30 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                >
                  <div className="w-14 h-14 border-4 border-neutral-700/50 rounded-full flex items-center justify-center bg-black/50">
                    <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute inset-1.5 border-2 border-dashed border-yellow-400/80 rounded-full" />
                  <div className="absolute top-0 w-2 h-4 bg-yellow-400 blur-[1px]" />
                  <div className="absolute bottom-0 w-2 h-4 bg-yellow-400 blur-[1px]" />
                  <div className="absolute left-0 w-4 h-2 bg-yellow-400 blur-[1px]" />
                  <div className="absolute right-0 w-4 h-2 bg-yellow-400 blur-[1px]" />
                </motion.div>

                {/* 10. FRONT WHEEL (Animated, Smaller Profile) */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.12, ease: "linear" }}
                  className="absolute -bottom-2 left-[400px] w-[80px] h-[80px] bg-neutral-900 rounded-full border-[8px] border-neutral-800 flex items-center justify-center z-30 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                >
                  <div className="w-10 h-10 border-[3px] border-neutral-700/50 rounded-full flex items-center justify-center bg-black/50">
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute inset-1 border-[1.5px] border-dashed border-yellow-400/80 rounded-full" />
                  <div className="absolute top-0 w-1.5 h-3 bg-yellow-400 blur-[1px]" />
                  <div className="absolute bottom-0 w-1.5 h-3 bg-yellow-400 blur-[1px]" />
                  <div className="absolute left-0 w-3 h-1.5 bg-yellow-400 blur-[1px]" />
                  <div className="absolute right-0 w-3 h-1.5 bg-yellow-400 blur-[1px]" />
                </motion.div>
                
                {/* 11. AGGRESSIVE EXHAUST FLAME */}
                <motion.div 
                   animate={{ scale: [1, 2.5, 1], opacity: [0.6, 1, 0.6] }}
                   transition={{ repeat: Infinity, duration: 0.05 }}
                   className="absolute -left-12 bottom-10 w-24 h-10 bg-gradient-to-l from-yellow-400 via-orange-500 to-transparent blur-md rounded-full z-0"
                />

                {/* 12. HIGH-VELOCITY SPEED PARTICLES */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ x: [0, -500], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1, delay: i * 0.015 }}
                    className="absolute bg-white/80 h-1.5 rounded-full z-40"
                    style={{ left: '-20px', top: `${20 + i * 12}%`, width: `${80 + i * 40}px` }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="namecard"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="absolute inset-0 bg-primary z-[30] flex flex-col items-center justify-center p-12"
          >
             <motion.div 
               initial={{ opacity: 1 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0 }}
               className="text-center relative max-w-5xl"
             >
                <div className="absolute top-1/2 left-0 w-full h-2 bg-black -translate-y-1/2 -z-10" />
                <h2 className="text-[18vw] font-black italic tracking-tighter text-black leading-none bg-primary px-4">
                   AAKASH
                </h2>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-black tracking-[0.8em] text-black">DRIVE READY</span>
                  <span className="text-[10px] font-black tracking-[0.8em] text-black">SYSTEMS ONLINE</span>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
