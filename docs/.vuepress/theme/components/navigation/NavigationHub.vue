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
    </header>

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

    <div class="navigation-content">
      <aside class="category-rail" :aria-label="copy.categoryLabel">
        <div class="category-rail-title">{{ copy.purposeLabel }}</div>
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
      </aside>

      <div class="card-area">
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
              <span class="card-category">{{ localize(categoryLabels[item.category]) }}</span>
              <strong>{{ item.name }}</strong>
              <span class="card-description">{{ localize(item.description) }}</span>
            </span>

            <span class="card-footer">
              <span class="platform-stack">
                <span
                  v-for="platform in item.platforms"
                  :key="platform"
                  :title="platformName(platform)"
                >
                  <Icon :icon="platformIcon(platform)" />
                </span>
              </span>
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
    searchPlaceholder: "搜索应用、网站或用途…",
    searchLabel: "搜索导航项目",
    platformLabel: "按系统筛选",
    categoryLabel: "按用途筛选",
    purposeLabel: "用途",
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
    searchPlaceholder: "Search apps, websites, or tasks…",
    searchLabel: "Search navigation items",
    platformLabel: "Filter by platform",
    categoryLabel: "Filter by purpose",
    purposeLabel: "Purpose",
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
const query = ref("")
const searchInput = ref<HTMLInputElement>()
const isSearchFocused = ref(false)

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
  const source = itemsForActivePlatform()
  return category === "all" ? source.length : source.filter(item => item.category === category).length
}

const availableCategories = computed(() => {
  return [...new Set(itemsForActivePlatform().map(item => item.category))]
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
    const searchable = [
      item.name,
      localize(item.description),
      localize(categoryLabels[item.category]),
      ...item.tags,
    ].join(" ").toLocaleLowerCase(locale.value)

    return matchesPlatform && matchesCategory && (!term || searchable.includes(term))
  })
})

function clearSearch() {
  query.value = ""
  searchInput.value?.focus()
}

function resetFilters() {
  activePlatform.value = "all"
  activeCategory.value = "all"
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
  box-sizing: border-box;
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 clamp(12px, 1.8vw, 24px) 48px;
  color: var(--vp-c-text-1);
}

.hub-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.6fr);
  gap: clamp(14px, 2vw, 22px);
  align-items: center;
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

.hero-copy,
.command-search {
  position: relative;
  z-index: 1;
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
  gap: 9px;
  align-items: center;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 24%, var(--gp-home-card-border));
  border-radius: 18px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 86%, transparent);
  box-shadow: 0 15px 35px rgb(35 48 72 / 0.12);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.command-search.focused {
  border-color: var(--gp-cyan);
  box-shadow: 0 18px 44px color-mix(in srgb, var(--gp-blue) 20%, transparent);
  transform: translateY(-2px);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--gp-icon-highlight);
}

.command-search input {
  width: 100%;
  min-width: 0;
  padding: 10px 0;
  color: var(--vp-c-text-1);
  font: inherit;
  background: transparent;
  border: 0;
  outline: 0;
}

.command-search input::placeholder {
  color: var(--vp-c-text-3);
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
  gap: 3px;
  margin: 14px 0 18px;
  padding: 4px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 72%, transparent);
  box-shadow: 0 8px 24px rgb(42 67 89 / 0.06);
}

.system-filter-item {
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
  border: 0;
  border-radius: 11px;
  background: transparent;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, transform 160ms ease;
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

.system-filter-item.active {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--gp-blue) 13%, var(--gp-surface-bg-elv));
  box-shadow: 0 3px 10px color-mix(in srgb, var(--gp-blue) 12%, transparent);
}

.system-filter-item:focus-visible,
.category-rail button:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.count-badge {
  display: inline-flex;
  min-width: 20px;
  height: 18px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  color: var(--vp-c-text-3);
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 22%, var(--gp-home-card-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--gp-blue) 7%, var(--gp-surface-bg-elv));
}

.system-filter-item:hover .count-badge,
.system-filter-item.active .count-badge,
.category-rail button:hover .count-badge,
.category-rail button.active .count-badge {
  color: var(--gp-icon-highlight);
  border-color: color-mix(in srgb, var(--gp-blue) 38%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 14%, var(--gp-surface-bg-elv));
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

.category-rail {
  position: sticky;
  top: 88px;
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
  font-weight: 700;
}

.category-rail button.active::before {
  width: 7px;
  height: 7px;
  background: var(--gp-blue);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--gp-blue) 12%, transparent),
    0 0 10px color-mix(in srgb, var(--gp-purple) 30%, transparent);
}

.category-rail .count-badge {
  flex: none;
  min-width: 19px;
  height: 17px;
  padding: 0 5px;
  border: 0;
  background: color-mix(in srgb, var(--gp-blue) 7%, transparent);
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
.card-footer,
.platform-stack,
.tags {
  display: flex;
  align-items: center;
}

.card-topline,
.card-footer {
  justify-content: space-between;
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
  margin-bottom: 5px;
  color: color-mix(in srgb, var(--item-accent) 72%, var(--vp-c-text-1));
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
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
  gap: 8px;
  margin-top: 12px;
}

.platform-stack span {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  margin-left: -5px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 50%;
  background: var(--gp-surface-bg-elv);
}

.platform-stack span:first-child {
  margin-left: 0;
}

.tags {
  gap: 5px;
  min-width: 0;
  overflow: hidden;
}

.tags small {
  padding: 3px 6px;
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 9px;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 5px;
  background: var(--gp-surface-bg-soft);
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

@media (max-width: 1200px) {
  .card-field {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 920px) {
  .hub-hero {
    grid-template-columns: 1fr;
  }

  .system-filter {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .card-field {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .navigation-hub {
    padding-bottom: 48px;
  }

  .hub-hero {
    gap: 12px;
    padding: 14px;
    border-radius: 24px;
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
    margin-right: -4px;
    margin-left: -4px;
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
    background: color-mix(in srgb, var(--gp-blue) 13%, var(--gp-surface-bg-elv));
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
  .nav-card,
  .card-aura,
  .open-icon {
    transition: none;
  }
}
</style>
