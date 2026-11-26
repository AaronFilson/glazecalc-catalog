# Changelog

Every change to the API (README, Versions) and every change to a number the library gives or holds has a line
here.

## 0.2.0 (2026-11-25)

Adds clay-body tables (`BODIES`), body formulation messages, primary-source clay `sheet` figures, and six body and slip records.

- `bodies.ts` (exported from `host/index.ts` and `index.ts`): `BODIES`, `BODY_CLASSES`, `SLIP_RANGES`, `BODY_CHECKS`, `MATERIAL_CLASSES`, `RECIPE_TYPES`, `FORMING_METHODS`, `WATER_BASES`, `FIT_TESTS`, `FIT_RESULTS`, `SHEET_FIELDS`, `optionNamed` and `optionLabel`.
- `densities.ts` and `density-names.ts`: adds 3-source-verified `kyanite` (`3.61`) and `pyrophyllite` (`2.81`) to `MINERALS`, plus `BY_NAME` / `REASON_OF_NAME` entries for the six new records.
- `traits.ts`: adds `plasticizer` detection and `molochite` / `halloysite` matching in `traitsFromName`.
- `english.ts`: adds English messages for `body-expansion-quartz`, `body-unclassified-materials`, `body-porcelain-low-silica`, `body-drying-shrinkage-high`, `body-casting-plastic-range` and `body-casting-bentonite-high`.
- `data/materials.ndjson` and `data/additives.ndjson`: adds `Kyanite`, `Pyrophyllite`, `Darvan 7`, `Darvan 811`, `Sodium Silicate` and `Lignosulfonate (Additive A)`, and populates `traits.materialClass` and primary-TDS `sheet` properties on standard clays and swelling-clay plasticizers (`docs/sources/clay-bodies.md`).

## 0.1.0 (2026-11-25)

The first release as its own repository, extracted from Glazecalc's `lib/catalog` with its history. Its code, tests and
outputs are Glazecalc's `lib/catalog` as of Glazecalc's commit 5b61d46a.

- `package.json` with the indexes in `exports`, MIT `LICENSE`, `NOTICE` for the Stull outlines, this CHANGELOG.
- Its own checks: tests with the coverage threshold, TypeScript 6 and 7, ESLint and Prettier, the output
  snapshot (`test/outputs.json`) and the three engines, and the boundary test moved in from Glazecalc.
