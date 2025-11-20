import { useState, useEffect, useRef } from 'react';
import { useDisplay } from '../lib/stores/useDisplay';

export function useGameScale() {
  const [scale, setScale] = useState(1);
  const { zoomLevel } = useDisplay();
  const observerRef = useRef<ResizeObserver | null>(null);
  const contentSizeRef = useRef({ width: 360, height: 640 });

  useEffect(() => {
    const calculateScale = () => {
      const visualViewport = window.visualViewport;
      const viewportWidth = visualViewport?.width || window.innerWidth;
      const viewportHeight = visualViewport?.height || window.innerHeight;
      
      if (viewportWidth <= 0 || viewportHeight <= 0) {
        setScale(1);
        return;
      }
      
      // Adjust margins based on screen size
      const isMobile = viewportWidth <= 480;
      const isTablet = viewportWidth >= 481 && viewportWidth <= 1024;
      const horizontalMargin = isMobile ? 10 : isTablet ? 16 : 20;
      const verticalMargin = isMobile ? 10 : isTablet ? 16 : 20;
      
      const availableWidth = Math.max(viewportWidth - horizontalMargin, 280);
      const availableHeight = Math.max(viewportHeight - verticalMargin, 400);
      
      const contentWidth = Math.max(contentSizeRef.current.width, 280);
      const contentHeight = Math.max(contentSizeRef.current.height, 400);
      
      const widthRatio = availableWidth / contentWidth;
      const heightRatio = availableHeight / contentHeight;
      
      // Use smaller ratio with buffer
      const autoScale = Math.min(widthRatio, heightRatio) * 0.95;
      
      // Allow user zoom but respect mobile constraints
      const effectiveZoom = isMobile ? Math.min(zoomLevel, 1) : zoomLevel;
      const finalScale = Math.max(0.4, Math.min(autoScale * effectiveZoom, 1.5));
      
      setScale(finalScale);
    };

    calculateScale();
    
    const gameWrapper = document.querySelector('.mobile-scale-wrapper');
    if (gameWrapper) {
      observerRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            contentSizeRef.current = { width, height };
            calculateScale();
          }
        }
      });
      
      observerRef.current.observe(gameWrapper);
    }
    
    const handleResize = () => calculateScale();
    const handleScroll = () => calculateScale();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(calculateScale, 200);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [zoomLevel]);

  return scale;
}