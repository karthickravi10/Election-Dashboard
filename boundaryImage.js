/**
 * ==========================================================================
 * ED.components.boundaryImage — Assembly Boundary Map card (§2/§13).
 * --------------------------------------------------------------------------
 * Displayed above the results grid. Loads the boundary PNG URL for the
 * selected AC, shows a placeholder when unavailable, and supports a
 * full-screen zoom on click. Images are cached via ED.services.imageCache
 * so revisiting a constituency is instant on the second view.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { $, el, escapeHtml } = window.ED.utils.dom;
  const { preload, PLACEHOLDER_SVG } = window.ED.services.imageCache;

  let lightboxEl, lightboxImgEl;

  function ensureLightbox() {
    if (lightboxEl) return;
    lightboxImgEl = el('img', { class: 'lightbox-img', alt: 'Boundary map, full screen' });
    lightboxEl = el('div', { class: 'lightbox', id: 'boundary-lightbox' }, [
      el('button', { class: 'lightbox-close', 'aria-label': 'Close full-screen view', html: '&times;' }),
      lightboxImgEl,
    ]);
    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl || e.target.classList.contains('lightbox-close')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
    document.body.appendChild(lightboxEl);
  }

  function openLightbox(src) {
    ensureLightbox();
    lightboxImgEl.src = src;
    lightboxEl.classList.add('is-open');
  }
  function closeLightbox() {
    if (lightboxEl) lightboxEl.classList.remove('is-open');
  }

  /**
   * Render the boundary image card for a constituency profile.
   * `boundaryImageRecord` is `{ acName, imageUrl }` or null (§12 — missing
   * dataset entries degrade to the placeholder, they never throw).
   */
  async function render(container, acName, boundaryImageRecord) {
    container.innerHTML = '';
    container.setAttribute('aria-busy', 'true');

    const url = boundaryImageRecord && boundaryImageRecord.imageUrl;
    const loaded = url ? await preload(url) : false;
    const finalSrc = loaded ? url : PLACEHOLDER_SVG;

    const img = el('img', {
      class: 'boundary-image',
      src: finalSrc,
      alt: `${acName} assembly constituency boundary map`,
      loading: 'lazy',
    });

    const caption = el('div', { class: 'boundary-caption' }, [
      el('span', {}, [`${escapeHtml(acName)} — Boundary Map`]),
      loaded
        ? el('button', { class: 'boundary-zoom-btn', onclick: () => openLightbox(finalSrc) }, ['⤢ Full screen'])
        : el('span', { class: 'boundary-unavailable-note' }, ['Boundary map not yet available for this constituency']),
    ]);

    container.appendChild(img);
    container.appendChild(caption);
    container.setAttribute('aria-busy', 'false');

    if (loaded) img.addEventListener('click', () => openLightbox(finalSrc));
  }

  window.ED.components.boundaryImage = { render };
})();
