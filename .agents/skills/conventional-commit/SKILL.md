---
name: conventional-commit
description: Creates and reviews English Conventional Commit messages for GearPress, including type selection, release impact, concise bodies, and approved Contributor trailers. Use when preparing commits, reviewing commit history, or deciding whether a change triggers a release.
---

# Conventional Commit

Use this Skill with the repository-wide rules in `AGENTS.md`. Treat `.releaserc.json` as the source of truth for release impact.

## Workflow

1. Inspect the complete diff and identify its purpose.
2. Identify the human author and each Agent that materially contributed to the current commit. Before preparing the commit, report each contributor together with the files or changes they contributed.
3. Choose one configured type and an optional concise scope.
4. Write an imperative English subject and add a Body only when it adds essential context.
5. Add only the project-approved Contributor trailers corresponding to the identified material contributors.
6. Check the release impact against `.releaserc.json`, inspect the exact message before committing, and verify the resulting commit object before reporting success.

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

## Message construction and verification

Treat the commit message as literal text, not as an escaped string.

1. Construct multiline messages with real line-feed characters. Prefer a message file, heredoc, or separate `git commit -m` arguments. Never use a quoted `\n` sequence as a line separator.
2. Before committing, inspect the exact message and staged changes:

```sh
sed -n 'l' <message-file>
git diff --cached --check
```

3. After committing, inspect the actual commit object:

```sh
commit="$(git rev-parse HEAD)"
git show -s --format=%B "$commit" | sed -n 'l'
git show -s --format=%B "$commit" | git interpret-trailers --parse
git show -s --format='%H%n%an <%ae>%n%cn <%ce>%n%s%n%b' "$commit"
```

Verify the intended line boundaries, subject, Body, author, committer, and applicable trailers. An empty parsed-trailer result is valid only when no trailer was intended.

If a pre-commit check finds a quoted `\n` sequence being used as a line separator, reconstruct the message with real line-feed characters and repeat the checks automatically. Commit only after all pre-commit checks pass; do not require the user to regenerate or repair the message.

If a post-commit check fails or cannot be completed, report the exact condition and do not claim success. Do not amend or rewrite the commit unless the user explicitly authorizes it.

## Contributor attribution

- Keep the human who creates and integrates the commit as the primary Git author.
- Report the human author and every material contributor before preparing the commit, including the files or changes each contributor made.
- Add a trailer only for a person or Agent that materially contributed code, documentation, configuration, or design included in the current commit.
- Do not add a trailer for an Agent that only explored, suggested an idea, generated the message, reviewed the diff, ran validation, or otherwise did not materially contribute.
- Do not add every Agent used during the task. Add only the contributors identified for this commit.
- The trailer identity must match the Agent that actually performed the work. When working in Cursor, use the Cursor identity; use Codex, Copilot, or Claude only when that Agent actually performed the work. Do not infer identity from the selected model, available skills, or repository instructions.
- If the source of an existing change or the Agent identity is uncertain, do not guess; omit the trailer for that contribution.

Use these project-approved trailers exactly:

```text
Co-authored-by: Cursor <cursoragent@cursor.com>
Co-authored-by: Copilot <copilot@github.com>
Co-authored-by: Claude <noreply@anthropic.com>
Co-authored-by: Codex <noreply@openai.com>
```

Add each applicable trailer once, at the end of the message after one blank line. Before committing, verify that every trailer corresponds to a reported material contributor and that the author and committer metadata are correct.

## Examples

```text
feat(navigation): add ranked card visual effects
fix(navigation): restore keyboard search focus
docs(content): correct the Homebrew note link
style(css): improve mobile filter spacing
chore(deps): update VuePress packages
```
