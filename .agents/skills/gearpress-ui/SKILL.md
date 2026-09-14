---
name: gearpress-ui
description: Guides GearPress Vue component and style changes with responsive, accessible, theme-aware, and static-generation-safe patterns. Use when working under `docs/.vuepress/theme/components/`, changing site styles or navigation UI, or implementing interactive client behavior.
---

# GearPress UI

Use this Skill for custom VuePress UI in `docs/.vuepress/theme/components/` and related styles.

## Before editing

1. Read the target component and nearby components.
2. Check existing `--gp-*` variables, breakpoints, typography, spacing, and animation patterns.
3. Identify static-generation and browser-only code paths.

## Project constraints

- Reuse existing GearPress components, CSS variables, icons, and layout patterns before adding styles or dependencies.
- Verify narrow screens, long Chinese and English text, both color themes, empty states, and error states.
- Use semantic controls, accessible names, logical tab order, keyboard support, and visible `:focus-visible` states. Treat icons as decorative when visible text already names the control.
- Keep decorative layers `aria-hidden` and non-interactive.
- Run browser-only listeners, observers, and layout measurements from lifecycle code that is safe for static generation; clean them up on unmount.
- Add `prefers-reduced-motion` behavior for new nonessential animation.

## Validation

Run `pnpm docs:build` after UI changes. When a browser preview is available, check the affected route at representative desktop and mobile sizes in both themes. Verify links, icons, focus states, contrast, and reduced-motion behavior. Report build warnings separately and do not claim browser verification that was not performed.
