# GearPress Agent Instructions

GearPress is a VuePress 2 knowledge base and navigation site built with Vue 3, TypeScript, Vite, and `vuepress-theme-plume`.

## Repository map

- `docs/`: Chinese documentation and site content.
- `docs/en/`: English counterparts for supported documentation.
- `docs/.vuepress/`: VuePress configuration, client setup, custom components, styles, and public assets.
- `docs/.vuepress/theme/components/navigation/`: navigation UI and catalog data.
- `.agents/skills/`: project-specific Agent Skills.
- `.releaserc.json`: semantic-release configuration and release rules.
- `.github/workflows/`: release and GitHub Pages deployment workflows.

## Working rules

- Inspect nearby files before editing and keep changes focused.
- Preserve Vue 3, TypeScript, VuePress 2, and Plume conventions already used by the project.
- Keep Chinese and supported English content semantically aligned. If a translation is unavailable, state that clearly rather than inventing one.
- Use repository-relative paths with forward slashes in documentation, configuration, and scripts.
- Keep external links, image paths, frontmatter, and generated routes valid.
- Reuse existing components, icons, CSS variables, and animation patterns before adding dependencies or duplicate styles.
- Preserve semantic HTML, keyboard access, visible focus, useful alternative text, responsive layouts, and reduced-motion behavior.
- Guard browser-only APIs and layout measurements during VuePress static generation.

## Commands and validation

Use the repository's declared pnpm version and scripts:

- `pnpm docs:dev`: start the documentation server.
- `pnpm docs:dev-clean`: start it after clearing VuePress cache and temporary files.
- `pnpm docs:build`: build and validate the production site.
- `pnpm docs:preview`: serve `docs/.vuepress/dist` after a build.

Run `pnpm docs:build` after changes to Vue components, VuePress configuration, Markdown frontmatter, navigation data, or public assets. Read the relevant Skill under `.agents/skills/` before editing UI, navigation, or commit-related files. For Markdown content, follow the content rules in this file.

## Git and release safety

- Do not create, amend, squash, rebase, or reset commits unless the user explicitly requests it.
- Leave changes uncommitted for user review. Do not push, publish, release, or deploy without explicit approval.
- Never commit secrets, tokens, private URLs, generated `docs/.vuepress/dist` output, or machine-specific configuration.
- Before finishing, inspect the complete diff and `git status`, and report changed files and validation results.
- Use English Conventional Commits with the configured types: `feat`, `fix`, `perf`, `docs`, `style`, `chore`, `refactor`, `ci`, and `test`. Do not invent types such as `refine`, `improve`, `update`, or `change`.
- Before preparing any commit, report the human author and each material contributor together with the files or changes they contributed. Add only the corresponding project-approved `Co-authored-by` trailers; do not add every Agent used, and never guess an identity when the source of an existing change is uncertain. Follow `.agents/skills/conventional-commit/SKILL.md` for the detailed attribution procedure.
- Treat `.releaserc.json` as the source of truth for release impact. Read the Conventional Commit Skill before preparing or reviewing a commit. Do not manually edit generated changelog entries when semantic-release is responsible for them.
