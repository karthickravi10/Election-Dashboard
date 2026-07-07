/**
 * ==========================================================================
 * ED.config.columnMaps — raw spreadsheet header -> internal field name.
 * --------------------------------------------------------------------------
 * Extracted unchanged from the original app.js's COLUMN_MAP. Kept as its
 * own config file (rather than buried in a service) so a header rename in
 * a future Excel export only requires editing this one file.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.config = window.ED.config || {};

window.ED.config.columnMaps = {
  master: {
    'Sl No': 'slNo',
    'AC No': 'acNo',
    'AC Name': 'acName',
    'Zone': 'zone',
    'PC': 'pc',
    'District': 'district',
    'Org District': 'orgDistrict',
    'Dominant Caste 1': 'caste1',
    'Dominant Caste 2': 'caste2',
    'Dominant Caste 3': 'caste3',
    'Dominant Caste 4': 'caste4',
    'Dominant Caste 5': 'caste5',
    'Winner - Name': 'winnerName',
    'Winner - Party': 'winnerParty',
    'Winner - Category': 'winnerCategory',
    'Winner - Caste': 'winnerCaste',
    'Runner Up - Name': 'runnerName',
    'Runner Up - Party': 'runnerParty',
    'Runner Up - Category': 'runnerCategory',
    'Runner Party - Caste': 'runnerCaste',
    '2024 GE Booth Gradation': 'boothGrade',
  },
};
