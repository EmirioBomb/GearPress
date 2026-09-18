---
name: navigation-catalog
description: Guides maintenance of the GearPress navigation catalog, localized metadata, platform filters, categories, icons, and ranking behavior. Use when editing navigation data, `NavigationHub.vue`, navigation assets, or navigation-page content.
---

# Navigation Catalog

The catalog is primarily defined in `docs/.vuepress/theme/components/navigation/navigation.data.ts`; its UI is implemented in the neighboring `NavigationHub.vue` component.

## Catalog model

Preserve the existing `NavigationItem` shape:

- stable unique `id`, display `name`, external `url`, and descriptive `tags`
- optional `sortName` for names that need a Latin-script alphabetical key
- Chinese and English `description`
- required Iconify `icon`, including when it serves only as the fallback for a local icon
- optional `iconSourceUrl` recording the original source of an optimized local icon
- one or more existing `NavigationPlatform` values
- one existing `NavigationCategory` value
- optional `openSource`, `localFirst`, `priority`, and `featured`
- valid six-digit hex `accent` color consistent with the visual system

Use existing platform, category, filter, and type definitions rather than adding near-duplicate values. `crossPlatform` is derived by the UI from items with at least three platforms; do not add it to `NavigationItem`.

## Icon source priority

Evaluate every item independently in this priority order:

1. Exact recognizable brand icon from Iconify, preferably the appropriate brand collection such as Simple Icons.
2. Current official logo from the product or organization.
3. Semantically similar Iconify icon representing the product's category or function.
4. Existing generic Iconify fallback icon.

An Iconify candidate qualifies for priority 1 only after verifying all of the following:

- the exact icon ID exists and renders; do not infer an ID from a plausible product-name slug
- it represents the product itself, not merely its category, feature, parent company, or a similarly named product
- it is recognizable and consistent with the product's current branding

If any priority-1 check fails or cannot be completed, inspect the current official logo before considering priorities 3 or 4. Do not use a semantic or generic Iconify icon when a verifiable official product logo is available. Do not use an unrelated brand or parent-company logo as a substitute.

If neither an exact Iconify brand icon nor a current official logo can be obtained after reasonable verification, use a verified, non-misleading semantic Iconify icon from priority 3. If no suitable semantic icon is available, use an existing generic Iconify fallback from priority 4. Record which fallback level was used and why. Leave the item unresolved only when no non-misleading fallback can be selected or the fallback icon itself cannot be verified; report that uncertainty instead of guessing.

For an official logo, use a first-party product or organization source, record that location in `iconSourceUrl`, and optimize the asset into `docs/.vuepress/public/navigation-icons/<id>.webp`. The component loads this local file at runtime; `iconSourceUrl` is provenance metadata rather than a hotlink. Keep a valid `icon` value as the local image's runtime failure fallback.

For a batch addition, verify each item separately. Before claiming completion, provide a compact decision table containing the product, Iconify candidate, checks performed, selected source, and reason. Do not infer the remaining rows from earlier products. Rows with an unverified source are incomplete.

Preserve the component's local-image failure behavior. Provide an accessible name for icon-only controls; treat card icons as decorative when the product name is already visible.

## Adding or editing an item

Complete these checks for each item rather than applying assumptions across a batch:

1. Verify that the destination URL is first-party or otherwise authoritative and belongs to the intended product. Do not claim reachability unless it was actually checked.
2. Confirm the product's purpose from an authoritative source before writing concise, factual `zh` and `en` descriptions with equivalent meaning. Do not invent a translation when the meaning is uncertain.
3. Choose the narrowest accurate platforms and one existing category from verified product capabilities, not from branding or visual appearance alone.
4. Add useful search tags without duplicating the category or asserting unsupported features.
5. Set `openSource` and `localFirst` only when the relevant property was verified. Omit an uncertain flag instead of guessing.
6. Add `priority` or `featured` only when the item is intentionally meant to affect the overview ranking or layout; check the resulting order rather than assuming the numeric value is harmless.
7. Follow the icon-selection procedure above and retain source evidence for any local asset.

When changing `NavigationHub.vue`, preserve search, filters, mobile behavior, external-link semantics, icon fallback, and accessible labels. Use `gearpress-ui` together with this Skill for visual changes.

## Validation

Before finishing:

- inspect the complete changed item set for duplicate IDs, missing localized fields, invalid URLs, unsupported enum values, incorrect feature flags, and accidental ranking changes
- verify every added or changed Iconify ID and every added `docs/.vuepress/public/navigation-icons/<id>.webp` file; confirm local-image failure still falls back to `icon`
- check filter counts, searchability, default ordering, and featured-card placement for the affected categories and platforms
- run `pnpm docs:build`
- report any check that could not be performed; do not convert an unverified assumption into a completion claim
