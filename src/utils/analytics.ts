// src/utils/analytics.ts
// BULLETPROOF VERSION - Eliminates all race conditions

const SESSION_KEY = 'gigdog_session_id';

/**
 * Ensures a session ID exists and returns it.
 * This function is completely self-contained and handles all edge cases.
 */
const ensureSessionId = (): string => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      console.warn('Analytics: Not in browser environment, generating temp UUID');
      return crypto.randomUUID();
    }

    // Try to get existing session ID
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    
    // If no session ID exists, or if it's empty/invalid, create a new one
    if (!sessionId || sessionId.trim() === '' || sessionId === 'null' || sessionId === 'undefined') {
      sessionId = crypto.randomUUID();
      try {
        sessionStorage.setItem(SESSION_KEY, sessionId);
        console.log('Analytics: New session ID created:', sessionId);
      } catch (storageError) {
        console.warn('Analytics: Could not save to sessionStorage:', storageError);
        // Continue with the generated ID even if we can't save it
      }
    }
    
    return sessionId;
  } catch (error) {
    console.warn('Analytics: Error in ensureSessionId, generating fallback UUID:', error);
    return crypto.randomUUID();
  }
};

interface ClickData {
  linkType: string;
  targetUrl: string;
  sourceComponent?: string;
  showId?: string;
  artistId?: string;
  venueId?: string;
}

export const trackClick = (data: ClickData) => {
  // Guard clause for browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_BASE_URL) {
    console.warn('Analytics: API_BASE_URL is not configured.');
    return;
  }

  // Get session ID with bulletproof handling
  const sessionId = ensureSessionId();
  
  // Double-check that we have a valid session ID
  if (!sessionId || sessionId.trim() === '') {
    console.error('Analytics: Could not generate valid session ID, aborting track');
    return;
  }

  const endpoint = `${API_BASE_URL}/analytics/track-click`;

  const payload = JSON.stringify({
    sessionId,
    ...data,
  });

  console.log('Analytics: Sending payload:', { sessionId, ...data });

  if (navigator.sendBeacon) {
    const success = navigator.sendBeacon(endpoint, payload);
    if (!success) {
      console.warn('Analytics: sendBeacon failed, trying fetch fallback');
      // Fallback to fetch if sendBeacon fails
      fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(error => console.error('Analytics: Fetch fallback also failed:', error));
    }
  } else {
    fetch(endpoint, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(error => console.error('Analytics: Fetch error:', error));
  }
};