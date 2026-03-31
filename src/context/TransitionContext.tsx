import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TransitionContext = createContext({
  isTransitioning: false,
  startTransition: (callback: () => void) => {},
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 500); // Overlay duration
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
       <AnimatePresence mode="wait">
          {children}
       </AnimatePresence>
       
       {/* Global Brutalist Overlay */}
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
