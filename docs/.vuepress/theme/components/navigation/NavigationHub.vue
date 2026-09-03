<template>
  <main class="navigation-hub">
    <header class="hub-hero">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="live-dot" aria-hidden="true" />
          {{ copy.eyebrow }}
        </p>
        <h1>{{ copy.title }}</h1>
        <p class="intro">{{ copy.intro }}</p>
      </div>
    </header>

    <div class="filter-dock">
      <label class="command-search" :class="{ focused: isSearchFocused }">
        <Icon icon="lucide:search" class="search-icon" />
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          :placeholder="copy.searchPlaceholder"
          :aria-label="copy.searchLabel"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        >
        <button v-if="query" type="button" :aria-label="copy.clear" @click="clearSearch">
          <Icon icon="lucide:x" />
        </button>
      </label>

      <section class="system-filter" :aria-label="copy.platformLabel">
        <button
          v-for="filter in platformFilters"
          :key="filter.id"
          type="button"
          class="system-filter-item"
          :class="{ active: activePlatform === filter.id }"
          :aria-pressed="activePlatform === filter.id"
          @click="activePlatform = filter.id"
        >
          <Icon :icon="filter.icon" class="system-filter-icon" aria-hidden="true" />
          <span>{{ localize(filter.label) }}</span>
          <small class="count-badge">{{ platformCount(filter.id) }}</small>
        </button>
      </section>
    </div>

    <div class="navigation-content">
      <aside class="category-rail" :aria-label="copy.categoryLabel">
        <div class="filter-group">
          <div class="category-rail-title">{{ copy.categoryTitle }}</div>
          <div class="category-rail-list">
            <button
              type="button"
              :class="{ active: activeCategory === 'all' }"
              :aria-pressed="activeCategory === 'all'"
              @click="activeCategory = 'all'"
            >
              <span>{{ copy.allCategories }}</span>
              <small class="count-badge">{{ categoryCount("all") }}</small>
            </button>
            <button
              v-for="category in availableCategories"
              :key="category"
              type="button"
              :class="{ active: activeCategory === category }"
              :aria-pressed="activeCategory === category"
              @click="activeCategory = category"
            >
              <span>{{ localize(categoryLabels[category]) }}</span>
              <small class="count-badge">{{ categoryCount(category) }}</small>
            </button>
          </div>
        </div>

        <div class="filter-group feature-filter-group">
          <div class="category-rail-title">{{ copy.featureTitle }}</div>
          <div class="category-rail-list feature-filter-list">
            <button
              type="button"
              class="open-source-toggle"
              :class="{ active: openSourceOnly }"
              :aria-pressed="openSourceOnly"
              @click="openSourceOnly = !openSourceOnly"
            >
              <span class="feature-toggle-label">
                <span class="feature-check" aria-hidden="true">
                  <Icon :icon="openSourceOnly ? 'lucide:check' : 'lucide:code-2'" />
                </span>
                <span>{{ copy.openSourceOnly }}</span>
              </span>
              <small class="count-badge">{{ openSourceCount }}</small>
            </button>
          </div>
        </div>
      </aside>

      <div class="card-area">
        <section v-if="hasActiveFilters" class="active-filter-bar" :aria-label="copy.activeFilters">
          <span class="active-filter-summary">
            <Icon icon="lucide:list-filter" aria-hidden="true" />
            <span>{{ copy.activeFilters }}</span>
            <strong aria-live="polite">{{ resultSummary }}</strong>
          </span>

          <span class="active-filter-chips">
            <button
              v-if="activePlatform !== 'all'"
              type="button"
              :aria-label="`${copy.removeFilter} ${activePlatformLabel}`"
              @click="activePlatform = 'all'"
            >
              <Icon :icon="platformIcon(activePlatform)" aria-hidden="true" />
              <span>{{ activePlatformLabel }}</span>
              <Icon icon="lucide:x" class="chip-remove" aria-hidden="true" />
            </button>
            <button
              v-if="activeCategory !== 'all'"
              type="button"
              :aria-label="`${copy.removeFilter} ${activeCategoryLabel}`"
              @click="activeCategory = 'all'"
            >
              <Icon icon="lucide:shapes" aria-hidden="true" />
              <span>{{ activeCategoryLabel }}</span>
              <Icon icon="lucide:x" class="chip-remove" aria-hidden="true" />
            </button>
            <button
              v-if="openSourceOnly"
              type="button"
              :aria-label="`${copy.removeFilter} ${copy.openSource}`"
              @click="openSourceOnly = false"
            >
              <Icon icon="lucide:code-2" aria-hidden="true" />
              <span>{{ copy.openSource }}</span>
              <Icon icon="lucide:x" class="chip-remove" aria-hidden="true" />
            </button>
            <button
              v-if="query.trim()"
              type="button"
              class="query-chip"
              :aria-label="`${copy.removeFilter} ${query}`"
              @click="clearSearch"
            >
              <Icon icon="lucide:search" aria-hidden="true" />
              <span>{{ query }}</span>
              <Icon icon="lucide:x" class="chip-remove" aria-hidden="true" />
            </button>
            <button type="button" class="clear-filter-button" @click="resetFilters">
              {{ copy.clearAll }}
            </button>
          </span>
        </section>

        <section v-if="filteredItems.length" class="card-field">
          <a
            v-for="item in filteredItems"
            :key="item.id"
            class="nav-card"
            :class="item.featured ? `is-${item.featured}` : undefined"
            :style="{ '--item-accent': item.accent }"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="card-aura" aria-hidden="true" />
            <span class="card-topline">
              <span class="app-icon"><Icon :icon="item.icon" /></span>
              <Icon icon="lucide:arrow-up-right" class="open-icon" />
            </span>

            <span class="card-content">
              <span class="card-meta-row">
                <span class="card-category">{{ localize(categoryLabels[item.category]) }}</span>
                <span class="platform-stack">
                  <span
                    v-for="platform in item.platforms"
                    :key="platform"
                    :title="platformName(platform)"
                  >
                    <Icon :icon="platformIcon(platform)" />
                  </span>
                </span>
              </span>
              <strong>{{ item.name }}</strong>
              <span class="card-description">{{ localize(item.description) }}</span>
            </span>

            <span class="card-footer">
              <span class="tags">
                <small v-for="tag in item.tags.slice(0, 2)" :key="tag">{{ tag }}</small>
              </span>
            </span>
          </a>
        </section>

        <section v-else class="empty-state">
          <span><Icon icon="lucide:satellite" /></span>
          <h2>{{ copy.emptyTitle }}</h2>
          <p>{{ copy.emptyText }}</p>
          <button type="button" @click="resetFilters">{{ copy.reset }}</button>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { computed, ref, watch } from "vue"
import { useData } from "vuepress-theme-plume/composables"

import {
  categoryLabels,
  navigationItems,
  platformFilters,
  type LocalizedText,
  type NavigationCategory,
  type NavigationPlatform,
} from "./navigation.data"

const { lang } = useData()
const locale = computed<"zh" | "en">(() => lang.value.startsWith("en") ? "en" : "zh")

const content = {
  zh: {
    eyebrow: "PERSONAL LAUNCH DECK",
    title: "一切从这里开始",
    intro: "这里收录了我日常最常使用的应用与网站。",
    searchPlaceholder: "搜索应用、网站或分类…",
    searchLabel: "搜索导航项目",
    platformLabel: "按平台筛选",
    categoryLabel: "按分类与特性筛选",
    categoryTitle: "分类",
    featureTitle: "特性",
    openSource: "开源",
    openSourceOnly: "仅看开源",
    activeFilters: "当前筛选",
    removeFilter: "移除筛选",
    clearAll: "清除全部",
    allCategories: "全部",
    clear: "清空搜索",
    emptyTitle: "这条轨道暂时没有坐标",
    emptyText: "换一个关键词，或回到完整导航场。",
    reset: "重置筛选",
  },
  en: {
    eyebrow: "PERSONAL LAUNCH DECK",
    title: "Everything you need, just a click away",
    intro: "A collection of the apps and websites I use most often every day.",
    searchPlaceholder: "Search apps, websites, or categories…",
    searchLabel: "Search navigation items",
    platformLabel: "Filter by platform",
    categoryLabel: "Filter by category and feature",
    categoryTitle: "Category",
    featureTitle: "Feature",
    openSource: "Open source",
    openSourceOnly: "Open source",
    activeFilters: "Active filters",
    removeFilter: "Remove filter",
    clearAll: "Clear all",
    allCategories: "All",
    clear: "Clear search",
    emptyTitle: "No destinations on this orbit",
    emptyText: "Try another keyword or return to the complete field.",
    reset: "Reset filters",
  },
}

const copy = computed(() => content[locale.value])
const activePlatform = ref<NavigationPlatform | "all">("all")
const activeCategory = ref<NavigationCategory | "all">("all")
const openSourceOnly = ref(false)
const query = ref("")
const searchInput = ref<HTMLInputElement>()
const isSearchFocused = ref(false)
const categoryOrder: NavigationCategory[] = ["productivity", "development", "ai", "design", "utilities", "knowledge"]

function localize(text: LocalizedText) {
  return text[locale.value]
}

function platformIcon(platform: NavigationPlatform) {
  return platformFilters.find(item => item.id === platform)?.icon ?? "lucide:box"
}

function platformName(platform: NavigationPlatform) {
  const filter = platformFilters.find(item => item.id === platform)
  return filter ? localize(filter.label) : platform
}

function platformCount(platform: NavigationPlatform | "all") {
  if (platform === "all") return navigationItems.length
  return navigationItems.filter(item => item.platforms.includes(platform)).length
}

function itemsForActivePlatform() {
  return activePlatform.value === "all"
    ? navigationItems
    : navigationItems.filter(item => item.platforms.includes(activePlatform.value))
}

function categoryCount(category: NavigationCategory | "all") {
  const platformItems = itemsForActivePlatform()
  const source = openSourceOnly.value ? platformItems.filter(item => item.openSource) : platformItems
  return category === "all" ? source.length : source.filter(item => item.category === category).length
}

const openSourceCount = computed(() => {
  return itemsForActivePlatform().filter((item) => {
    const matchesCategory = activeCategory.value === "all" || item.category === activeCategory.value
    return item.openSource && matchesCategory
  }).length
})

const availableCategories = computed(() => {
  const platformItems = itemsForActivePlatform()
  return categoryOrder.filter(category => platformItems.some(item => item.category === category))
})

watch(activePlatform, () => {
  if (activeCategory.value !== "all" && !availableCategories.value.includes(activeCategory.value))
    activeCategory.value = "all"
})

const filteredItems = computed(() => {
  const term = query.value.trim().toLocaleLowerCase(locale.value)

  return navigationItems.filter((item) => {
    const matchesPlatform = activePlatform.value === "all" || item.platforms.includes(activePlatform.value)
    const matchesCategory = activeCategory.value === "all" || item.category === activeCategory.value
    const matchesOpenSource = !openSourceOnly.value || item.openSource
    const searchable = [
      item.name,
      localize(item.description),
      localize(categoryLabels[item.category]),
      item.openSource ? copy.value.openSource : "",
      ...item.tags,
    ].join(" ").toLocaleLowerCase(locale.value)

    return matchesPlatform && matchesCategory && matchesOpenSource && (!term || searchable.includes(term))
  })
})

const hasActiveFilters = computed(() => {
  return activePlatform.value !== "all"
    || activeCategory.value !== "all"
    || openSourceOnly.value
    || Boolean(query.value.trim())
})

const activePlatformLabel = computed(() => {
  return activePlatform.value === "all" ? "" : platformName(activePlatform.value)
})

const activeCategoryLabel = computed(() => {
  return activeCategory.value === "all" ? "" : localize(categoryLabels[activeCategory.value])
})

const resultSummary = computed(() => {
  return locale.value === "zh"
    ? `共 ${filteredItems.value.length} 项`
    : `${filteredItems.value.length} ${filteredItems.value.length === 1 ? "item" : "items"}`
})

function clearSearch() {
  query.value = ""
  searchInput.value?.focus()
}

function resetFilters() {
  activePlatform.value = "all"
  activeCategory.value = "all"
  openSourceOnly.value = false
  query.value = ""
}
</script>

<style scoped>
:global(.navigation-hub-page .vp-home-custom) {
  width: 100%;
  padding-top: 16px;
}

:global(.navigation-hub-page .vp-home-custom > .container) {
  width: 100%;
  max-width: none;
  padding: 0;
}

:global(.navigation-hub-page .vp-home-custom .vp-doc) {
  max-width: none;
  padding: 0;
  margin: 0;
}

.navigation-hub {
  --hub-radius: 24px;
  --filter-dock-top: 64px;
  --filter-dock-height: 54px;
  box-sizing: border-box;
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 clamp(12px, 1.8vw, 24px) 48px;
  color: var(--vp-c-text-1);
}

.hub-hero {
  position: relative;
  display: block;
  padding: 14px clamp(14px, 1.8vw, 20px);
  overflow: hidden;
  border: 1px solid var(--gp-home-card-border);
  border-radius: calc(var(--hub-radius) + 8px);
  background:
    radial-gradient(circle at 8% 10%, color-mix(in srgb, var(--gp-cyan) 22%, transparent), transparent 34%),
    radial-gradient(circle at 90% 90%, color-mix(in srgb, var(--gp-purple) 20%, transparent), transparent 36%),
    var(--gp-home-card-bg);
  box-shadow: var(--gp-home-card-shadow);
}

.hub-hero::after {
  position: absolute;
  right: -72px;
  top: -110px;
  width: 170px;
  height: 170px;
  border: 1px solid color-mix(in srgb, var(--gp-cyan) 30%, transparent);
  border-radius: 50%;
  box-shadow:
    0 0 0 38px color-mix(in srgb, var(--gp-blue) 7%, transparent),
    0 0 0 78px color-mix(in srgb, var(--gp-purple) 5%, transparent);
  content: "";
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.filter-dock {
  position: sticky;
  z-index: 20;
  top: var(--filter-dock-top);
  display: grid;
  grid-template-columns: minmax(230px, 0.42fr) minmax(0, 1fr);
  min-height: var(--filter-dock-height);
  box-sizing: border-box;
  gap: 8px;
  align-items: center;
  margin: 12px 0 18px;
  padding: 6px;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 24%, var(--gp-home-card-border));
  border-radius: 18px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 90%, transparent);
  box-shadow:
    0 8px 24px rgb(42 67 89 / 0.10),
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 5%, transparent);
  backdrop-filter: blur(18px) saturate(1.12);
  -webkit-backdrop-filter: blur(18px) saturate(1.12);
}

.eyebrow {
  display: flex;
  gap: 7px;
  align-items: center;
  margin: 0 0 5px;
  color: var(--gp-icon-highlight);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.19em;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gp-cyan);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--gp-cyan) 16%, transparent);
}

h1 {
  max-width: 680px;
  margin: 0;
  color: transparent;
  background: var(--gp-gradient-readable);
  background-clip: text;
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 780;
  letter-spacing: -0.055em;
  line-height: 1.02;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.intro {
  display: -webkit-box;
  max-width: 660px;
  margin: 6px 0 0;
  overflow: hidden;
  color: var(--gp-home-muted);
  font-size: clamp(12px, 1.2vw, 13px);
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.command-search {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  width: 100%;
  height: 40px;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 24%, var(--gp-home-card-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--gp-surface-bg-soft) 88%, transparent);
  box-shadow: 0 5px 14px rgb(35 48 72 / 0.08);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.command-search.focused {
  border-color: var(--gp-cyan);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--gp-cyan) 14%, transparent),
    0 7px 18px color-mix(in srgb, var(--gp-blue) 16%, transparent);
  transform: translateY(-1px);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--gp-icon-highlight);
}

.command-search input {
  width: 100%;
  min-width: 0;
  padding: 6px 0;
  color: var(--vp-c-text-1);
  font: inherit;
  background: transparent;
  border: 0;
  outline: 0;
}

.command-search input::placeholder {
  color: var(--vp-c-text-3);
}

.command-search input::-webkit-search-cancel-button {
  display: none;
  appearance: none;
}

.command-search button {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  padding: 0;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 8px;
  background: var(--gp-surface-bg-soft);
}

.command-search button {
  cursor: pointer;
}

.system-filter {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  min-width: 0;
  gap: 3px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  box-shadow: none;
}

.system-filter-item {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  min-width: 0;
  min-height: 38px;
  gap: 7px;
  align-items: center;
  justify-content: center;
  padding: 7px 8px;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  cursor: pointer;
  transition:
    color 180ms ease,
    background 180ms ease,
    box-shadow 240ms ease,
    transform 180ms ease;
}

.system-filter-icon {
  flex: none;
  width: 15px;
  height: 15px;
  color: var(--vp-c-text-3);
  transition: color 160ms ease;
}

.system-filter-item:hover {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--gp-blue) 7%, transparent);
  transform: translateY(-1px);
}

.system-filter-item:hover .system-filter-icon,
.system-filter-item.active .system-filter-icon {
  color: var(--gp-icon-highlight);
}

@property --nav-filter-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.system-filter-item.active {
  color: var(--vp-c-text-1);
  font-weight: 750;
  border-color: var(--gp-active-border);
  background: var(--gp-gradient-active);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 24%, transparent),
    0 0 18px var(--gp-active-glow),
    0 6px 16px rgb(32 52 75 / 0.18);
}

.system-filter-item.active::before {
  position: absolute;
  z-index: 1;
  inset: -1px;
  padding: 1px;
  pointer-events: none;
  background: conic-gradient(
    from var(--nav-filter-angle),
    transparent 0deg 225deg,
    color-mix(in srgb, var(--gp-cyan) 45%, transparent) 245deg,
    var(--gp-cyan) 266deg,
    #eaffff 280deg,
    var(--gp-blue) 296deg,
    var(--gp-purple) 320deg,
    transparent 342deg 360deg
  );
  border-radius: inherit;
  content: "";
  animation: nav-filter-border-flow 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@keyframes nav-filter-border-flow {
  to {
    --nav-filter-angle: 360deg;
  }
}

.system-filter-item:focus-visible,
.category-rail button:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.count-badge {
  display: inline-flex;
  min-width: 22px;
  height: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 30%, var(--gp-home-card-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--gp-blue) 12%, var(--gp-surface-bg-elv));
}

.system-filter-item:hover .count-badge,
.system-filter-item.active .count-badge,
.category-rail button:hover .count-badge,
.category-rail button.active .count-badge {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--gp-blue) 48%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 22%, var(--gp-surface-bg-elv));
}

.system-filter-item.active .count-badge,
.category-rail button.active .count-badge {
  border-color: color-mix(in srgb, var(--gp-cyan) 64%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-cyan) 26%, var(--gp-surface-bg-elv));
  box-shadow: 0 0 10px color-mix(in srgb, var(--gp-cyan) 20%, transparent);
}

.navigation-content {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.card-area {
  min-width: 0;
}

.active-filter-bar {
  display: flex;
  min-width: 0;
  gap: 10px 14px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 9px 11px;
  border: 1px solid color-mix(in srgb, var(--gp-active-border) 72%, var(--gp-home-card-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 82%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 8%, transparent),
    0 8px 20px rgb(32 52 75 / 0.10);
  animation: active-filter-bar-enter 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes active-filter-bar-enter {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
}

.active-filter-summary,
.active-filter-chips,
.active-filter-chips button {
  display: flex;
  align-items: center;
}

.active-filter-summary {
  flex: 0 0 auto;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 11px;
  white-space: nowrap;
}

.active-filter-summary > svg {
  width: 15px;
  height: 15px;
  color: var(--gp-icon-highlight);
}

.active-filter-summary strong {
  color: var(--vp-c-text-1);
  font-weight: 750;
}

.active-filter-chips {
  min-width: 0;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.active-filter-chips button {
  min-width: 0;
  gap: 5px;
  padding: 4px 7px;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  border: 1px solid color-mix(in srgb, var(--gp-active-border) 72%, var(--gp-home-card-border));
  border-radius: 999px;
  background: var(--gp-gradient-active);
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.active-filter-chips button:hover,
.active-filter-chips button:focus-visible {
  border-color: var(--gp-active-border);
  box-shadow: 0 0 12px var(--gp-active-glow);
  transform: translateY(-1px);
}

.active-filter-chips button:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.active-filter-chips button > svg {
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  color: var(--gp-icon-highlight);
}

.active-filter-chips button > span {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-filter-chips .chip-remove {
  color: var(--vp-c-text-2);
}

.active-filter-chips .clear-filter-button {
  color: var(--vp-c-text-2);
  border-color: transparent;
  background: transparent;
}

.active-filter-chips .clear-filter-button:hover,
.active-filter-chips .clear-filter-button:focus-visible {
  color: var(--vp-c-text-1);
  border-color: var(--gp-home-card-border);
  background: color-mix(in srgb, var(--gp-blue) 10%, transparent);
  box-shadow: none;
}

.category-rail {
  position: sticky;
  top: calc(var(--filter-dock-top) + var(--filter-dock-height) + 12px);
  min-width: 0;
  padding: 4px 0 4px 14px;
}

.category-rail-title {
  margin: 0 0 8px;
  color: var(--vp-c-text-2);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.12em;
}

.feature-filter-group {
  margin-top: 18px;
}

.feature-toggle-label {
  display: flex;
  min-width: 0;
  gap: 6px;
  align-items: center;
}

.feature-check {
  display: grid;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  place-items: center;
  color: var(--vp-c-text-3);
  font-size: 11px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 6px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 78%, transparent);
  transition: color 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.open-source-toggle.active .feature-check {
  color: #f7fdff;
  border-color: color-mix(in srgb, var(--gp-cyan) 78%, transparent);
  background: linear-gradient(135deg, var(--gp-cyan), var(--gp-blue));
  box-shadow: 0 0 12px color-mix(in srgb, var(--gp-cyan) 42%, transparent);
}

.category-rail-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.category-rail-list::before {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 2px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--gp-cyan) 42%, transparent),
    color-mix(in srgb, var(--gp-purple) 36%, transparent),
    transparent
  );
  content: "";
}

.category-rail button {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 29px;
  box-sizing: border-box;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0 3px 14px;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  font-weight: 560;
  text-align: left;
  border: 0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, transform 160ms ease;
}

.category-rail button::before {
  position: absolute;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gp-home-card-border);
  content: "";
  transition: width 160ms ease, height 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.category-rail button:hover {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--gp-blue) 5%, transparent);
  transform: translateX(2px);
}

.category-rail button:hover::before {
  background: var(--gp-cyan);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--gp-cyan) 11%, transparent);
}

.category-rail button.active {
  color: var(--vp-c-text-1);
  font-weight: 750;
  background: var(--gp-gradient-active);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 74%, transparent),
    0 5px 14px color-mix(in srgb, var(--gp-active-glow) 58%, transparent);
  transform: translateX(2px);
}

.category-rail button.active::before {
  width: 3px;
  height: 17px;
  border-radius: 999px;
  background: var(--gp-gradient-readable);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 20%, transparent),
    0 0 12px color-mix(in srgb, var(--gp-cyan) 48%, transparent);
}

.category-rail .count-badge {
  flex: none;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 28%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 12%, var(--gp-surface-bg-elv));
}

.empty-state button {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 11px;
  color: var(--gp-home-text);
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--gp-home-card-bg) 82%, transparent);
  cursor: pointer;
  transition: 160ms ease;
}

.empty-state button:hover {
  color: var(--gp-home-text);
  border-color: color-mix(in srgb, var(--gp-blue) 38%, var(--gp-home-card-border));
  background: var(--gp-gradient-soft);
}

.card-field {
  display: grid;
  grid-auto-flow: dense;
  grid-auto-rows: minmax(195px, auto);
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.nav-card {
  position: relative;
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  overflow: hidden;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border: 1px solid var(--gp-home-card-border);
  border-radius: var(--hub-radius);
  background: var(--gp-home-card-bg);
  box-shadow: var(--gp-home-card-shadow);
  isolation: isolate;
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.nav-card.is-wide {
  grid-column: span 2;
}

.nav-card.is-tall {
  grid-row: span 2;
}

.card-aura {
  position: absolute;
  z-index: -1;
  top: -75px;
  right: -65px;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--item-accent) 25%, transparent), transparent 68%);
  opacity: 0.75;
  transition: opacity 220ms ease, transform 300ms ease;
}

.nav-card:hover,
.nav-card:focus-visible {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--item-accent) 58%, var(--gp-home-card-border));
  box-shadow: 0 18px 42px color-mix(in srgb, var(--item-accent) 17%, transparent);
  transform: translateY(-5px);
}

.nav-card:hover .card-aura,
.nav-card:focus-visible .card-aura {
  opacity: 1;
  transform: scale(1.25);
}

.card-topline,
.card-meta-row,
.platform-stack,
.tags {
  display: flex;
  align-items: center;
}

.card-topline,
.card-meta-row {
  justify-content: space-between;
}

.card-meta-row {
  min-width: 0;
  gap: 8px;
  margin-bottom: 6px;
}

.app-icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: var(--item-accent);
  font-size: 23px;
  border: 1px solid color-mix(in srgb, var(--item-accent) 34%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--item-accent) 12%, var(--gp-surface-bg-elv));
}

.open-icon {
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  transition: color 180ms ease, transform 180ms ease;
}

.nav-card:hover .open-icon {
  color: var(--item-accent);
  transform: translate(3px, -3px);
}

.card-content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  margin: 14px 0 auto;
}

.card-category {
  min-width: 0;
  overflow: hidden;
  color: color-mix(in srgb, var(--item-accent) 72%, var(--vp-c-text-1));
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.card-content strong {
  overflow: hidden;
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-description {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  color: var(--gp-home-muted);
  font-size: 12px;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.is-tall .card-description {
  font-size: 13px;
  -webkit-line-clamp: 5;
}

.card-footer {
  display: flex;
  min-width: 0;
  align-items: center;
  margin-top: 12px;
}

.platform-stack {
  flex: 0 0 auto;
}

.platform-stack span {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  margin-left: -4px;
  color: var(--vp-c-text-2);
  font-size: 11px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 50%;
  background: var(--gp-surface-bg-elv);
  transition: color 180ms ease, border-color 180ms ease, background 180ms ease;
}

.nav-card:hover .platform-stack span,
.nav-card:focus-visible .platform-stack span {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--gp-blue) 32%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 8%, var(--gp-surface-bg-elv));
}

.platform-stack span:first-child {
  margin-left: 0;
}

.tags {
  flex-wrap: wrap;
  gap: 5px;
  min-width: 0;
  max-width: 100%;
}

.tags small {
  max-width: 100%;
  padding: 3px 7px;
  overflow: hidden;
  color: color-mix(in srgb, var(--item-accent) 76%, var(--vp-c-text-1));
  font-size: 10px;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid color-mix(in srgb, var(--item-accent) 24%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--item-accent) 10%, var(--gp-surface-bg-soft));
}

.empty-state {
  display: grid;
  min-height: 320px;
  place-items: center;
  align-content: center;
  text-align: center;
  border: 1px dashed var(--gp-home-card-border);
  border-radius: var(--hub-radius);
  background: var(--gp-home-card-bg);
}

.empty-state > span {
  color: var(--gp-icon-highlight);
  font-size: 42px;
}

.empty-state h2 {
  margin: 14px 0 0;
  font-size: 20px;
}

.empty-state p {
  margin: 8px 0 18px;
  color: var(--gp-home-muted);
  font-size: 13px;
}

:global(html[data-theme="dark"]) .filter-dock,
:global(html[data-theme="dark"]) .active-filter-bar {
  border-color: color-mix(in srgb, var(--gp-active-border) 42%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 94%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 6%, transparent),
    0 10px 28px rgb(2 8 20 / 0.30);
}

:global(html[data-theme="dark"]) .system-filter {
  background: transparent;
  box-shadow: none;
}

:global(html[data-theme="dark"]) .system-filter-item.active {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 34%, transparent),
    0 0 16px color-mix(in srgb, #eaffff 12%, transparent),
    0 0 24px var(--gp-active-glow),
    0 8px 20px rgb(2 8 20 / 0.34);
}

:global(html[data-theme="dark"]) .category-rail button.active {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 82%, transparent),
    0 0 16px color-mix(in srgb, var(--gp-cyan) 16%, transparent),
    0 7px 18px rgb(2 8 20 / 0.26);
}

:global(html[data-theme="dark"]) .nav-card {
  border-color: color-mix(in srgb, var(--gp-blue) 16%, var(--gp-home-card-border));
}

:global(html[data-theme="dark"]) .system-filter-item:not(.active),
:global(html[data-theme="dark"]) .category-rail button:not(.active) {
  color: var(--gp-home-muted);
}

@media (max-width: 1200px) {
  .card-field {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 959px) {
  .navigation-hub {
    --filter-dock-top: 0px;
    --filter-dock-height: 102px;
  }

  .filter-dock {
    grid-template-columns: 1fr;
  }

  .system-filter {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .system-filter::-webkit-scrollbar {
    display: none;
  }

  .system-filter-item {
    min-width: 106px;
    flex: 1 0 auto;
  }
}

@media (max-width: 920px) {
  .card-field {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .navigation-hub {
    padding-bottom: 48px;
  }

  .hub-hero {
    margin-bottom: 12px;
    padding: 14px;
    border-radius: 24px;
  }

  .filter-dock {
    display: contents;
  }

  .command-search {
    position: sticky;
    z-index: 20;
    top: var(--filter-dock-top);
    margin-bottom: 8px;
    border-color: color-mix(in srgb, var(--gp-active-border) 56%, var(--gp-home-card-border));
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 94%, transparent);
    box-shadow:
      0 7px 20px rgb(42 67 89 / 0.14),
      0 0 0 1px color-mix(in srgb, var(--gp-cyan) 6%, transparent);
    backdrop-filter: blur(18px) saturate(1.12);
    -webkit-backdrop-filter: blur(18px) saturate(1.12);
  }

  h1 {
    font-size: clamp(28px, 9vw, 36px);
  }

  .intro {
    font-size: 12px;
    line-height: 1.45;
  }

  .system-filter {
    display: flex;
    gap: 3px;
    margin: 0 -4px 18px;
    padding: 4px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .system-filter::-webkit-scrollbar {
    display: none;
  }

  .system-filter-item {
    flex: 0 0 auto;
    min-width: 106px;
  }

  .navigation-content {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .category-rail {
    position: static;
    width: auto;
    padding: 0;
  }

  .category-rail-title {
    margin-bottom: 5px;
  }

  .feature-filter-group {
    margin-top: 8px;
  }

  .category-rail-list {
    flex-direction: row;
    gap: 6px;
    margin: 0 -4px;
    padding: 2px 4px 6px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .category-rail-list::-webkit-scrollbar {
    display: none;
  }

  .category-rail-list::before,
  .category-rail button::before {
    display: none;
  }

  .category-rail button {
    width: auto;
    min-height: 30px;
    flex: 0 0 auto;
    gap: 7px;
    padding: 5px 9px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 72%, transparent);
  }

  .category-rail button:hover {
    transform: translateY(-1px);
  }

  .category-rail button.active {
    background: var(--gp-gradient-active);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 74%, transparent),
      0 5px 14px color-mix(in srgb, var(--gp-active-glow) 58%, transparent);
  }

  .active-filter-bar {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
    padding: 9px;
  }

  .active-filter-summary {
    justify-content: space-between;
  }

  .active-filter-summary > svg {
    margin-right: 1px;
  }

  .active-filter-summary > span {
    margin-right: auto;
  }

  .active-filter-chips {
    justify-content: flex-start;
  }

  .card-field {
    grid-auto-rows: auto;
    grid-template-columns: 1fr;
  }

  .nav-card,
  .nav-card.is-wide,
  .nav-card.is-tall {
    grid-column: span 1;
    grid-row: span 1;
    min-height: 180px;
  }

  .is-tall .card-description {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .command-search,
  .system-filter-item,
  .system-filter-icon,
  .category-rail button,
  .category-rail button::before,
  .feature-check,
  .active-filter-bar,
  .active-filter-chips button,
  .nav-card,
  .card-aura,
  .open-icon {
    transition: none;
  }

  .system-filter-item.active::before,
  .active-filter-bar {
    animation: none;
  }
}
</style>
