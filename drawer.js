/**
 * ==========================================================================
 * ED.components.drawer — professional side drawer (§14).
 * --------------------------------------------------------------------------
 * A single, reusable drawer instance shared by every clickable widget
 * (Assembly Constituency, Parliamentary Constituency, Zone, District,
 * Org District, and — for consistency — Leaders/Insights "read more").
 * Supports scrolling content and closes via the × button, backdrop click,
 * or Escape, without a page refresh.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { $, el, escapeHtml, isBlank } = window.ED.utils.dom;

  let drawerEl, backdropEl, titleEl, bodyEl;
  let lastFocused = null;

  function ensureBuilt() {
    if (drawerEl) return;

    backdropEl = el('div', { class: 'drawer-backdrop', id: 'drawer-backdrop' });
    backdropEl.addEventListener('click', close);

    titleEl = el('h2', { class: 'drawer-title' });
    bodyEl = el('div', { class: 'drawer-body' });

    const closeBtn = el('button', {
      class: 'drawer-close',
      'aria-label': 'Close panel',
      onclick: close,
      html: '&times;',
    });

    drawerEl = el('aside', { class: 'drawer', id: 'info-drawer', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' }, [
      el('div', { class: 'drawer-header' }, [titleEl, closeBtn]),
      bodyEl,
    ]);

    document.body.appendChild(backdropEl);
    document.body.appendChild(drawerEl);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerEl.classList.contains('is-open')) close();
    });
  }

  /**
   * Render a description-shaped record (title/body/historicalBackground/...)
   * into the drawer body as readable sections. Falls back gracefully when
   * a record is null (dataset not loaded yet) or fields are missing.
   */
  function renderDescriptionBody(record, fallbackTitle) {
    if (!record) {
      return `<p class="drawer-empty">No detailed description is available for ${escapeHtml(fallbackTitle)} yet. Add it to the relevant description dataset to have it appear here automatically.</p>`;
    }

    const sectionOrder = [
      ['body', null],
      ['historicalBackground', 'Historical Background'],
      ['politicalImportance', 'Political Importance'],
      ['demographicProfile', 'Demographic Profile'],
      ['economicProfile', 'Economic Profile'],
      ['keyIssues', 'Key Issues'],
      ['importantLocations', 'Important Locations'],
      ['adminInfo', 'Administrative Information'],
    ];

    let html = '';
    sectionOrder.forEach(([field, heading]) => {
      const value = record[field];
      if (isBlank(value)) return;
      if (heading) html += `<h3 class="drawer-section-heading">${escapeHtml(heading)}</h3>`;
      html += `<p class="drawer-text">${escapeHtml(value)}</p>`;
    });

    return html || `<p class="drawer-empty">No further detail recorded for ${escapeHtml(fallbackTitle)}.</p>`;
  }

  function open(title, bodyHtml) {
    ensureBuilt();
    lastFocused = document.activeElement;
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    backdropEl.classList.add('is-open');
    drawerEl.classList.add('is-open');
    drawerEl.focus();
    document.body.classList.add('drawer-open-lock');
  }

  function openDescription(title, record) {
    open(title, renderDescriptionBody(record, title));
  }

  function close() {
    if (!drawerEl) return;
    backdropEl.classList.remove('is-open');
    drawerEl.classList.remove('is-open');
    document.body.classList.remove('drawer-open-lock');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  window.ED.components.drawer = { open, openDescription, close };
})();
