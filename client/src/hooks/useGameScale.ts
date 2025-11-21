import { useState, useEffect, useRef } from 'react';
import { useDisplay } from '../lib/stores/useDisplay';

export function useGameScale() {
  const [scale, setScale] = useState(1);
  const { zoomLevel } = useDisplay();
  const wrapperObserverRef = useRef<ResizeObserver | null>(null);
  const placeholderObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const contentSizeRef = useRef({ width: 360, height: 640 });
  const rafRef = useRef<number | null>(null);
  const readyFlagsRef = useRef({ wrapper: false, placeholder: false });

  useEffect(() => {
    const calculateScale = () => {
      const visualViewport = window.visualViewport;
      const viewportWidth = visualViewport?.width || window.innerWidth;
      const viewportHeight = visualViewport?.height || window.innerHeight;
      
      if (viewportWidth <= 0 || viewportHeight <= 0) {
        setScale(1);
        return;
      }
      
      // Adjust margins based on screen size - more responsive
      const isMobile = viewportWidth <= 480;
      const isSmallMobile = viewportWidth <= 375;
      const isTablet = viewportWidth >= 481 && viewportWidth <= 1024;
      
      const horizontalMargin = isSmallMobile ? 6 : isMobile ? 8 : isTablet ? 12 : 16;
      const verticalMargin = isSmallMobile ? 6 : isMobile ? 8 : isTablet ? 12 : 16;
      
      // Calculate available height from app container's interior content box
      const appContainer = document.querySelector('.app-container') as HTMLElement | null;
      const appHeight = appContainer?.clientHeight ?? viewportHeight;
      
      const styles = appContainer ? getComputedStyle(appContainer) : null;
      const paddingTop = styles ? (parseFloat(styles.paddingTop) || 0) : 0;
      const paddingBottom = styles ? (parseFloat(styles.paddingBottom) || 0) : 0;
      
      // Measure the actual ad-space-placeholder element if it exists
      // This measurement is coordinated via ResizeObserver to avoid race conditions
      const placeholder = appContainer?.querySelector('.ad-space-placeholder') as HTMLElement | null;
      const placeholderHeight = placeholder?.offsetHeight || 0;
      
      // containerContentHeight is the space inside padding
      const containerContentHeight = appHeight - paddingTop - paddingBottom;
      // Subtract the actual placeholder height (in-flow reserve for AdMob banner)
      const gamePlayableHeight = containerContentHeight - placeholderHeight;
      // Don't inflate availableHeight beyond the real space - use 0 as minimum
      const availableHeight = Math.max(gamePlayableHeight - verticalMargin, 0);
      const availableWidth = Math.max(viewportWidth - horizontalMargin, 280);
      
      const contentWidth = Math.max(contentSizeRef.current.width, 280);
      const contentHeight = Math.max(contentSizeRef.current.height, 350);
      
      const widthRatio = availableWidth / contentWidth;
      const heightRatio = availableHeight / contentHeight;
      
      // Use smaller ratio with buffer - less aggressive on small screens
      const bufferMultiplier = isSmallMobile ? 0.98 : isMobile ? 0.96 : 0.95;
      const autoScale = Math.min(widthRatio, heightRatio) * bufferMultiplier;
      
      // Allow user zoom but respect mobile constraints
      const effectiveZoom = isMobile ? Math.min(zoomLevel, 1) : zoomLevel;
      // Use raw autoScale without minimum clamp to prevent content from exceeding available space
      // Only enforce maximum scale to prevent excessive zoom
      const finalScale = Math.min(autoScale * effectiveZoom, 1.5);
      
      setScale(finalScale);
    };

    // Schedule calculation via requestAnimationFrame to ensure both wrapper and placeholder
    // have reported their final sizes before computing scale (avoids race conditions)
    // Only calculate once both observers have reported at least once to prevent stale measurements
    const scheduleCalculation = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Gate calculation on both observers having reported to avoid measuring placeholder as zero
      if (readyFlagsRef.current.wrapper && readyFlagsRef.current.placeholder) {
        rafRef.current = requestAnimationFrame(calculateScale);
      }
    };

    // Observe both the game wrapper and ad placeholder to ensure we recalculate
    // whenever either element's size changes
    const gameWrapper = document.querySelector('.mobile-scale-wrapper');
    const appContainer = document.querySelector('.app-container');
    
    if (gameWrapper) {
      wrapperObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            contentSizeRef.current = { width, height };
            readyFlagsRef.current.wrapper = true;
            scheduleCalculation();
          }
        }
      });
      
      wrapperObserverRef.current.observe(gameWrapper);
    }
    
    // Setup placeholder observer with mutation fallback for delayed mounting
    const setupPlaceholderObserver = (placeholderElement: HTMLElement) => {
      if (placeholderObserverRef.current) {
        placeholderObserverRef.current.disconnect();
      }
      placeholderObserverRef.current = new ResizeObserver(() => {
        readyFlagsRef.current.placeholder = true;
        // Chain RAF to ensure layout is complete before measuring placeholderHeight
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scheduleCalculation();
          });
        });
      });
      placeholderObserverRef.current.observe(placeholderElement);
    };
    
    const placeholder = appContainer?.querySelector('.ad-space-placeholder') as HTMLElement | null;
    if (placeholder) {
      // Placeholder exists at mount, set up observer immediately
      setupPlaceholderObserver(placeholder);
    } else if (appContainer) {
      // Placeholder doesn't exist yet - watch for it to be added to DOM (async mounting/React strict mode)
      // Keep mutation observer active until the real placeholder is detected
      mutationObserverRef.current = new MutationObserver(() => {
        const newPlaceholder = appContainer.querySelector('.ad-space-placeholder') as HTMLElement | null;
        if (newPlaceholder) {
          setupPlaceholderObserver(newPlaceholder);
          if (mutationObserverRef.current) {
            mutationObserverRef.current.disconnect();
            mutationObserverRef.current = null;
          }
        }
      });
      mutationObserverRef.current.observe(appContainer, { childList: true, subtree: true });
    } else {
      // No app container found - mark placeholder as ready to unblock (shouldn't happen in normal flow)
      readyFlagsRef.current.placeholder = true;
    }
    
    const handleResize = () => scheduleCalculation();
    const handleScroll = () => scheduleCalculation();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleScroll);

    return () => {
      if (wrapperObserverRef.current) wrapperObserverRef.current.disconnect();
      if (placeholderObserverRef.current) placeholderObserverRef.current.disconnect();
      if (mutationObserverRef.current) mutationObserverRef.current.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleScroll);
    };
  }, [zoomLevel]);

  return scale;
}