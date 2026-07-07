/**
 * ==========================================================================
 * ED.services.imageCache — boundary image loading with caching + fallback.
 * --------------------------------------------------------------------------
 * §13 requirements covered here:
 *   - "Cache images for faster loading"   -> in-memory Image() cache, so
 *     revisiting a constituency never re-downloads its boundary image.
 *   - "Display a placeholder image if no boundary is available" -> an
 *     inline SVG data URI, so the placeholder itself needs no network
 *     access and works even fully offline.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.services = window.ED.services || {};

(function () {
  'use strict';

  const cache = new Map(); // url -> 'loading' | 'loaded' | 'error'

  const PLACEHOLDER_SVG =
    'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">
      <rect width="900" height="560" fill="#F1F5F9"/>
      <g fill="none" stroke="#CBD5E1" stroke-width="2">
        <path d="M120 420 L260 220 L420 340 L560 160 L720 300 L800 200" />
      </g>
      <circle cx="450" cy="280" r="46" fill="#E2E8F0"/>
      <text x="450" y="410" font-family="Inter, sans-serif" font-size="22" fill="#94A3B8" text-anchor="middle">
        Boundary map not available yet
      </text>
    </svg>`);

  /**
   * Preload a URL, resolving once it's known to have loaded or failed.
   * Cached so repeated selections of the same AC don't re-fetch.
   */
  function preload(url) {
    return new Promise((resolve) => {
      if (!url) return resolve(false);
      if (cache.get(url) === 'loaded') return resolve(true);
      if (cache.get(url) === 'error') return resolve(false);

      const img = new Image();
      cache.set(url, 'loading');
      img.onload = () => { cache.set(url, 'loaded'); resolve(true); };
      img.onerror = () => { cache.set(url, 'error'); resolve(false); };
      img.src = url;
    });
  }

  window.ED.services.imageCache = { preload, PLACEHOLDER_SVG };
})();
