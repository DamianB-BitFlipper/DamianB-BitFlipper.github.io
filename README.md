# Damian Barabonkov

A minimal personal portfolio built with Next.js, with a compact bio, selected project links, and contact information. Designed to fit within one desktop screen.

## Local development

Run `pnpm install`, then `pnpm dev`. No GitHub API token is needed in the browser: projects are read from `content/projects.json` at build time.

Content lives in `content/about.json` and `content/projects.json`. The home page includes a concise introduction and edited summaries in `pages/index.js`. Global styles are in `styles/index.css`, and the portrait is `public/damian_headshot_clean.jpg`.

## Build and deployment

Run `pnpm build` and `pnpm export` to generate the static site in `out/`.

The existing GitHub Actions workflow updates repository data daily and deploys to the `gh-pages` branch. It can also be triggered manually.
