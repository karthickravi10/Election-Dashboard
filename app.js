/**
 * ==========================================================================
 * ED — Election Dashboard orchestrator (app.js)
 * --------------------------------------------------------------------------
 * This file used to contain ALL logic (data loading, parsing, search,
 * rendering) in one place. It's now a thin bootstrap: it initializes the
 * data store, wires the search box to every rendering component, and
 * handles the file-upload flow. All actual rendering logic lives in
 * js/components/*.js, all data joining lives in js/services/dataStore.js.
 *
 * Loading order (see index.html) matters: utils -> config -> data ->
 * services -> components -> this file, since each layer attaches to the
 * shared `window.ED` namespace and this file uses all of them.
 * ==========================================================================
 */
(function () {
  'use strict';

  const { $ } = window.ED.utils.dom;
  const dataStore = window.ED.services.dataStore;
  const { searchBox, resultsPanel, boundaryImage, pastElections, leaders, insights, drawer } = window.ED.components;

  const el = {
    recordCount: $('#record-count'),
    searchInput: $('#ac-search'),
    clearBtn: $('#combobox-clear'),
    list: $('#combobox-list'),
    fileInput: $('#file-input'),
    loadingState: $('#loading-state'),
    errorState: $('#error-state'),
    errorMessage: $('#error-message'),
    emptyState: $('#empty-state'),
    dashboard: $('#dashboard'),
    boundaryImageContainer: $('#boundary-image-container'),
    pastElectionsContainer: $('#past-elections-container'),
    leadersContainer: $('#leaders-container'),
    insightsContainer: $('#insights-container'),
  };

  let searchBoxInstance = null;

  function showState(state, message) {
    el.loadingState.hidden = state !== 'loading';
    el.errorState.hidden = state !== 'error';
    el.emptyState.hidden = state !== 'empty';
    el.dashboard.hidden = state !== 'ready';
    if (state === 'error' && message) el.errorMessage.textContent = message;
  }

  /** Render every section of the dashboard for the selected AC. */
  function renderAll(acName) {
    const profile = dataStore.getProfile(acName);
    if (!profile) {
      showState('error', `No record found for "${acName}".`);
      return;
    }

    resultsPanel.render(profile);
    boundaryImage.render(el.boundaryImageContainer, profile.master.acName, profile.boundaryImage);
    pastElections.render(el.pastElectionsContainer, profile.pastElections);
    leaders.render(el.leadersContainer, profile.leaders);
    insights.render(el.insightsContainer, profile.insights);

    showState('ready');
    if (window.innerWidth < 768) {
      el.dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function initSearchBox(records) {
    searchBoxInstance = searchBox.create({
      inputEl: el.searchInput,
      clearBtnEl: el.clearBtn,
      listEl: el.list,
      records,
      onSelect: renderAll,
    });
  }

  function afterDataLoaded() {
    const records = dataStore.getMasterRecords();
    if (records.length === 0) {
      showState('error', 'No usable rows were found. Check that the file has an "AC Name" column.');
      return;
    }
    el.recordCount.textContent = `${records.length} constituencies loaded`;
    if (searchBoxInstance) searchBoxInstance.setRecords(records);
    else initSearchBox(records);
    showState('empty');
  }

  /** Same embedded-data-first strategy as before: zero network calls
   *  needed for the default dataset, so this keeps working over file://
   *  and on any static host without modification. */
  function loadDefaultData() {
    showState('loading');
    dataStore.init(); // reads window.__ELECTION_RECORDS__ + window.ED_SAMPLE via the manifest
    afterDataLoaded();
  }

  function handleFileSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isCsv = /\.csv$/i.test(file.name);
    showState('loading');
    const reader = new FileReader();
    reader.onerror = () => showState('error', 'The selected file could not be read from disk.');

    if (isCsv) {
      reader.onload = (evt) => {
        try {
          const rows = window.ED.utils.csv.parseCsv(String(evt.target.result));
          dataStore.reloadMasterFromRawRows(rows);
          searchBoxInstance && searchBoxInstance.reset();
          afterDataLoaded();
        } catch (err) {
          console.error('Failed to parse uploaded CSV:', err);
          showState('error', 'This CSV could not be read. Please check it matches the expected column layout.');
        }
      };
      reader.readAsText(file);
      return;
    }

    if (typeof XLSX === 'undefined') {
      showState('error', 'The Excel-reading library could not be loaded (likely no internet access or it was blocked). Please save your file as .csv and try again — CSV files do not require that library.');
      return;
    }

    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames.includes('Master') ? 'Master' : workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
        dataStore.reloadMasterFromRawRows(rows);
        searchBoxInstance && searchBoxInstance.reset();
        afterDataLoaded();
      } catch (err) {
        console.error('Failed to parse uploaded file:', err);
        showState('error', 'This file could not be read. Please check it matches the expected column layout.');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function initEvents() {
    el.fileInput.addEventListener('change', handleFileSelect);
  }

  function init() {
    initEvents();
    loadDefaultData();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
