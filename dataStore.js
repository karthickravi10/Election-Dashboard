/**
 * ==========================================================================
 * ED.services.dataStore — centralized, multi-dataset data layer (§12).
 * --------------------------------------------------------------------------
 * Responsibilities:
 *   1. Load the Master Constituency Data exactly as the original app did
 *      (embedded js/data.js, or an uploaded .xlsx/.csv — unchanged §11).
 *   2. Load every OTHER dataset registered in ED.config.datasetManifest,
 *      generically, with no per-dataset logic hardcoded here.
 *   3. Index every dataset by its configured join key (AC Name, PC, etc.),
 *      normalized for case/whitespace, with AC No available as a secondary
 *      key on the master dataset.
 *   4. Expose getProfile(acName) — a single call that returns everything
 *      known about a constituency across ALL datasets, with missing
 *      datasets simply absent from the result (§12 "gracefully handle
 *      missing records without breaking").
 *
 * Excel parsing runs once at load time and is cached in memory (§18).
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.services = window.ED.services || {};

(function () {
  'use strict';

  const { normalizeKey, isBlank } = window.ED.utils.dom;
  const { parseCsv } = window.ED.utils.csv;
  const manifest = window.ED.config.datasetManifest;
  const columnMaps = window.ED.config.columnMaps;

  // Parsed + indexed state, built once by init() and reused for every
  // getProfile() call (client-side indexing, per §18).
  let masterRecords = [];
  let indices = {}; // datasetId -> Map(normalizedKey -> record | record[])

  /** Resolve a dotted path like "descriptions.ac" against an object. */
  function resolvePath(obj, path) {
    if (!path) return obj;
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  /** Pull the raw row array for a dataset out of its manifest `source`. */
  function loadRawRows(source) {
    if (source.type === 'embedded-global') {
      const globalObj = window[source.globalVar];
      if (!globalObj) return [];
      const rows = source.path ? resolvePath(globalObj, source.path) : globalObj;
      return Array.isArray(rows) ? rows : [];
    }
    // Future source types (fetch URL, Google Sheets export link, etc.)
    // can be added here without touching any component code.
    console.warn(`ED.services.dataStore: unsupported source type "${source.type}"`);
    return [];
  }

  /** Normalize a Master row using the configured header -> field map. */
  function normalizeMasterRow(rawRow) {
    const out = {};
    Object.entries(columnMaps.master).forEach(([sourceKey, targetKey]) => {
      const matchKey = Object.keys(rawRow).find(
        (k) => k.trim().toLowerCase() === sourceKey.trim().toLowerCase()
      );
      out[targetKey] = matchKey !== undefined ? String(rawRow[matchKey]).trim() : '';
    });
    return out;
  }

  /** Build an index for one non-master dataset per its manifest entry. */
  function buildIndex(datasetId, config) {
    const rows = loadRawRows(config.source);
    const map = new Map();

    rows.forEach((row) => {
      const key = normalizeKey(row[config.joinKey]);
      if (!key) return;
      if (config.cardinality === 'many') {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(row);
      } else {
        map.set(key, row);
      }
    });

    indices[datasetId] = map;
  }

  /**
   * Load the Master dataset. Mirrors the original app.js exactly:
   * embedded window.__ELECTION_RECORDS__ first, with the same shape and
   * the same "no usable rows" failure mode.
   */
  function ingestMasterRows(rawRows) {
    masterRecords = rawRows
      .map(normalizeMasterRow)
      .filter((r) => !isBlank(r.acName));
    return masterRecords;
  }

  /** Rebuild every non-master index from the current manifest + sample data. */
  function buildAllSecondaryIndices() {
    indices = {};
    Object.entries(manifest).forEach(([datasetId, config]) => {
      if (datasetId === 'master') return; // master handled separately
      buildIndex(datasetId, config);
    });
  }

  /**
   * Initialize the whole data layer. Call once at startup.
   * Returns the master records array (same contract the old app.js had).
   */
  function init() {
    const masterSource = manifest.master.source;
    const rawMasterRows = loadRawRows(masterSource);
    ingestMasterRows(rawMasterRows);
    buildAllSecondaryIndices();
    return masterRecords;
  }

  function getMasterRecords() {
    return masterRecords;
  }

  /**
   * The single call components use: everything known about one AC,
   * joined across every registered dataset. Missing datasets/records
   * are simply omitted (null / empty array) rather than throwing.
   */
  function getProfile(acName) {
    const key = normalizeKey(acName);
    const master = masterRecords.find((r) => normalizeKey(r.acName) === key) || null;
    if (!master) return null;

    const lookup = (datasetId, joinValue) => {
      const map = indices[datasetId];
      if (!map) return manifest[datasetId] && manifest[datasetId].cardinality === 'many' ? [] : null;
      const found = map.get(normalizeKey(joinValue));
      if (found !== undefined) return found;
      return manifest[datasetId].cardinality === 'many' ? [] : null;
    };

    return {
      master,
      pastElections: lookup('pastElections', master.acName),
      leaders: lookup('leaders', master.acName),
      insights: lookup('insights', master.acName),
      boundaryImage: lookup('boundaryImages', master.acName),
      descriptions: {
        ac: lookup('descriptions_ac', master.acName),
        pc: lookup('descriptions_pc', master.pc),
        district: lookup('descriptions_district', master.district),
        orgDistrict: lookup('descriptions_orgDistrict', master.orgDistrict),
        zone: lookup('descriptions_zone', master.zone),
      },
    };
  }

  /** Re-ingest the Master dataset from an uploaded file's raw rows (§11 —
   *  file upload keeps working exactly as before; new datasets are
   *  additive and don't currently support re-upload via the UI). */
  function reloadMasterFromRawRows(rawRows) {
    ingestMasterRows(rawRows);
    return masterRecords;
  }

  window.ED.services.dataStore = {
    init,
    getMasterRecords,
    getProfile,
    reloadMasterFromRawRows,
    parseCsv, // re-exported for convenience in app.js's file-upload handler
  };
})();
