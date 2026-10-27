# Changelog

## 1.0.1 — 2026-10-27

### Security

- Dev dependencies updated, including vite 8.3.5 for the launch-editor advisories in the dev server (Windows `existsSync` bypass, missing `%` escaping, editor CLI flag injection). They only affect working on this repository: the published package doesn't include vite, and the library source is unchanged from 1.0.0.

### Repository

- npm releases are published from GitHub Actions through npm trusted publishing (OIDC) instead of an `NPM_TOKEN` secret.

## 1.0.0 — 2026-09-11

### Fixed

- **Wrong `addedIndex` after items were removed** (#20). smooth-dnd kept stale draggables in its internal list because the truncation loop shrank its own bound while popping. `setDraggables` now truncates in one step.
- **Drop outside the container animated like `removeOnDropOut`** (#13), **no animation without `animation-duration`** (#9), **broken layout without `orientation`** (#7). One root cause: Vue passes every declared prop, so `undefined` values overwrote smooth-dnd's defaults. Undefined options are now ignored when merging.
- **Ghost offset when an ancestor has `filter` / `transform`** (#14, upstream vue-smooth-dnd#31). Such an ancestor becomes the containing block of the `position: fixed` ghost; the ghost is now re-parented to `<body>` when that is detected (unless `get-ghost-parent` is set).
- **`:hover` styles firing on items under the ghost** (#18). While dragging, `<body>` gets `smooth-dnd-dragging` and draggables get `pointer-events: none`. Opt out with `.smooth-dnd-dragging .smooth-dnd-draggable-wrapper { pointer-events: auto }`.
- **Drop placeholder drifted upwards inside a scrolled container.** It was positioned in viewport coordinates but placed inside the scrolled content; the scroll offset is added back.
- **Auto scroll picked one scroller for both axes**, so a board never scrolled sideways while the pointer was over one of its columns. The topmost scroller under the pointer now wins per axis.
- **No auto scroll when the page itself scrolls.** Auto scroll only looked at ancestors with `overflow: auto|scroll`, which the window never has. The window is now scrolled when the document is taller or wider than the viewport.
- A reactive `:class` on `<Container>` broke dragging: smooth-dnd added its `smooth-dnd-container` / orientation classes straight to the DOM, and Vue's next class patch wiped them. The component now renders those classes itself.
- A `<Draggable>` outside a registered `<Container>` threw on mousedown; it is now simply not draggable.
- Page scrolling blocked on touch devices after the first touch: the `no-user-select` / `disable-touch-action` classes were only removed on `mouseup`, never on `touchend` (#19).
- Removing the ghost threw when its parent was unmounted mid-drag (upstream smooth-dnd#97).
- One `resize` listener leaked per mounted container.

### Changed

- **smooth-dnd is bundled** instead of being a dependency. Upstream is unmaintained; the source lives in `src/smooth-dnd` (MIT, Kutlu Sahin) with the fixes above marked `// vue3-smooth-dnd:`.
- **TypeScript**: the package is written in TypeScript and ships declarations (#15). Props and event payloads are typed.
- Props are reactive; changing one calls `setOptions` on the running container (`orientation` still requires a re-key).
- Build: Vite library mode. Outputs ESM (`import`), CJS (`require`) and UMD (`unpkg` / `jsdelivr`), with source maps and an `exports` map.
- Peer dependency `vue ^3.3.0`. IE polyfills removed.

### Demo

- Redesigned and rebuilt on Vite 8, Vue Router 5 (hash history for GitHub Pages) and Tailwind 4 with a token-based light/dark theme. Vuex, Headless UI and gh-pages removed.
- Demos register once in `demo/src/demos/index.js`; the router, the sidebar and the page headers (with links to the related issues and the source file) are built from that list.
- Pages: Overview with a live sortable list, Reference (every prop, event and global, names read from the components at runtime), Kanban board, Playground (every option, event log), Copy into contain, Auto scroll (window, element, horizontal strip).
- Built with a relative base, so the same build works at a domain root, under `/vue3-smooth-dnd/` on GitHub Pages, or opened from a folder.

### Repository

- Single package at the repository root with a `demo` workspace (npm workspaces). Yarn lockfile, dead rollup config and duplicate READMEs removed; `.gitattributes` enforces LF.
- ESLint (flat config), Prettier, Playwright end-to-end tests (`e2e/`, one test per reported issue), GitHub Actions for CI, GitHub Pages deployment and npm publishing with provenance, Dependabot.

## 0.0.5

Last release of the JavaScript wrapper around the `smooth-dnd` npm package.
