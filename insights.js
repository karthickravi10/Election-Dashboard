/**
 * ==========================================================================
 * ED.components.insights — Constituency Insights "intelligence report"
 * section (§7/§17).
 * --------------------------------------------------------------------------
 * Renders each subsection (Political Landscape, Major Communities, Voting
 * Behaviour, Key Influencers, etc.) as an expand/collapse block. Array
 * fields render as tag chips (good for short lists like "Major Cohorts"),
 * string fields render as prose. Missing subsections are simply skipped —
 * this section never shows empty headings.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { el, isBlank } = window.ED.utils.dom;

  const SUBSECTIONS = [
    ['politicalLandscape', 'Political Landscape'],
    ['majorCommunities', 'Major Communities'],
    ['majorCohorts', 'Major Cohorts'],
    ['votingBehaviour', 'Voting Behaviour'],
    ['keyInfluencers', 'Key Influencers'],
    ['developmentIssues', 'Development Issues'],
    ['electionChallenges', 'Election Challenges'],
    ['organizationalStrength', 'Organizational Strength'],
    ['campaignOpportunities', 'Campaign Opportunities'],
    ['strategicRecommendations', 'Strategic Recommendations'],
    ['futureOutlook', 'Future Outlook'],
  ];

  function renderValue(value) {
    if (Array.isArray(value)) {
      return el('div', { class: 'insight-tags' }, value.map((v) => el('span', { class: 'insight-tag' }, [String(v)])));
    }
    return el('p', { class: 'insight-text' }, [String(value)]);
  }

  function renderSubsection(field, heading, value, index) {
    const body = el('div', { class: 'insight-block-body' }, [renderValue(value)]);
    const header = el('button', {
      class: 'insight-block-header',
      onclick: (e) => e.currentTarget.closest('.insight-block').classList.toggle('is-expanded'),
    }, [
      el('span', {}, [heading]),
      el('span', { class: 'insight-chevron', html: '&#9662;' }),
    ]);

    // First subsection open by default so the section never looks empty.
    const block = el('div', { class: 'insight-block' + (index === 0 ? ' is-expanded' : '') }, [header, body]);
    return block;
  }

  function render(container, insightRecord) {
    container.innerHTML = '';

    if (!insightRecord) {
      container.appendChild(el('p', { class: 'section-empty' }, [
        'No constituency insights have been recorded yet. Once added to the Insights dataset, this section will populate automatically.',
      ]));
      return;
    }

    let rendered = 0;
    SUBSECTIONS.forEach(([field, heading]) => {
      const value = insightRecord[field];
      if (isBlank(value) || (Array.isArray(value) && value.length === 0)) return;
      container.appendChild(renderSubsection(field, heading, value, rendered));
      rendered += 1;
    });

    if (rendered === 0) {
      container.appendChild(el('p', { class: 'section-empty' }, [
        'An insights record exists for this constituency, but it has no populated fields yet.',
      ]));
    }
  }

  window.ED.components.insights = { render };
})();
