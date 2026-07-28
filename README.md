# Reablement capacity & demand model

A web-based version of the Targets Refresh Tool: models weekly referral demand
against reablement service capacity across Derbyshire's 8 areas, and lets you
test what-if scenarios (absence, utilisation, vacancy targets, need profile)
against a fixed historical baseline.

Runs entirely client-side — static bundle, no backend, no account setup.
Scenario edits persist to `localStorage` in the browser.

## Structure

- `src/lib/model/` — the calculation engine. `types.ts` defines the input
  shapes, `calculations.ts` mirrors the source Excel workbook's formulas cell
  for cell, `defaultData.ts` holds the real baseline figures, and
  `calculations.test.ts` pins expected outputs to values read directly from
  the workbook so the app can't silently drift from the source model.
- `src/store/` — app state (historical baseline + scenario + derived outputs).
- `src/components/` — reusable input tables and output widgets.
- `src/pages/` — Home, Historical Inputs, Scenario Inputs, Outputs.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # calculation engine test suite
npm run build    # production static build (dist/)
```
