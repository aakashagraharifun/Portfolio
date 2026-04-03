import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SCROLL TO TOP - SMOOTH RESET
 * Standard behavior for Single Page Applications (SPA)
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Disable browser default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // reset to top
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
