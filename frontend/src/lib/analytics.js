/**
 * Google Analytics 4 (gtag.js)
 * Loads only when VITE_GA_ID is set; otherwise every export is a no-op.
 */

const GA_ID = import.meta.env.VITE_GA_ID;

let initialized = false;

/** Inject gtag.js and configure GA4. Safe to call multiple times. */
export function initGA() {
  if (!GA_ID || typeof window === 'undefined' || initialized) return;

  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });
    initialized = true;
  } catch (_) {
    // Analytics is non-critical
  }
}

/** Track a SPA page view. No-op if GA is not configured. */
export function trackGAPageView(path) {
  try {
    if (!GA_ID || !initialized || typeof window.gtag !== 'function') return;
    window.gtag('config', GA_ID, {
      page_path: path || window.location.pathname,
    });
  } catch (_) {
    // Never throw
  }
}

/** Track a custom GA4 event. No-op if GA is not configured. */
export function trackGAEvent(eventName, params = {}) {
  try {
    if (!GA_ID || !initialized || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  } catch (_) {
    // Never throw
  }
}
