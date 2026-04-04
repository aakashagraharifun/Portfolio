import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NameHoverOverlay } from '@/components/layout/NameHoverOverlay';

const TransitionContext = createContext({
  isTransitioning: false,
  startTransition: (callback: () => void) => {},
  isNameHovered: false,
  setIsNameHovered: (value: boolean) => {},
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);

  const startTransition = (callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 500); // Overlay duration
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, isNameHovered, setIsNameHovered }}>
       <AnimatePresence mode="wait">
          {children}
       </AnimatePresence>
       
       {/* Global Name Hover Overlay */}
       <NameHoverOverlay isVisible={isNameHovered} />

       {/* Global Brutalist Overlay (for page transitions) */}
       <AnimatePresence>
         {isTransitioning && (
           <motion.div
             initial={{ scaleY: 0 }}
             animate={{ scaleY: 1 }}
             exit={{ scaleY: 0 }}
             transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
             className="fixed inset-0 z-[999] bg-primary origin-top border-b-[20px] border-black"
           />
         )}
       </AnimatePresence>
    </TransitionContext.Provider>
  );
};

