# Karnataka Election Dashboard

A single-page, client-side dashboard for exploring Karnataka Assembly
Constituency (AC) profiles — winner/runner-up results, dominant caste
composition, and 2024 GE booth gradation — with a searchable AC-name
selector. Pure HTML/CSS/JS, no backend, no build step.

---

## 1. Project structure (Phase 1 — modular architecture)

```
election-dashboard/
├── index.html
├── css/
│   └── styles.css                # Original styles + Phase 1 additions (drawer, timeline, leaders, insights, boundary image)
├── js/
│   ├── data.js                   # Master Constituency Data (unchanged, embedded)
│   ├── data.sample.js            # DEMO data for the 5 new datasets — replace with real Excel exports
│   ├── config/
│   │   ├── columnMaps.js         # Master dataset header -> field name map
│   │   └── datasetManifest.js    # ⭐ Register new datasets HERE — nowhere else
│   ├── services/
│   │   ├── dataStore.js          # Loads + joins every dataset by AC Name / AC No
│   │   └── imageCache.js         # Boundary image preloading + placeholder fallback
│   ├── components/
│   │   ├── searchBox.js          # The AC dropdown (unchanged behavior)
│   │   ├── resultsPanel.js       # Original cards + 2023 results (green/red) + clickable widgets
│   │   ├── drawer.js             # Side drawer used by every clickable widget
│   │   ├── boundaryImage.js      # Boundary map card with zoom
│   │   ├── pastElections.js      # Past election timeline
│   │   ├── leaders.js            # Political leader profile cards
│   │   └── insights.js           # Constituency Insights intelligence report
│   ├── utils/
│   │   ├── dom.js                # Shared DOM helpers
│   │   └── csv.js                # CSV parser (for file uploads)
│   └── app.js                    # Orchestrator — wires everything together
├── data/
│   ├── KA_Raw_Data.xlsx / .csv   # Master dataset (reference / re-upload)
└── README.md
```

**Everything is a classic `<script>` tag, not an ES module.** ES modules are blocked by browsers under `file://`, and this project's core requirement — proven the hard way earlier — is that it works when someone just double-clicks `index.html`. Every file attaches to one shared `window.ED` namespace instead of using `import`/`export`.

## 2. What's new in Phase 1

| Section | Status | Notes |
|---|---|---|
| AC search, all original cards, booth gradation, dominant caste | **Unchanged** | Same behavior, same data, same styling |
| 2023 Assembly Election Results | **Modified (as requested)** | Renamed title; Winner block is now green, Runner-Up is now red |
| Assembly Constituency / PC / Zone / District / Org District cards | **Modified (as requested)** | Now clickable — open a side drawer with a description, or a friendly "not available yet" message |
| Assembly Boundary Map | **New** | Shows above the widgets; placeholder graphic until you supply real image URLs |
| Past Election Results Timeline | **New** | Currently has sample data for 2 constituencies (Nippani, Chikkodi-Sadalga) |
| Important Political Leaders | **New** | Sample data for Nippani, Chikkodi-Sadalga, Athani |
| Constituency Insights | **New** | Sample data for Nippani, Chikkodi-Sadalga |
| Every other constituency | **Working as intended** | Shows graceful "no data yet" states for the new sections — this is the required behavior (§12), not a bug |

## 3. How to plug in your real datasets

You do **not** need to touch any component code. Two steps:

1. **Provide the data** — replace the relevant array/object in `js/data.sample.js` with your real dataset (same field names), or point a dataset's `source` in `js/config/datasetManifest.js` at a fetchable `.json`/`.csv` URL instead of the embedded sample.
2. **That's it.** `dataStore.js` re-indexes automatically from whatever's in the manifest; every component already reads from it generically.

**For the Google Sheets boundary images specifically:** since this is a backend-less static app, the sheet needs to be reachable via a plain URL — either "File → Publish to web" as CSV, or a link-shared sheet's `/export?format=csv` URL. Once you share that, I can wire the exact fetch for you.

## 4. Redeploying to GitHub Pages

Given the folder-flattening issue from before, **use `git`/GitHub Desktop rather than the web upload UI** for this update — there are now 5 subfolders (`js/config`, `js/services`, `js/components`, `js/utils`) and the web uploader has already shown it doesn't reliably preserve nested folders. See the git-based instructions above if you'd like a walkthrough.


- The **search box** filters constituencies by `AC Name` as you type
  (case-insensitive, substring match), with full keyboard support
  (`↑ ↓` to move, `Enter` to select, `Esc` to close).
- Selecting a constituency calls `renderDashboard()`, which fills in
  every card. Two cells get special treatment because they contain
  multi-line, delimited text in the source file:
  - **Dominant Caste 1–5** — split into a headline (caste + % share)
    and any sub-breakdown lines, shown as a compact card per caste.
  - **2024 GE Booth Gradation** — parsed into a total booth count and
    Grade A–D counts, rendered as a proportional stacked bar + legend.
- You can also load a **different** `.xlsx`/`.csv` file at any time via
  "Load a different file" — it must use the same column headers.

## 3. Running locally

**Just double-click `index.html`.** The default dataset is embedded
directly in `js/data.js`, so the dashboard opens and works fully
offline — no server required.

If you prefer serving it (e.g. for the cleanest experience while also
testing file uploads), any of these work too:

```bash
cd election-dashboard
python3 -m http.server 8080   # then open http://localhost:8080
```
```bash
npx serve election-dashboard
```
Or, in VS Code: install the "Live Server" extension, right-click
`index.html` → *Open with Live Server*.

No server-side code, database, or API key is required anywhere in this project.

### If the dropdown still looks empty

- Open your browser's DevTools console (F12) and check for a red error
  mentioning `js/data.js` — that means the file didn't load. Make sure
  the `js/` folder sits next to `index.html` and wasn't renamed or left
  out when copying the project.
- If you're using "Load a different file" to upload an `.xlsx` and
  nothing happens, your network may be blocking the SheetJS CDN script.
  Save the file as `.csv` instead — CSV uploads don't need that library.

## 4. Using your own data

The app expects these exact column headers (order doesn't matter):

```
Sl No, AC No, AC Name, Zone, PC, District, Org District,
Dominant Caste 1, Dominant Caste 2, Dominant Caste 3, Dominant Caste 4, Dominant Caste 5,
Winner - Name, Winner - Party, Winner - Category, Winner - Caste,
Runner Up - Name, Runner Up - Party, Runner Up - Category, Runner Party - Caste,
2024 GE Booth Gradation
```

To use a different dataset by default, replace `data/KA_Raw_Data.xlsx`
with your own file (same name), or change `DEFAULT_DATA_URL` at the top
of `js/app.js`. To load ad-hoc without touching files, use the in-app
"Load a different file" picker — it accepts `.xlsx`, `.xls`, and `.csv`.

Missing/blank cells are handled gracefully and shown as "Not available"
rather than breaking the layout.

## 5. Customizing the look

All design tokens (colors, fonts, radii, shadows) live at the top of
`css/styles.css` under `:root`. The palette follows the brief:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#FF6B00` | Accents, primary card, active states |
| `--color-secondary` | `#1F2937` | Header, headings, secondary accents |
| `--color-bg` | `#F8FAFC` | Page background |
| `--color-card` | `#FFFFFF` | Card surfaces |

Fonts are loaded from Google Fonts: **Poppins** (headings/labels),
**Inter** (body text), **JetBrains Mono** (AC numbers, booth counts —
anything numeric/tabular benefits from a monospaced figure style).

## 6. Browser support

Any modern evergreen browser (Chrome, Edge, Firefox, Safari). Uses
standard ES6 (arrow functions, `const`/`let`, template literals,
`Array` methods) — no transpilation needed.

## 7. Notes on the SheetJS dependency

`index.html` loads SheetJS from a CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```
For a fully offline/air-gapped deployment, download that file and save
it locally (e.g. `js/xlsx.full.min.js`), then update the `<script src="...">`
path in `index.html` to point to the local copy.
