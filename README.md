# Project Atlas

English | [中文](README.zh.md)

A **tag wall of recent projects** for the DeepSeek Harness sidebar.

Each project is one pill-shaped tag: `01 → [type logo] → title → chevron`. Tags carry a slight random tilt and a type-colored gradient, so you can tell categories apart at a glance — data & models, web apps, docs & decks, plugins & tooling, visualization. Hover it (or Tab to it) and the tag *unfolds* into a card with the date, summary, hours, cost, project directory and the "next steps" checklist.

## Features

- **Tag layout** — number + type logo + title; a collapsed tag is only 46–66px tall, so the whole archive fits on one screen.
- **Hover to unfold** — border radius morphs from 999px to 16px, the tilt straightens, the tag lifts 3px, and details slide open in 0.26s.
- **Two views** — grid (tag wall) and list (single-line tags), switched by a segmented control with a sliding thumb.
- **Three sizes** — S / M / L adjust minimum column width, padding, title size and line clamp.
- **Type filters** — one chip per category with a colored dot and a count.
- **Light & dark** — containers and text use host theme tokens (`--dsw-alias-*`) and follow the shell; only the five type colors are plugin-owned.
- **Remembers your choice** — view and size persist in `localStorage`.
- **Accessible** — cards and rows are focusable, `:focus-visible` matches hover, and both `prefers-reduced-motion` and touch (`hover: none`) are handled.
- **Container queries** — lays out by the panel's own width (≤760px, ≤620px), not the window.
- **Zero runtime dependencies** — no build step, all UI in `client.js`, icons are inline SVG.

## Install

Pick one:

1. **Plugin market** — host this repository's `market-index.json` at any http(s) URL, add that index URL in DSH's Plugins page, then install from "Discover".
2. **npm** — `pnpm add dsh-project-atlas` inside the DSH profile directory, then enable it on the Plugins page.
3. **Local directory** — use "Install from directory" on the Plugins page, or `plugin_manager`'s `install_bundle` pointed at this folder.

Once enabled, a "Project Atlas" icon appears in the sidebar's global panel section.

## Use your own data

Everything lives in the `PROJECTS` array at the top of `client.js`:

```js
{
  id: 'forecast-web',        // unique id; tags are numbered 01.. in array order
  category: 'web',           // model | web | deck | plugin | viz
  date: '2025-10-14',        // YYYY-MM-DD; the panel sorts newest first
  title: 'Forecast workbench: wrap a CLI model in a web UI',
  path: 'forecast-web/',     // project directory, may be empty
  summary: '…',              // one or two sentences, two lines on hover
  hours: 34,                 // hours spent, decimals allowed
  cost: 178,                 // cost in CNY
  plans: ['…'],              // next steps, one per line
}
```

Save and refresh the DSH page. The repository ships **7 sample records** and contains no personal data.

To add a category: append `{ id, tone }` to `CATEGORIES` (`tone` is a key of `TONES`), add an SVG path set to `GLYPHS`, and add `cat.<id>` to both the `zh` and `en` dictionaries.

## Design notes

- Five type colors: `blue #4C8DFF`, `mint #22C58B`, `peach #FF9A4D`, `violet #9B7BFF`, `sand #E0B749`; each derives a theme-aware text color, a darkened gradient end for the logo tile, and `tint` / `ring` / `glow` alphas.
- Collapsed height comes from `--cardMinH` (S 46 / M 58 / L 66). The grid uses `align-items: start`, so only the hovered tag grows — neighbors never stretch into empty cards.
- The entrance animation `dpaIn` uses `animation-fill-mode: backwards` and bakes the tilt into its keyframes, so hovering still translates the tag after the animation ends.

## Layout

| File | Purpose |
| --- | --- |
| `package.json` | Manifest: `dsh.bundle.patch`, `dsh.client`, `engines.dsh` |
| `cordis.patch.yml` | Inserts the `project-atlas` plugin row into the profile |
| `index.js` | Host half (no logic; the UI is entirely client-side) |
| `client.js` | Panel, sidebar icon, sample data, styles and motion |
| `locale/zh.json`, `locale/en.json` | Display name and description on the Plugins page |
| `icon.svg` | Plugin icon |
| `market-index.json` | Format-1 plugin market index sample for distribution |

## License

MIT
