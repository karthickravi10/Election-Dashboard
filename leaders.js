/**
 * ==========================================================================
 * ED.components.leaders — Important Political Leaders section (§6/§16).
 * --------------------------------------------------------------------------
 * Renders one profile card per leader associated with the selected AC.
 * Supports any number of leaders (§16 "Support multiple leaders"), and a
 * generic initials avatar when no photo URL is available.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { el, escapeHtml, isBlank } = window.ED.utils.dom;

  function initials(name) {
    return String(name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }

  function renderCard(leader) {
    const avatar = isBlank(leader.photoUrl)
      ? el('div', { class: 'leader-avatar leader-avatar--initials' }, [initials(leader.name)])
      : el('img', { class: 'leader-avatar', src: leader.photoUrl, alt: leader.name, loading: 'lazy' });

    return el('article', { class: 'leader-card' }, [
      avatar,
      el('div', { class: 'leader-info' }, [
        el('h3', { class: 'leader-name' }, [leader.name || 'Name not available']),
        el('div', { class: 'leader-tags' }, [
          leader.party ? el('span', { class: 'leader-tag leader-tag--party' }, [leader.party]) : null,
          leader.status ? el('span', { class: 'leader-tag leader-tag--status' }, [leader.status]) : null,
        ]),
        el('p', { class: 'leader-meta' }, [
          [leader.position, leader.designation].filter(Boolean).join(' · ') || 'Position not recorded',
        ]),
        leader.community ? el('p', { class: 'leader-meta leader-meta--muted' }, [`Community: ${leader.community}`]) : null,
        leader.bio ? el('p', { class: 'leader-bio' }, [leader.bio]) : null,
      ]),
    ]);
  }

  function render(container, leaderRecords) {
    container.innerHTML = '';
    if (!leaderRecords || leaderRecords.length === 0) {
      container.appendChild(el('p', { class: 'section-empty' }, [
        'No political leader profiles are recorded for this constituency yet.',
      ]));
      return;
    }
    leaderRecords.forEach((leader) => container.appendChild(renderCard(leader)));
  }

  window.ED.components.leaders = { render };
})();
