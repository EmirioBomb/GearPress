---
name: navigation-catalog
description: Guides maintenance of the GearPress navigation catalog, localized metadata, platform filters, categories, icons, and ranking behavior. Use when editing navigation data, `NavigationHub.vue`, navigation assets, or navigation-page content.
---

# Navigation Catalog

The catalog is primarily defined in `docs/.vuepress/theme/components/navigation/navigation.data.ts`; its UI is implemented in the neighboring `NavigationHub.vue` component.

## Catalog model

Preserve the existing `NavigationItem` shape:

- stable unique `id`, display `name`, external `url`, and descriptive `tags`
- Chinese and English `description`
- Iconify `icon` or a supported local icon source
- one or more existing `NavigationPlatform` values
- one existing `NavigationCategory` value
- optional `openSource`, `localFirst`, `priority`, and `featured`
- valid six-digit hex `accent` color consistent with the visual system

Use existing platform, category, filter, and type definitions rather than adding near-duplicate values. `crossPlatform` is derived by the UI from items with at least three platforms; do not add it to `NavigationItem`.

## Icon source priority

Use this priority order:

1. Exact recognizable brand icon from Iconify, preferably the appropriate brand collection such as Simple Icons.
2. Current official logo from the product or organization.
3. Semantically similar Iconify icon representing the product's category or function.
4. Existing generic fallback icon or text initials.

Do not use an unrelated brand or parent-company logo as a substitute. If an Iconify icon is outdated or incorrect, prefer the current official logo. Optimize official logos into `docs/.vuepress/public/navigation-icons/<id>.webp`; keep `iconSourceUrl` as source metadata, not as a hotlink requirement. Preserve the component's local-image failure fallback to the Iconify icon. Provide an accessible name for icon-only controls; treat card icons as decorative when the product name is already visible.

## Adding or editing an item

1. Verify the destination URL and product identity.
2. Write concise, factual `zh` and `en` descriptions with equivalent meaning.
3. Choose the narrowest accurate platforms and category.
4. Add useful tags without duplicating the category.
5. Add `priority` only when the item should affect the default overview order.

When changing `NavigationHub.vue`, preserve search, filters, mobile behavior, external-link semantics, icon fallback, and accessible labels. Use `gearpress-ui` together with this Skill for visual changes.

## Validation

Check TypeScript types, duplicate IDs, localized fields, URLs, icon behavior, filter counts, and ranking order. Run `pnpm docs:build`. Do not claim a link is reachable unless it was actually checked.
