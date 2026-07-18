/**
 * metaPixel.js
 * Wraps react-facebook-pixel with fault-tolerant init.
 * If VITE_FB_PIXEL_ID is not set, every exported function is a safe no-op.
 */

let ReactPixel = null;
let initialized = false;

const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;

if (PIXEL_ID) {
  // Dynamic import so the module doesn't blow up in environments without the var
  import('react-facebook-pixel')
    .then((mod) => {
      ReactPixel = mod.default;
      ReactPixel.init(PIXEL_ID, {}, { autoConfig: true, debug: false });
      initialized = true;
    })
    .catch(() => {
      // Silently swallow — pixel is non-critical
    });
}

/** Generate a UUID v4 for deduplication between browser and CAPI */
export const generateEventId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

/** Fire a standard page view */
export const trackPageView = () => {
  try {
    if (initialized && ReactPixel) {
      ReactPixel.pageView();
    }
  } catch (_) {
    // Never throw
  }
};

/**
 * Fire a custom / standard event.
 * @param {string} eventName  e.g. 'ViewContent', 'AddToCart', 'Purchase'
 * @param {object} data       Event-specific payload
 * @param {string} eventId    UUID for server-side deduplication
 */
export const trackEvent = (eventName, data = {}, eventId) => {
  try {
    if (initialized && ReactPixel) {
      // 4th param is the event options object (contains eventID for CAPI dedup)
      ReactPixel.track(eventName, data, {}, { eventID: eventId });
    }
  } catch (_) {
    // Never throw
  }
};
