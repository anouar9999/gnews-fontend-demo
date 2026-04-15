import { useEffect } from 'react';

/**
 * Re-runs `refetch` whenever the browser tab becomes visible again.
 * Keeps listing-page view counts fresh even when the tab was left open
 * while articles were being viewed in another tab.
 */
export function useRefetchOnFocus(refetch) {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
