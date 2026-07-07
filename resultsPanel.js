/**
 * ==========================================================================
 * ED.components.resultsPanel — the ORIGINAL dashboard cards (§11 preserved).
 * --------------------------------------------------------------------------
 * This is the existing dashboard's rendering logic (AC info cards, booth
 * gradation bar, dominant caste cards, winner/runner-up), moved out of the
 * old monolithic app.js unchanged in behavior, with exactly two additions
 * that were explicitly requested and don't affect existing behavior:
 *
 *   1. §3 — the results section title now reads "2023 Assembly Election
 *      Results" instead of generic "Winner"/"Runner Up" headers.
 *   2. §3 — the Winner block now carries a green accent and the Runner-Up
 *      block a red accent (previously orange/slate) — purely a CSS
 *      class change (see css/styles.css .result-block--winner-2023 /
 *      --runnerup-2023), no markup structure removed.
 *   3. §5 — AC Name / PC / Zone / District / Org District cards are now
 *      clickable and open the shared info drawer with that entity's
 *      description (falls back to a friendly empty state if no
 *      description dataset entry exists yet — §12).
 *
 * Everything else (field names shown, empty-value handling, booth-grade
 * parsing, caste-cell parsing) is identical to the original.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { $, escapeHtml, isBlank } = window.ED.utils.dom;
  const drawer = window.ED.components.drawer;

  const PARTY_COLORS = {
    'BJP': '#FF9933', 'INC': '#00AEEF', 'JD(S)': '#2E7D32', 'JDS': '#2E7D32',
    'AAP': '#0B5FBA', 'IND': '#94A3B8', 'INDEPENDENT': '#94A3B8',
    'JD(U)': '#7A5AF8', 'KRPP': '#B45309', 'SDPI': '#059669',
  };

  function setText(id, value) {
    const node = document.getElementById(id);
    if (!node) return;
    const empty = isBlank(value);
    node.textContent = empty ? 'Not available' : value;
    node.classList.toggle('is-empty', empty);
  }

  function renderPartyValue(id, partyName) {
    const node = document.getElementById(id);
    node.innerHTML = '';
    if (isBlank(partyName)) { node.classList.add('is-empty'); node.textContent = 'Not available'; return; }
    node.classList.remove('is-empty');
    const dot = document.createElement('span');
    dot.className = 'party-dot';
    dot.style.background = PARTY_COLORS[partyName.toUpperCase()] || '#94A3B8';
    const label = document.createElement('span');
    label.textContent = partyName;
    node.appendChild(dot);
    node.appendChild(label);
  }

  /** Make a card clickable and wire it to open the info drawer (§5). */
  function makeClickable(cardSelector, title, descriptionRecord) {
    const card = $(cardSelector);
    if (!card) return;
    card.classList.add('card--clickable');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${title}`);
    const activate = () => drawer.openDescription(title, descriptionRecord);
    card.onclick = activate;
    card.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } };
  }

  function renderBoothGrade(raw) {
    const node = document.getElementById('val-boothGrade');
    node.innerHTML = '';
    if (isBlank(raw)) { node.classList.add('is-empty'); node.textContent = 'Not available'; return; }
    node.classList.remove('is-empty');

    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l && !/^_+$/.test(l));
    let total = null;
    const grades = {};

    lines.forEach((line) => {
      const totalMatch = line.match(/total.*?(\d+)/i);
      const gradeMatch = line.match(/grade\s*([A-Da-d])\s*-\s*(\d+)/i);
      if (gradeMatch) grades[gradeMatch[1].toUpperCase()] = parseInt(gradeMatch[2], 10);
      else if (totalMatch) total = parseInt(totalMatch[1], 10);
    });

    const gradeKeys = ['A', 'B', 'C', 'D'].filter((k) => grades[k] !== undefined);
    const sum = gradeKeys.reduce((acc, k) => acc + grades[k], 0) || total || 0;

    if (total !== null) {
      const totalEl = document.createElement('div');
      totalEl.className = 'booth-total';
      totalEl.textContent = `${total} booths`;
      node.appendChild(totalEl);
    }

    if (gradeKeys.length > 0 && sum > 0) {
      const bar = document.createElement('div');
      bar.className = 'booth-bar';
      gradeKeys.forEach((k) => {
        const seg = document.createElement('span');
        seg.className = `g-${k.toLowerCase()}`;
        seg.style.width = `${(grades[k] / sum) * 100}%`;
        bar.appendChild(seg);
      });
      node.appendChild(bar);

      const legend = document.createElement('div');
      legend.className = 'booth-legend';
      gradeKeys.forEach((k) => {
        const item = document.createElement('span');
        item.innerHTML = `<i class="g-${k.toLowerCase()}"></i> Grade ${k} &middot; ${grades[k]}`;
        legend.appendChild(item);
      });
      node.appendChild(legend);
    } else if (total === null) {
      const fallback = document.createElement('div');
      fallback.textContent = raw.replace(/\n/g, ' · ');
      node.appendChild(fallback);
    }
  }

  function parseCasteCell(raw) {
    if (isBlank(raw)) return null;
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l && !/^_+$/.test(l));
    if (lines.length === 0) return null;
    const [headline, ...rest] = lines;
    const headlineMatch = headline.match(/^(.*?)-\s*([\d.]+%?)$/);
    const sub = rest.map((line) => {
      const m = line.match(/^(.*?)-\s*([\d.]+%?)$/);
      return m ? { label: m[1].trim(), value: m[2].trim() } : { label: line, value: '' };
    });
    return headlineMatch
      ? { name: headlineMatch[1].trim(), share: headlineMatch[2].trim(), sub }
      : { name: headline, share: '', sub };
  }

  function renderCasteList(rawValues) {
    const casteList = $('#caste-list');
    casteList.innerHTML = '';
    const parsed = rawValues.map(parseCasteCell).filter(Boolean);

    if (parsed.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'caste-empty';
      empty.textContent = 'No dominant caste data available for this constituency.';
      casteList.appendChild(empty);
      return;
    }

    parsed.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'caste-card';
      const rank = document.createElement('span');
      rank.className = 'caste-rank';
      rank.textContent = `#${i + 1}`;
      card.appendChild(rank);

      const headline = document.createElement('p');
      headline.className = 'caste-headline';
      headline.innerHTML = `${escapeHtml(c.name)}${c.share ? ` <span class="caste-share">${escapeHtml(c.share)}</span>` : ''}`;
      card.appendChild(headline);

      if (c.sub.length > 0) {
        const subList = document.createElement('ul');
        subList.className = 'caste-sub';
        c.sub.forEach((s) => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${escapeHtml(s.label)}</span><b>${escapeHtml(s.value)}</b>`;
          subList.appendChild(li);
        });
        card.appendChild(subList);
      }
      casteList.appendChild(card);
    });
  }

  /** Render the original card grid for one profile (unchanged data, §11). */
  function render(profile) {
    const r = profile.master;

    setText('val-acNo', r.acNo);
    setText('val-acName', r.acName);
    setText('val-zone', r.zone);
    setText('val-pc', r.pc);
    setText('val-district', r.district);
    setText('val-orgDistrict', r.orgDistrict);

    setText('val-winnerName', r.winnerName);
    renderPartyValue('val-winnerParty', r.winnerParty);
    setText('val-winnerCaste', r.winnerCaste);
    setText('val-winnerCategory', r.winnerCategory);

    setText('val-runnerName', r.runnerName);
    renderPartyValue('val-runnerParty', r.runnerParty);
    setText('val-runnerCaste', r.runnerCaste);
    setText('val-runnerCategory', r.runnerCategory);

    renderBoothGrade(r.boothGrade);
    renderCasteList([r.caste1, r.caste2, r.caste3, r.caste4, r.caste5]);

    // §5 — wire the five clickable info widgets to the shared drawer.
    makeClickable('[data-field="acName"]', r.acName, profile.descriptions.ac);
    makeClickable('[data-field="pc"]', r.pc, profile.descriptions.pc);
    makeClickable('[data-field="zone"]', r.zone, profile.descriptions.zone);
    makeClickable('[data-field="district"]', r.district, profile.descriptions.district);
    makeClickable('[data-field="orgDistrict"]', r.orgDistrict, profile.descriptions.orgDistrict);
  }

  window.ED.components.resultsPanel = { render };
})();
