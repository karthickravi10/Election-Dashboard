/**
 * ==========================================================================
 * ED.config.datasetManifest — single source of truth for every dataset
 * the dashboard knows about.
 * --------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 * To add a brand-new dataset later (per spec §10/§19 — "Future Scalability")
 * you should only ever need to:
 *   1. Provide the data (embedded window.ED_SAMPLE.xxx, or a fetchable
 *      .xlsx/.csv/.json URL — see `source` below).
 *   2. Add one entry to this file describing its join key and shape.
 * No other file should need to change. ED.services.dataStore reads this
 * manifest generically — it has no per-dataset logic hardcoded in it.
 *
 * JOIN STRATEGY
 * Every dataset is joined against the Master Constituency Data using:
 *   primaryKey:   AC Name   (case/whitespace-insensitive)
 *   secondaryKey: AC No     (used as a tiebreaker / fallback if present)
 * A dataset that has no matching row for the selected AC simply contributes
 * nothing — components are written to handle that gracefully (§12).
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.config = window.ED.config || {};

window.ED.config.datasetManifest = {
  /**
   * Master Constituency Data — the ORIGINAL dataset. Untouched.
   * Source: window.__ELECTION_RECORDS__ (js/data.js), loaded exactly as
   * it always has been. This is intentionally not "generic" — it's the
   * one dataset the whole app is built around, kept as-is per §11.
   */
  master: {
    label: 'Master Constituency Data',
    joinKey: 'acName',
    source: { type: 'embedded-global', globalVar: '__ELECTION_RECORDS__' },
    required: true,
  },

  /**
   * Past Election Results (§4 / §15) — 2024 GE, 2019 GE, 2018 AE,
   * 2014 GE, 2013 AE, etc. One AC can have many rows here (one per
   * election), so this dataset is grouped into an array per AC rather
   * than a single joined record.
   *
   * DEMO DATA: window.ED_SAMPLE.pastElections covers only a handful of
   * constituencies so the Past Elections Timeline has something real to
   * show. Replace with your actual Excel export (same column shape) and
   * point `source` at it — no component code needs to change.
   */
  pastElections: {
    label: 'Past Election Results',
    joinKey: 'acName',
    cardinality: 'many', // multiple rows per AC
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'pastElections' },
    required: false,
  },

  /** Important Political Leaders (§6/§16) — many rows per AC. */
  leaders: {
    label: 'Important Political Leaders',
    joinKey: 'acName',
    cardinality: 'many',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'leaders' },
    required: false,
  },

  /** Constituency Insights (§7/§17) — one intelligence-report record per AC. */
  insights: {
    label: 'Constituency Insights',
    joinKey: 'acName',
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'insights' },
    required: false,
  },

  /** Assembly Boundary PNG links (§2/§13) — one image per AC. */
  boundaryImages: {
    label: 'Assembly Boundary Images',
    joinKey: 'acName',
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'boundaryImages' },
    required: false,
  },

  /** Rich descriptions for the clickable info widgets (§5). One dataset
   *  per widget type, all sharing the same shape: { acName, title, body... } */
  descriptions_ac: {
    label: 'Assembly Constituency Description',
    joinKey: 'acName',
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'descriptions.ac' },
    required: false,
  },
  descriptions_pc: {
    label: 'Parliamentary Constituency Description',
    joinKey: 'pc', // joined by PC name instead of AC name
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'descriptions.pc' },
    required: false,
  },
  descriptions_district: {
    label: 'District Description',
    joinKey: 'district',
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'descriptions.district' },
    required: false,
  },
  descriptions_orgDistrict: {
    label: 'Organizational District Description',
    joinKey: 'orgDistrict',
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'descriptions.orgDistrict' },
    required: false,
  },
  descriptions_zone: {
    label: 'Zone Description',
    joinKey: 'zone',
    cardinality: 'one',
    source: { type: 'embedded-global', globalVar: 'ED_SAMPLE', path: 'descriptions.zone' },
    required: false,
  },
};
