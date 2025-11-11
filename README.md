## Stellar Wallet Playbook

The Stellar Wallet Playbook is a documentation site that guides builders through creating wallets and related products on Stellar. It is built with Docusaurus and incorporates remote, pre-built data (lists, directories, assets) fetched at build time from Cloudflare R2, with a local fallback for offline development.

### Quick Start

1) Install dependencies

```bash
yarn
```

2) Start the dev server (skips remote data fetching by default)

```bash
yarn start
```

Site runs at `http://localhost:3000`. Edits to content and components hot-reload automatically.

### Prerequisites

- Node.js >= 18
- Yarn (recommended)

### Scripts

- `yarn start`: Start Docusaurus in dev mode with `SKIP_REMOTE_DATA=true` (fast; uses local fallback data).
- `yarn start:with-data`: Start dev server and fetch remote data (may be slower; requires env vars set).
- `yarn build`: Build the static site. Fetches remote data via a custom plugin unless `SKIP_REMOTE_DATA=true` is set.
- `yarn build:with-data`: Explicitly fetch remote data first, then build.
- `yarn serve`: Serve the production build locally.
- `yarn fetch-data`: Manually fetch remote data into `src/data-remote/`.
- `yarn clear`, `yarn swizzle`, `yarn write-translations`, `yarn write-heading-ids`: Docusaurus utilities.

### Remote Data Pipeline

This project can fetch structured data and image mappings at build time.

- Custom plugin: `plugins/fetch-remote-data-plugin.js`
- Fetch script: `scripts/fetch-remote-data-authenticated.js`
- Remote target: Cloudflare R2 (S3-compatible)
- Output location: `src/data-remote/` (aliased as `@site/src/data-remote`)

Behavior:

- When building or starting with remote data, the plugin runs and calls the fetch script.
- If remote fetch fails or is skipped, the site falls back to local JSON under `src/data/` when available, mirroring to `src/data-remote/`.

Control via environment:

- `SKIP_REMOTE_DATA=true` skips remote fetch (default for `yarn start`).

### Environment Variables (Cloudflare R2)

Create a `.env` file at the repo root if you plan to build with remote data:

```bash
# Account / credentials (either set the R2_* variables, or the CLOUDFLARE_* equivalents)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=wallets-playbook

# or
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY_ID=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKET_NAME=wallets-playbook
```

Notes:

- These are required for remote data fetches (`yarn start:with-data`, `yarn build`, or `yarn build:with-data`).
- If unset, the build will attempt to fall back to local `src/data/*.json`.

### Building

Build with local fallback only (fast, offline):

```bash
SKIP_REMOTE_DATA=true yarn build
```

Build including remote data (requires env vars):

```bash
yarn build
# or
yarn build:with-data
```

The output is generated in `build/` and can be hosted on any static hosting provider.

### Deployment

This repo is set up for static hosting. A `netlify.toml` contains a redirect from a legacy domain to `https://stellarplaybook.com`. You can deploy the `build/` directory to your host of choice.

Typical options:

- Netlify / Vercel: configure to run `yarn build` and serve `build/`.
- Any static host: upload the contents of `build/`.

### Project Structure

```
docs/                      # Main documentation content (MD/MDX)
  <category>/*.mdx         # Topic sections (e.g., wallets/, on-off-ramps/)
src/
  components/              # React components for docs UI
  css/                     # Custom CSS (Tailwind + Docusaurus styles)
  data/                    # Local fallback JSON data
  data-remote/             # Remote-fetched JSON + image mapper (generated)
  pages/                   # Any extra Docusaurus pages
  utils/                   # Utilities (e.g., image mapping)
plugins/
  fetch-remote-data-plugin.js  # Docusaurus plugin to pull data at build time
scripts/
  fetch-remote-data-authenticated.js # Cloudflare R2 fetcher
static/                    # Static assets served as-is under /
build/                     # Production build output (generated)
docusaurus.config.js       # Docusaurus configuration
sidebars.js                # Sidebar configuration
```

### Content Editing

- Docs live in `docs/`. Each folder is a category with `_category_.json` and MD/MDX files.
- Images live under `static/img/` and are referenced via `/img/...` paths in content.
- Data-driven pages/components may read from `@site/src/data-remote/*.json` (generated) or the local `src/data/*.json` fallback.

### Search

Algolia DocSearch is configured in `docusaurus.config.js`. If you fork this repo, update the `algolia` config with your own `appId`, `apiKey`, and `indexName`.

### Styling

- Custom styles: `src/css/custom.css`
- Tailwind CSS 4 is available; see `tailwind.config.js` and `postcss.config.js`.

### Troubleshooting

- Remote fetch fails at build:
  - Ensure `.env` is present and variables are correct.
  - Try a local build with `SKIP_REMOTE_DATA=true yarn build`.
- Images not appearing:
  - For remote data, image URLs are mapped via `src/data-remote/image-mapper.json` and serve from a public R2 domain.
  - For local fallback, images should resolve under `/img` (placed in `static/img`).
- Dev server is slow when starting with data:
  - Use `yarn start` (which sets `SKIP_REMOTE_DATA=true`) for faster iteration.

### Contributing

1) Fork and branch from `main`.
2) Create focused edits in `docs/` or components under `src/`.
3) Run `yarn start` to preview changes.
4) Open a pull request with a clear description and screenshots if UI-related.

### License

Unless otherwise noted in individual files, documentation content is provided under an open documentation-friendly license by the project owners. Verify licensing terms before redistribution.
