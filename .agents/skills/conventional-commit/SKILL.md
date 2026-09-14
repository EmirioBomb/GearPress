---
name: conventional-commit
description: Creates and reviews English Conventional Commit messages for GearPress, including type selection, release impact, concise bodies, and approved Contributor trailers. Use when preparing commits, reviewing commit history, or deciding whether a change triggers a release.
---

# Conventional Commit

Use this Skill with the repository-wide rules in `AGENTS.md`. Treat `.releaserc.json` as the source of truth for release impact.

## Workflow

1. Inspect the complete diff and identify its purpose.
2. Choose one configured type and an optional concise scope.
3. Write an imperative English subject and add a Body only when it adds essential context.
4. Add only the project-approved Contributor trailers for people or Agents that materially contributed to the current commit.
5. Check the release impact against `.releaserc.json`.

## Format

```text
<type>(<scope>): <imperative subject>

- Describe one independent change or result
- Describe another independent change or result

Co-authored-by: <name> <email>
```

The scope, Body, and Contributor trailers are optional. Omit them when they add no useful information.

## Type selection and release impact

Use only these configured types: `feat`, `fix`, `perf`, `docs`, `style`, `chore`, `refactor`, `ci`, and `test`. Do not invent types such as `refine`, `improve`, `update`, or `change`.

- `feat`: add user-visible functionality; minor release.
- `fix`: correct existing application behavior or a user-visible defect; patch release.
- `perf`: improve runtime or build performance; patch release.
- `docs`: add, translate, or correct documentation; patch release.
- `style(css)`: change presentation without changing behavior; patch release. Other `style` scopes do not release by default.
- `chore(deps)`: update dependencies; patch release. Other `chore` scopes do not release by default.
- `refactor`: change implementation without changing behavior; no release by default.
- `ci`: change CI or release automation; no release by default.
- `test`: add or modify tests; no release by default.
- Breaking changes: use `!` or `BREAKING CHANGE:`; major release regardless of the base type.

Use `docs` for documentation-only corrections and `fix` when application code corrects the behavior. Use a short scope tied to the affected area, such as `navigation`, `content`, `en`, `css`, `deps`, or `release`.

## Subject and Body rules

- Keep the subject concise, imperative, and free of a trailing period.
- Write each Body item on its own physical line and prefix it with `-`.
- Use real line breaks; never write the literal `\n` sequence.
- Keep each item focused on one result, and do not repeat the subject in the Body.
- Leave one blank line between the subject and Body and one blank line between the Body and Footer.

## Contributor attribution

Add a Trailer only when the person or Agent materially contributed code, documentation, configuration, or design included in the commit. Do not attribute an Agent that only suggested an idea, generated the message, reviewed the diff, or ran validation. Keep the human who creates and integrates the commit as the primary Git author.

Use these project-approved trailers exactly:

```text
Co-authored-by: Cursor <cursoragent@cursor.com>
Co-authored-by: Copilot <copilot@github.com>
Co-authored-by: Claude <noreply@anthropic.com>
Co-authored-by: Codex <noreply@openai.com>
```

Add each applicable Trailer once, at the end of the message after one blank line. Verify the display name and GitHub-associated email before attributing any other person or Agent.

## Examples

```text
feat(navigation): add ranked card visual effects
fix(navigation): restore keyboard search focus
docs(content): correct the Homebrew note link
style(css): improve mobile filter spacing
chore(deps): update VuePress packages
```
