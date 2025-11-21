# Web simulation of UbuntuOS

This is a personal portfolio website of theme Ubuntu 20.04, made using Next.js & tailwind CSS.

## Local development

1. Install dependencies with `pnpm install`.
2. Export a GitHub token so the UI can call the GitHub API:
   ```bash
   export NEXT_PUBLIC_GITHUB_API_TOKEN="ghp_yourtoken"
   ```
3. Run `pnpm dev` while coding and `pnpm build` before deploying.

_NOTE: `pnpm` is required for the workspace scripts; install it from https://pnpm.io if needed._

The About Damian sections (About, Education, Experience, Projects layout, Resume link, etc.) live in `content/about.json`. Update that file to change the app’s copy.
