/**
 * ==========================================================================
 * ED.components.pastElections — Past Election Results timeline (§4/§15).
 * --------------------------------------------------------------------------
 * Renders past election records as a vertical chronological timeline
 * (newest first). Each entry is collapsed to year/type/winner by default
 * and expands on click to show the full record (runner-up, margin, vote
 * share, and any additional fields present in the dataset).
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { el, escapeHtml, isBlank } = window.ED.utils.dom;

  const KNOWN_FIELDS = new Set([
    'acName', 'year', 'electionType', 'winner', 'winnerParty',
    'runnerUp', 'runnerUpParty', 'margin', 'voteShare',
  ]);

  function toggle(itemEl) {
    itemEl.classList.toggle('is-expanded');
  }

  function renderEntry(record, index) {
    const extraFields = Object.keys(record).filter((k) => !KNOWN_FIELDS.has(k) && !isBlank(record[k]));

    const item = el('li', { class: 'timeline-item', style: `--i:${index}` }, [
      el('div', { class: 'timeline-marker' }),
      el('div', { class: 'timeline-card' }, [
        el('button', { class: 'timeline-summary', onclick: (e) => toggle(e.currentTarget.closest('.timeline-item')) }, [
          el('span', { class: 'timeline-year' }, [String(record.year || '—')]),
          el('span', { class: 'timeline-type' }, [record.electionType || 'Election']),
          el('span', { class: 'timeline-winner' }, [record.winner || 'Winner not recorded']),
          el('span', { class: 'timeline-chevron', html: '&#9662;' }),
        ]),
        el('div', { class: 'timeline-details' }, [
          el('dl', { class: 'timeline-dl' }, [
            el('dt', {}, ['Winner']), el('dd', {}, [record.winner || 'Not available']),
            el('dt', {}, ['Winner Party']), el('dd', {}, [record.winnerParty || 'Not available']),
            el('dt', {}, ['Runner-Up']), el('dd', {}, [record.runnerUp || 'Not available']),
            el('dt', {}, ['Runner-Up Party']), el('dd', {}, [record.runnerUpParty || 'Not available']),
            el('dt', {}, ['Vote Margin']), el('dd', {}, [record.margin || 'Not available']),
            el('dt', {}, ['Vote Share']), el('dd', {}, [record.voteShare || 'Not available']),
            ...extraFields.flatMap((f) => [el('dt', {}, [f]), el('dd', {}, [String(record[f])])]),
          ]),
        ]),
      ]),
    ]);
    return item;
  }

  function render(container, records) {
    container.innerHTML = '';

    if (!records || records.length === 0) {
      container.appendChild(el('p', { class: 'section-empty' }, [
        'No past election records are available for this constituency yet.',
      ]));
      return;
    }

    const sorted = records.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
    const list = el('ul', { class: 'timeline-list' }, sorted.map(renderEntry));
    container.appendChild(list);
  }

  window.ED.components.pastElections = { render };
})();
