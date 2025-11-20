import { useCallback } from 'react';

export type AnalyticsEvent = 
  | 'game_start'
  | 'game_end'
  | 'power_up_used'
  | 'settings_changed'
  | 'high_score_achieved'
  | 'share_score'
  | 'tutorial_completed'
  | 'combo_achieved';

interface AnalyticsEventData {
  [key: string]: string | number | boolean;
}

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent, data?: AnalyticsEventData) => {
    try {
      const eventData = {
        event,
        timestamp: new Date().toISOString(),
        ...data
      };

      console.log('[Analytics]', eventData);

      if (typeof window !== 'undefined' && window.localStorage) {
        const analyticsLog = localStorage.getItem('analytics_events');
        const events = analyticsLog ? JSON.parse(analyticsLog) : [];
        
        events.push(eventData);
        
        if (events.length > 100) {
          events.shift();
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(events));
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const getAnalytics = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const analyticsLog = localStorage.getItem('analytics_events');
        return analyticsLog ? JSON.parse(analyticsLog) : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return [];
    }
  }, []);

  const clearAnalytics = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('analytics_events');
      }
    } catch (error) {
      console.error('Failed to clear analytics:', error);
    }
  }, []);

  return {
    trackEvent,
    getAnalytics,
    clearAnalytics
  };
}
