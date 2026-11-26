# The catalog

Glazecalc's tables and information for the chemistry core (Glazecalc's [ADR 31](https://github.com/AaronFilson/glazecalc/blob/master/docs/adr/0031-functional-core.md)): the data a host
gives the core, the English of every code, the names of materials, the readers of pasted and typed text, and
the standard materials and additives. It imports only itself and the core, and the core never imports it.

## Importing

Import from an index, never a file inside the library (Glazecalc holds itself to this with an ESLint rule):

| Index               | What it has                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`          | everything                                                                                                                                      |
| `host/index.ts`     | the host's tables and readers: oxides, cones, limits and Stull, densities, expansion, clay-body tables (`BODIES`), policy; traits, ids and keys |
| `locale/index.ts`   | the English of every code, and numbers in the reader's own decimal mark                                                                         |
| `text/index.ts`     | material names, and readers of a target formula, firings and cones, and pasted recipes                                                          |
| `standard/index.ts` | the reader of the standard records                                                                                                              |

A CommonJS `require` of an index takes all of it into a bundle, so a page that needs only the host takes
`host/index.ts`. The standard records themselves are in `data/` beside it (one document a line, NDJSON).

## Sources

| Table          | File           | Source                                                                                                                                                                  |
| -------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atomic weights | `oxides.ts`    | CIAAW's abridged table of 2024, with Ba, Ce and Pr to one more place, as in its full table                                                                              |
| Orton cones    | `cones.ts`     | Orton's older chart for large cones at 150 °C an hour, as kiln makers reprint it, and Orton's current chart (©2016) beside it                                           |
| SK cones       | `cones.ts`     | JIS R 8101 as Yuko Trading prints it; Kyoto Municipal Institute of Industrial Technology's measured bends                                                               |
| Limits         | `limits.ts`    | John Hesselberth and Ron Roy's "Recommended Stable Glaze 'Limits'", and Glazecalc's own                                                                                 |
| Stull's chart  | `limits.ts`    | R. T. Stull (1912), as Glazy reads it, by Derek Au (MIT; notice below)                                                                                                  |
| Densities      | `densities.ts` | each value with the sources it was checked against in Glazecalc's [dry SG sources](https://github.com/AaronFilson/glazecalc/blob/master/docs/sources/dry-sg-sources.md) |
| Expansion      | `expansion.ts` | Digitalfire's oxide pages, which follow West and Gerrow                                                                                                                 |
| Clay bodies    | `bodies.ts`    | body classes, slip SG ranges, material classes, fit tests and standard clay sheets in [`docs/sources/clay-bodies.md`](docs/sources/clay-bodies.md)                      |

Each file says more about its source beside the figures.

## Licence

The catalog is Glazecalc's, under its MIT licence (`LICENSE`), except the outlines of
Stull's chart regions in `limits.ts`. Those come from `charts/stull-chart-d3.js` in
<https://github.com/derekphilipau/ceramic-chemistry-visualization>, under this notice, which the licence asks
to travel with them (`NOTICE` has it too):

```
MIT License

Copyright (c) 2017 Derek Au

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Runtime

ES modules in erasable TypeScript (ES2024, `strict`, no Node or DOM types). Its tests are in `test/`
(`npm test`), at 100% of lines, branches and functions.

`test/engine-outputs.js` is its output check for other engines: `npm run check:engines` (scripts/outputs.mjs)
bundles it and runs it in Node, JavaScriptCore and SpiderMonkey, and every output must be the same text in all three.

It parses and runs in Safari 15 (macOS 12's JavaScriptCore) as well: it writes no regex lookbehind, which Safari
reads only from 16.4, and `behind.ts` stands in for one at a pattern's start (`test/behind.test.js` holds both).
Numbers written in a locale come from the engine's own locale data, so an older engine may write them differently:
macOS 12's writes ar-EG's figures in Arabic-Indic digits (٠٫٣٣٣) where current engines write 0.333.

## Using it

The library is TypeScript source with no build step: a host loads the `.ts` files as they are (Node 24 strips the
types; a bundler such as esbuild does too). Mount it as a git submodule beside the core:

```sh
git submodule add https://github.com/AaronFilson/glazecalc-core lib/core
git submodule add https://github.com/AaronFilson/glazecalc-catalog lib/catalog
```

The catalog imports the core by a relative path (`../core`), so the two sit side by side, as `lib/core` and `lib/catalog` do in Glazecalc. Its `package.json` names the package `@glazecalc/catalog` and maps its indexes in `exports`, for a host that resolves
it as a package. It is not on npm yet.

## Versions

`0.x` until a second app uses it: [Glazecalc](https://github.com/AaronFilson/glazecalc) does now, and Glaze Vault will. Its main branch is always
releasable, because hosts follow it.

**The API**, which only a major version may rename or remove (a minor one while `0.x`):

- the exports of each index (`index.ts`, and those of `host`, `locale`, `text` and `standard`);
- each table's shape and keys, the `LIMIT_SETS` keys among them, and the cones each chart lists;
- `SG_TARGET_RANGE`;
- the standard records' shape and their ids (`data/`).

Any change to a number the library gives or holds gets a line in the CHANGELOG: none is silent. The output
snapshot (`test/outputs.json`) makes such a change visible: `npm run check:outputs` fails until it is kept with
`node scripts/outputs.mjs --write`.

## Checks

```sh
npm ci
npm test                 # node:test, with the coverage threshold
npm run typecheck        # TypeScript 6 and 7
npm run lint && npm run format:check
npm run check:outputs    # every output against the kept snapshot
npm run check:engines    # the same outputs in Node, JavaScriptCore and SpiderMonkey (npx esvu install jsc, spidermonkey)
```

The catalog's checks need the core beside it, at `../core`.

## History

It began in [Glazecalc](https://github.com/AaronFilson/glazecalc) as `lib/catalog`, and this repository keeps its commits from there. Their messages
name Glazecalc's pull requests in full, as `AaronFilson/glazecalc#152`. What came before, in Glazecalc's `lib/chemistry`,
`lib/recipe`, `lib/cones` and `data/`, is in Glazecalc's history.

## Licence

MIT (`LICENSE`), with the third-party notice in `NOTICE`.
