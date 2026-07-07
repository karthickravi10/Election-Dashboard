/**
 * ==========================================================================
 * ED.utils.csv — minimal RFC-4180-ish CSV parser.
 * --------------------------------------------------------------------------
 * Extracted unchanged from the original app.js so CSV uploads keep working
 * exactly as before, without requiring the SheetJS CDN library.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.utils = window.ED.utils || {};

(function () {
  'use strict';

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field); field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else {
        field += c;
      }
    }
    if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
    if (rows.length === 0) return [];

    const header = rows[0];
    return rows.slice(1).map((r) => {
      const obj = {};
      header.forEach((h, idx) => { obj[h] = r[idx] !== undefined ? r[idx] : ''; });
      return obj;
    });
  }

  window.ED.utils.csv = { parseCsv };
})();
