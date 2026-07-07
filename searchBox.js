/**
 * ==========================================================================
 * ED.components.searchBox — the searchable AC Name dropdown (§1/§9).
 * --------------------------------------------------------------------------
 * Behavior is unchanged from the original app.js (full keyboard nav, all
 * matches shown, no artificial cap, highlighted matches). The only change
 * is structural: this module no longer renders the dashboard itself — it
 * calls an `onSelect(acName)` callback, and app.js wires that to whichever
 * components need to react (results panel, boundary image, timeline,
 * leaders, insights — all of them, via the data store).
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.components = window.ED.components || {};

(function () {
  'use strict';
  const { $, escapeHtml, debounce } = window.ED.utils.dom;

  function create({ inputEl, clearBtnEl, listEl, records, onSelect }) {
    let filteredOptions = [];
    let activeOptionIndex = -1;

    function highlightMatch(text, query) {
      if (!query) return escapeHtml(text);
      const idx = text.toLowerCase().indexOf(query);
      if (idx === -1) return escapeHtml(text);
      const before = escapeHtml(text.slice(0, idx));
      const match = escapeHtml(text.slice(idx, idx + query.length));
      const after = escapeHtml(text.slice(idx + query.length));
      return `${before}<mark>${match}</mark>${after}`;
    }

    function openList() {
      listEl.classList.add('is-open');
      inputEl.setAttribute('aria-expanded', 'true');
    }
    function closeList() {
      listEl.classList.remove('is-open');
      inputEl.setAttribute('aria-expanded', 'false');
    }

    function renderOptions(query) {
      listEl.innerHTML = '';
      activeOptionIndex = -1;

      if (filteredOptions.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'combobox-empty';
        empty.textContent = 'No matching constituency found.';
        listEl.appendChild(empty);
        openList();
        return;
      }

      filteredOptions.forEach((record, idx) => {
        const li = document.createElement('li');
        li.className = 'combobox-option';
        li.id = `combobox-option-${idx}`;
        li.setAttribute('role', 'option');
        li.dataset.index = String(idx);

        const nameSpan = document.createElement('span');
        nameSpan.innerHTML = highlightMatch(record.acName, query);

        const meta = document.createElement('small');
        meta.textContent = `AC ${record.acNo}${record.district ? ' · ' + record.district : ''}`;

        li.appendChild(nameSpan);
        li.appendChild(meta);

        li.addEventListener('mousedown', (e) => {
          e.preventDefault(); // fire before input blur closes the list
          selectRecord(record);
        });

        listEl.appendChild(li);
      });

      openList();
    }

    // No cap: the whole point of a searchable dropdown is finding what
    // you're looking for, even in a full unfiltered list.
    function buildOptions(query) {
      const q = query.trim().toLowerCase();
      filteredOptions = !q
        ? records.slice()
        : records.filter((r) => r.acName.toLowerCase().includes(q));
      renderOptions(q);
    }

    function moveActiveOption(delta) {
      const options = Array.from(listEl.querySelectorAll('.combobox-option'));
      if (options.length === 0) return;
      activeOptionIndex = (activeOptionIndex + delta + options.length) % options.length;
      options.forEach((o, i) => o.classList.toggle('is-active', i === activeOptionIndex));
      options[activeOptionIndex].scrollIntoView({ block: 'nearest' });
    }

    function selectActiveOption() {
      if (activeOptionIndex === -1 || !filteredOptions[activeOptionIndex]) return;
      selectRecord(filteredOptions[activeOptionIndex]);
    }

    function selectRecord(record) {
      inputEl.value = record.acName;
      clearBtnEl.hidden = false;
      closeList();
      onSelect(record.acName);
    }

    function reset() {
      inputEl.value = '';
      clearBtnEl.hidden = true;
      closeList();
    }

    // Debounced input handler (§18 "debounced search") — 120ms is enough
    // to smooth out fast typing without feeling laggy.
    const handleInput = debounce((value) => buildOptions(value), 120);

    inputEl.addEventListener('input', (e) => {
      clearBtnEl.hidden = e.target.value.length === 0;
      handleInput(e.target.value);
    });
    inputEl.addEventListener('focus', () => buildOptions(inputEl.value));
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); openList(); moveActiveOption(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); openList(); moveActiveOption(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); selectActiveOption(); }
      else if (e.key === 'Escape') { closeList(); }
    });
    inputEl.addEventListener('blur', () => setTimeout(closeList, 120));
    clearBtnEl.addEventListener('click', () => { reset(); inputEl.focus(); });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#combobox')) closeList();
    });

    return {
      setRecords(newRecords) { records = newRecords; buildOptions(inputEl.value); },
      reset,
      selectByName(acName) {
        const rec = records.find((r) => r.acName === acName);
        if (rec) selectRecord(rec);
      },
    };
  }

  window.ED.components.searchBox = { create };
})();
