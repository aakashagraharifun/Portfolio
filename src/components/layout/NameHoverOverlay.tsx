import { motion, AnimatePresence } from 'framer-motion';
import { photographerInfo } from '@/data/photographer';

interface NameHoverOverlayProps {
  isVisible: boolean;
}

/**
 * CUSTOM NAME HOVER OVERLAY
 * - Yellow background fill
 * - Name slides from left
 * - Picture slides from right
 * - Backwards animation on exit
 */
export function NameHoverOverlay({ isVisible }: NameHoverOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Solid background fill that takes over everything
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
          }}
          exit={{ 
            opacity: 0, 
            scale: 1.08,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#FFD600] flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Content Container - Fitting and Centered */}
          <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-8 md:px-12">
            
            {/* The Names - BOLD BUT FITTING */}
            <div className="flex flex-col items-center md:items-start justify-center flex-1 w-full text-center md:text-left">
              <motion.div
                initial={{ x: '-100vw', opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.02 }
                }}
                exit={{ 
                  x: '-100vw', 
                  opacity: 0, 
                  skewX: -10,
                  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }
                }}
                className="w-full"
              >
                <h1 className="text-[18vw] md:text-[14vw] font-[1000] uppercase leading-[0.85] text-black tracking-tighter select-none">
                  AAKASH
                </h1>
              </motion.div>

              <motion.div
                initial={{ x: '-100vw', opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
                }}
                exit={{ 
                  x: '-100vw', 
                  opacity: 0, 
                  skewX: -10,
                  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.05 }
                }}
                className="w-full"
              >
                <h1 className="text-[16vw] md:text-[12vw] font-[1000] uppercase leading-[0.85] text-black tracking-tighter select-none">
                  AGRAHARI
                </h1>
              </motion.div>
            </div>

            {/* The Picture - PORTARIT TO MATCH TROPHY IMAGE */}
            <motion.div
              initial={{ x: '100vw', opacity: 0, rotate: 8 }}
              animate={{ 
                x: 0, 
                opacity: 1, 
                rotate: -3,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }
              }}
              exit={{ 
                x: '100vw', 
                opacity: 0, 
                rotate: 15,
                transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0 }
              }}
              className="relative shrink-0 w-[40vh] md:w-[48vh] max-w-[70vw] aspect-[3/4.5] border-[10px] md:border-[15px] border-black bg-white overflow-hidden shadow-[24px_24px_0px_black] z-20"
            >
              <img 
                src="/portrait.jpg" 
                alt="Aakash Agrahari with Trophy" 
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 right-4 bg-black text-primary px-4 py-2 font-black text-[10px] uppercase tracking-widest">
                AWARD WINNER
              </div>
            </motion.div>
          </div>

          {/* Background watermark for extra fill */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.02 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 flex items-center justify-center"
          >
            <span className="text-[60vw] font-black uppercase text-black leading-none tracking-tighter italic">
              AA
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



