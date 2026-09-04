<template>
  <main class="navigation-hub" :class="{ 'mobile-filters-open': mobileFiltersOpen }">
    <section class="navigation-panel">
      <div class="hero-visual" aria-hidden="true">
        <span class="hero-aurora hero-aurora-cyan" />
        <span class="hero-aurora hero-aurora-blue" />
        <span class="hero-aurora hero-aurora-purple" />
        <svg class="hero-routes" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path
            class="hero-route hero-route-one"
            d="M-80 126 C 160 34, 330 142, 560 82 S 820 28, 936 80 S 1100 132, 1280 92"
          />
          <path
            class="hero-route-highlight hero-route-highlight-one"
            d="M-80 126 C 160 34, 330 142, 560 82 S 820 28, 936 80 S 1100 132, 1280 92"
          />
          <path
            class="hero-route hero-route-two"
            d="M-50 42 C 180 118, 380 6, 650 62 S 820 132, 936 80 S 1100 24, 1260 70"
          />
          <path
            class="hero-route-highlight hero-route-highlight-two"
            d="M-50 42 C 180 118, 380 6, 650 62 S 820 132, 936 80 S 1100 24, 1260 70"
          />
        </svg>
        <span class="hero-orbit">
          <span class="hero-orbit-ring hero-orbit-ring-one" />
          <span class="hero-orbit-ring hero-orbit-ring-two" />
          <span class="hero-orbit-core" />
        </span>
      </div>
      <header class="hub-hero">
        <div class="hero-copy">
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

      <button
        type="button"
        class="mobile-filter-toggle"
        :aria-expanded="mobileFiltersOpen"
        aria-controls="mobile-platform-filters mobile-detail-filters"
        @click="mobileFiltersOpen = !mobileFiltersOpen"
      >
        <span class="mobile-filter-toggle-label">
          <Icon icon="lucide:list-filter" aria-hidden="true" />
          <span>{{ copy.mobileFilters }}</span>
        </span>
        <small v-if="activeFilterCount" class="mobile-filter-count">
          {{ activeFilterCountLabel }}
        </small>
        <Icon
          icon="lucide:chevron-down"
          class="mobile-filter-chevron"
          aria-hidden="true"
        />
      </button>

      <section id="mobile-platform-filters" class="system-filter" :aria-label="copy.platformLabel">
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
    </section>

    <div class="navigation-content">
      <aside id="mobile-detail-filters" class="category-rail" :aria-label="copy.categoryLabel">
        <div class="filter-group">
          <div class="category-rail-title">{{ copy.categoryTitle }}</div>
          <div class="category-rail-list">
            <button
              type="button"
              :class="{ active: activeCategory === 'all' }"
              :aria-pressed="activeCategory === 'all'"
              :title="copy.allCategories"
              @click="activeCategory = 'all'"
            >
              <span class="filter-label">{{ copy.allCategories }}</span>
              <small class="count-badge">{{ categoryCount("all") }}</small>
            </button>
            <button
              v-for="category in availableCategories"
              :key="category"
              type="button"
              :class="{ active: activeCategory === category }"
              :aria-pressed="activeCategory === category"
              :title="localize(categoryLabels[category])"
              @click="activeCategory = category"
            >
              <span class="filter-label">{{ localize(categoryLabels[category]) }}</span>
              <small class="count-badge">{{ categoryCount(category) }}</small>
            </button>
          </div>
        </div>

        <div class="filter-group feature-filter-group">
          <div class="category-rail-title">{{ copy.featureTitle }}</div>
          <div class="category-rail-list feature-filter-list">
            <button
              v-for="feature in featureFilters"
              :key="feature.id"
              type="button"
              :class="{ active: isFeatureActive(feature.id) }"
              :aria-pressed="isFeatureActive(feature.id)"
              :title="localize(feature.label)"
              @click="toggleFeature(feature.id)"
            >
              <span class="filter-label">{{ localize(feature.label) }}</span>
              <small class="count-badge">{{ featureCount(feature.id) }}</small>
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
              v-for="feature in activeFeatureFilters"
              :key="feature.id"
              type="button"
              :aria-label="`${copy.removeFilter} ${localize(feature.label)}`"
              @click="removeFeature(feature.id)"
            >
              <Icon :icon="feature.icon" aria-hidden="true" />
              <span>{{ localize(feature.label) }}</span>
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
  featureFilters,
  navigationItems,
  platformFilters,
  type LocalizedText,
  type NavigationCategory,
  type NavigationFeature,
  type NavigationItem,
  type NavigationPlatform,
} from "./navigation.data"

const { lang } = useData()
const locale = computed<"zh" | "en">(() => lang.value.startsWith("en") ? "en" : "zh")

const content = {
  zh: {
    title: "一切从这里开始",
    intro: "这里收录了我日常最常使用的应用与网站。",
    searchPlaceholder: "搜索应用、网站或分类…",
    searchLabel: "搜索导航项目",
    platformLabel: "按平台筛选",
    categoryLabel: "按分类与特性筛选",
    categoryTitle: "分类",
    featureTitle: "特性",
    mobileFilters: "筛选",
    selectedFilters: "已选",
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
    title: "Everything you need, just a click away",
    intro: "A collection of the apps and websites I use most often every day.",
    searchPlaceholder: "Search apps, websites, or categories…",
    searchLabel: "Search navigation items",
    platformLabel: "Filter by platform",
    categoryLabel: "Filter by category and features",
    categoryTitle: "Category",
    featureTitle: "Features",
    mobileFilters: "Filters",
    selectedFilters: "Selected",
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
const activeFeatures = ref<NavigationFeature[]>([])
const query = ref("")
const searchInput = ref<HTMLInputElement>()
const isSearchFocused = ref(false)
const mobileFiltersOpen = ref(false)
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

function itemHasFeature(item: NavigationItem, feature: NavigationFeature) {
  if (feature === "openSource") return Boolean(item.openSource)
  if (feature === "crossPlatform") return item.platforms.length >= 3
  return Boolean(item.localFirst)
}

function matchesFeatures(item: NavigationItem, features = activeFeatures.value) {
  return features.every(feature => itemHasFeature(item, feature))
}

function isFeatureActive(feature: NavigationFeature) {
  return activeFeatures.value.includes(feature)
}

function toggleFeature(feature: NavigationFeature) {
  activeFeatures.value = isFeatureActive(feature)
    ? activeFeatures.value.filter(item => item !== feature)
    : [...activeFeatures.value, feature]
}

function removeFeature(feature: NavigationFeature) {
  activeFeatures.value = activeFeatures.value.filter(item => item !== feature)
}

function categoryCount(category: NavigationCategory | "all") {
  const source = itemsForActivePlatform().filter(item => matchesFeatures(item))
  return category === "all" ? source.length : source.filter(item => item.category === category).length
}

function featureCount(feature: NavigationFeature) {
  const otherFeatures = activeFeatures.value.filter(item => item !== feature)

  return itemsForActivePlatform().filter((item) => {
    const matchesCategory = activeCategory.value === "all" || item.category === activeCategory.value
    return matchesCategory && matchesFeatures(item, otherFeatures) && itemHasFeature(item, feature)
  }).length
}

const activeFeatureFilters = computed(() => {
  return featureFilters.filter(feature => isFeatureActive(feature.id))
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
    const matchingFeatureLabels = featureFilters
      .filter(feature => itemHasFeature(item, feature.id))
      .map(feature => localize(feature.label))
    const searchable = [
      item.name,
      localize(item.description),
      localize(categoryLabels[item.category]),
      ...matchingFeatureLabels,
      ...item.tags,
    ].join(" ").toLocaleLowerCase(locale.value)

    return matchesPlatform && matchesCategory && matchesFeatures(item) && (!term || searchable.includes(term))
  })
})

const hasActiveFilters = computed(() => {
  return activePlatform.value !== "all"
    || activeCategory.value !== "all"
    || activeFeatures.value.length > 0
    || Boolean(query.value.trim())
})

const activeFilterCount = computed(() => {
  return Number(activePlatform.value !== "all")
    + Number(activeCategory.value !== "all")
    + activeFeatures.value.length
    + Number(Boolean(query.value.trim()))
})

const activeFilterCountLabel = computed(() => {
  if (locale.value === "zh") return `${copy.value.selectedFilters} ${activeFilterCount.value} 项`
  return `${activeFilterCount.value} ${copy.value.selectedFilters.toLocaleLowerCase(locale.value)}`
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
  activeFeatures.value = []
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
  --hero-visual-height: 132px;
  --nav-panel-gradient: linear-gradient(
    90deg,
    color-mix(in srgb, var(--gp-surface-bg-elv) 94%, transparent),
    color-mix(in srgb, var(--gp-home-card-bg) 88%, transparent) 52%,
    color-mix(in srgb, var(--gp-purple) 7%, var(--gp-home-card-bg))
  );
  box-sizing: border-box;
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 clamp(12px, 1.8vw, 24px) 48px;
  color: var(--vp-c-text-1);
}

.navigation-panel {
  position: relative;
  margin-bottom: 18px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: calc(var(--hub-radius) + 8px);
  background: var(--nav-panel-gradient);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--gp-blue) 9%, transparent);
}

.hub-hero {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 132px;
  box-sizing: border-box;
  align-items: center;
  padding: 24px clamp(20px, 3vw, 38px);
  overflow: hidden;
  border: 0;
  border-radius: calc(var(--hub-radius) + 8px) calc(var(--hub-radius) + 8px) 0 0;
  background: transparent;
  box-shadow: none;
}

.hero-visual {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.hero-visual::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--gp-home-card-bg) 55%, transparent), transparent 64%);
  content: "";
}

.hero-aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(38px);
  opacity: 0.18;
  will-change: transform;
}

.hero-aurora-cyan {
  top: -94px;
  left: -4%;
  width: 48%;
  height: 230px;
  background: radial-gradient(ellipse, var(--gp-cyan), transparent 68%);
  animation: hero-aurora-cyan-drift 18s ease-in-out infinite alternate;
}

.hero-aurora-blue {
  top: -132px;
  left: 31%;
  width: 54%;
  height: 280px;
  background: radial-gradient(ellipse, var(--gp-blue), transparent 68%);
  opacity: 0.16;
  animation: hero-aurora-blue-drift 22s ease-in-out infinite alternate;
}

.hero-aurora-purple {
  right: -7%;
  bottom: -132px;
  width: 48%;
  height: 270px;
  background: radial-gradient(ellipse, var(--gp-purple), transparent 68%);
  opacity: 0.15;
  -webkit-mask-image: linear-gradient(to bottom, #000 0 58%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0 58%, transparent 100%);
  animation: hero-aurora-purple-drift 20s ease-in-out infinite alternate;
}

.hero-routes {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: var(--hero-visual-height);
  overflow: visible;
  opacity: 0.86;
}

.hero-route,
.hero-route-highlight {
  fill: none;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.hero-route {
  stroke-width: 0.8;
}

.hero-route-one {
  stroke: color-mix(in srgb, var(--gp-cyan) 54%, transparent);
}

.hero-route-two {
  stroke: color-mix(in srgb, var(--gp-purple) 50%, transparent);
}

.hero-route-highlight {
  stroke-width: 1.9;
  stroke-dasharray: 120 1250;
  filter: drop-shadow(0 0 6px currentColor);
}

.hero-route-highlight-one {
  color: var(--gp-cyan);
  stroke: color-mix(in srgb, var(--gp-cyan) 94%, white);
  animation: hero-route-flow 7s linear infinite;
}

.hero-route-highlight-two {
  color: var(--gp-purple);
  stroke: color-mix(in srgb, var(--gp-purple) 88%, white);
  animation: hero-route-flow 9s linear -4s infinite reverse;
}

.hero-orbit {
  position: absolute;
  z-index: 2;
  top: calc(var(--hero-visual-height) / 2);
  left: 78%;
  display: block;
  width: clamp(154px, 18vw, 220px);
  aspect-ratio: 1;
  opacity: 0.58;
  transform: translate(-50%, -50%);
}

.hero-orbit::before {
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--gp-cyan) 30%, transparent),
    color-mix(in srgb, var(--gp-blue) 16%, transparent) 42%,
    transparent 72%
  );
  filter: blur(10px);
  content: "";
}

.hero-orbit-ring {
  position: absolute;
  display: block;
  border-radius: 50%;
  background: conic-gradient(
    from 12deg,
    transparent 0deg 28deg,
    color-mix(in srgb, var(--gp-cyan) 76%, transparent) 46deg,
    color-mix(in srgb, #eaffff 72%, transparent) 58deg,
    color-mix(in srgb, var(--gp-blue) 56%, transparent) 75deg,
    transparent 94deg 202deg,
    color-mix(in srgb, var(--gp-purple) 52%, transparent) 222deg,
    color-mix(in srgb, var(--gp-blue) 42%, transparent) 246deg,
    transparent 269deg 360deg
  );
  will-change: transform;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
}

.hero-orbit-ring-one {
  top: 29%;
  left: 0;
  width: 100%;
  height: 42%;
  animation: hero-orbit-spin-one 14s linear infinite;
}

.hero-orbit-ring-two {
  top: 19%;
  left: 16%;
  width: 68%;
  height: 62%;
  animation: hero-orbit-spin-two 10s linear infinite reverse;
}

.hero-orbit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--gp-cyan) 44%, transparent);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #f4feff 0 5%,
    color-mix(in srgb, var(--gp-cyan) 88%, white) 11%,
    color-mix(in srgb, var(--gp-blue) 54%, transparent) 34%,
    transparent 70%
  );
  box-shadow:
    0 0 12px color-mix(in srgb, var(--gp-cyan) 42%, transparent),
    0 0 32px color-mix(in srgb, var(--gp-blue) 24%, transparent);
  transform: translate(-50%, -50%);
  animation: hero-orbit-core-pulse 4.8s ease-in-out infinite;
}

.hero-orbit-core::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #f7ffff;
  box-shadow: 0 0 8px var(--gp-cyan);
  content: "";
  transform: translate(-50%, -50%);
}

.hero-copy {
  position: relative;
  z-index: 2;
}

@keyframes hero-orbit-spin-one {
  from {
    transform: rotate(-18deg);
  }

  to {
    transform: rotate(342deg);
  }
}

@keyframes hero-orbit-spin-two {
  from {
    transform: rotate(38deg);
  }

  to {
    transform: rotate(398deg);
  }
}

@keyframes hero-orbit-core-pulse {
  50% {
    opacity: 0.78;
    transform: translate(-50%, -50%) scale(1.12);
  }
}

@keyframes hero-aurora-cyan-drift {
  to {
    transform: translate3d(24%, 18px, 0) scale(1.12);
  }
}

@keyframes hero-aurora-blue-drift {
  to {
    transform: translate3d(-13%, 24px, 0) scale(0.92);
  }
}

@keyframes hero-aurora-purple-drift {
  to {
    transform: translate3d(-18%, -18px, 0) scale(1.1);
  }
}

@keyframes hero-route-flow {
  to {
    stroke-dashoffset: -1370;
  }
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
  margin: 0;
  padding: 8px 12px 12px;
  border: 0;
  border-radius: 0 0 calc(var(--hub-radius) + 8px) calc(var(--hub-radius) + 8px);
  background: transparent;
  box-shadow: none;
}

.mobile-filter-toggle {
  display: none;
}

@keyframes mobile-filter-panel-enter {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
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

@property --gear-home-border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.command-search {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  width: 100%;
  height: 40px;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 12px;
  border: 2px solid color-mix(in srgb, var(--gp-blue) 24%, var(--gp-home-card-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--gp-surface-bg-soft) 88%, transparent);
  box-shadow: 0 5px 14px rgb(35 48 72 / 0.08);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.command-search.focused,
.command-search:focus-within {
  border-color: var(--gp-cyan);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 28%, transparent),
    0 0 16px color-mix(in srgb, var(--gp-blue) 14%, transparent),
    0 8px 22px rgb(32 52 75 / 0.22);
  transform: translateY(-1px);
}

.command-search.focused::before,
.command-search:focus-within::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  padding: 2px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--gear-home-border-angle),
    transparent 0deg 36deg,
    color-mix(in srgb, var(--gp-cyan) 48%, transparent) 47deg,
    var(--gp-cyan) 57deg,
    #eaffff 65deg,
    var(--gp-blue) 75deg,
    var(--gp-purple) 93deg,
    color-mix(in srgb, var(--gp-purple) 22%, transparent) 113deg,
    transparent 130deg 360deg
  );
  content: "";
  animation: gear-home-button-border-flow 4.2s linear infinite;
  pointer-events: none;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
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
  border: 2px solid color-mix(in srgb, var(--gp-blue) 14%, var(--gp-home-card-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 22%, transparent);
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
  border-color: color-mix(in srgb, var(--gp-cyan) 34%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 10%, transparent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--gp-blue) 8%, transparent);
  transform: translateY(-1px);
}

.system-filter-item:hover .system-filter-icon,
.system-filter-item.active .system-filter-icon {
  color: var(--gp-icon-highlight);
}

.system-filter-item.active {
  color: var(--vp-c-text-1);
  font-weight: 750;
  border-color: var(--gp-active-border);
  background: var(--gp-gradient-active);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 28%, transparent),
    0 0 16px color-mix(in srgb, var(--gp-blue) 14%, transparent),
    0 8px 22px rgb(32 52 75 / 0.22);
}

.system-filter-item.active::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  padding: 2px;
  pointer-events: none;
  background: conic-gradient(
    from var(--gear-home-border-angle),
    transparent 0deg 36deg,
    color-mix(in srgb, var(--gp-cyan) 48%, transparent) 47deg,
    var(--gp-cyan) 57deg,
    #eaffff 65deg,
    var(--gp-blue) 75deg,
    var(--gp-purple) 93deg,
    color-mix(in srgb, var(--gp-purple) 22%, transparent) 113deg,
    transparent 130deg 360deg
  );
  border-radius: inherit;
  opacity: 1;
  content: "";
  animation: gear-home-button-border-flow 4.2s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@keyframes gear-home-button-border-flow {
  from {
    --gear-home-border-angle: 0deg;
  }

  to {
    --gear-home-border-angle: 360deg;
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
  grid-template-columns: 148px minmax(0, 1fr);
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
  border: 1px solid rgb(104 158 190 / 0.24);
  border-radius: 14px;
  background: linear-gradient(
    105deg,
    rgb(226 241 246 / 0.72),
    rgb(229 237 248 / 0.76) 52%,
    rgb(237 231 248 / 0.70)
  );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.38),
    0 6px 16px rgb(42 67 89 / 0.08);
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

.category-rail button > .filter-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

:global(html[data-theme="dark"] .navigation-hub) {
  --nav-panel-gradient: linear-gradient(
    90deg,
    color-mix(in srgb, var(--gp-surface-bg-elv) 96%, transparent),
    color-mix(in srgb, var(--gp-home-card-bg) 90%, transparent) 52%,
    color-mix(in srgb, var(--gp-purple) 10%, var(--gp-home-card-bg))
  );
}

:global(html[data-theme="dark"] .navigation-panel) {
  border-color: color-mix(in srgb, var(--gp-blue) 20%, var(--gp-home-card-border));
  background: var(--nav-panel-gradient);
}

:global(html[data-theme="dark"] .hero-aurora-cyan) {
  opacity: 0.3;
}

:global(html[data-theme="dark"] .hero-aurora-blue) {
  opacity: 0.26;
}

:global(html[data-theme="dark"] .hero-aurora-purple) {
  opacity: 0.25;
}

:global(html[data-theme="dark"] .hero-routes) {
  opacity: 0.84;
}

:global(html[data-theme="dark"] .hero-orbit) {
  opacity: 0.84;
}

:global(html[data-theme="dark"] .hero-orbit-core) {
  border-color: color-mix(in srgb, var(--gp-cyan) 62%, transparent);
  box-shadow:
    0 0 14px color-mix(in srgb, var(--gp-cyan) 58%, transparent),
    0 0 38px color-mix(in srgb, var(--gp-blue) 38%, transparent),
    0 0 58px color-mix(in srgb, var(--gp-purple) 18%, transparent);
}

:global(html[data-theme="dark"] .hero-visual::after) {
  background: linear-gradient(90deg, color-mix(in srgb, var(--gp-home-card-bg) 42%, transparent), transparent 64%);
}

:global(html[data-theme="dark"] .navigation-panel) {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 6%, transparent),
    0 10px 28px rgb(2 8 20 / 0.30);
}

:global(html[data-theme="dark"] .active-filter-bar) {
  border-color: rgb(139 190 218 / 0.22);
  background: linear-gradient(
    105deg,
    rgb(27 45 58 / 0.84),
    rgb(28 40 63 / 0.86) 52%,
    rgb(39 31 66 / 0.82)
  );
  box-shadow:
    inset 0 1px 0 rgb(205 232 255 / 0.05),
    0 8px 22px rgb(2 8 20 / 0.28);
}

:global(html[data-theme="dark"] .system-filter) {
  background: transparent;
  box-shadow: none;
}

:global(html[data-theme="dark"] .system-filter-item.active) {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 34%, transparent),
    0 0 16px color-mix(in srgb, #eaffff 12%, transparent),
    0 0 24px var(--gp-active-glow),
    0 8px 20px rgb(2 8 20 / 0.34);
}

:global(html[data-theme="dark"] .category-rail button.active) {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 82%, transparent),
    0 0 16px color-mix(in srgb, var(--gp-cyan) 16%, transparent),
    0 7px 18px rgb(2 8 20 / 0.26);
}

:global(html[data-theme="dark"] .nav-card) {
  border-color: color-mix(in srgb, var(--gp-blue) 16%, var(--gp-home-card-border));
}

:global(html[data-theme="dark"] .system-filter-item:not(.active)),
:global(html[data-theme="dark"] .category-rail button:not(.active)) {
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
    --hero-visual-height: 118px;
    padding-bottom: 48px;
  }

  .hub-hero {
    min-height: 118px;
    margin-bottom: 0;
    padding: 16px 14px;
    border-radius: 24px 24px 0 0;
  }

  .hero-aurora {
    filter: blur(24px);
  }

  .hero-aurora-cyan {
    top: -72px;
    width: 68%;
    height: 190px;
  }

  .hero-aurora-blue {
    top: -96px;
    left: 24%;
    width: 72%;
    height: 220px;
  }

  .hero-aurora-purple {
    right: -20%;
    bottom: -98px;
    width: 66%;
    height: 210px;
  }

  .hero-orbit {
    left: 82%;
    width: 138px;
    opacity: 0.42;
  }

  :global(html[data-theme="dark"] .hero-orbit) {
    opacity: 0.58;
  }

  .hero-orbit-ring-one {
    display: none;
  }

  .hero-orbit-ring-two,
  .hero-orbit-core {
    animation: none;
  }

  .hero-orbit-core {
    width: 34px;
    height: 34px;
  }

  .hero-route-highlight {
    animation: none;
  }

  .navigation-panel {
    margin-bottom: 12px;
    border-radius: 24px;
  }

  .filter-dock {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0;
    padding: 8px 10px 10px;
    border: 0;
    border-radius: 0 0 24px 24px;
    background: transparent;
  }

  .command-search {
    position: sticky;
    z-index: 20;
    top: var(--filter-dock-top);
    margin-bottom: 0;
    border-color: color-mix(in srgb, var(--gp-active-border) 56%, var(--gp-home-card-border));
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 94%, transparent);
    box-shadow:
      0 7px 20px rgb(42 67 89 / 0.14),
      0 0 0 1px color-mix(in srgb, var(--gp-cyan) 6%, transparent);
    backdrop-filter: blur(18px) saturate(1.12);
    -webkit-backdrop-filter: blur(18px) saturate(1.12);
  }

  .mobile-filter-toggle {
    display: flex;
    min-height: 42px;
    box-sizing: border-box;
    gap: 8px;
    align-items: center;
    margin-bottom: 0;
    padding: 7px 11px;
    color: var(--vp-c-text-1);
    font: inherit;
    font-size: 12px;
    font-weight: 750;
    border: 1px solid color-mix(in srgb, var(--gp-blue) 30%, var(--gp-home-card-border));
    border-radius: 12px;
    background: linear-gradient(
      105deg,
      color-mix(in srgb, var(--gp-cyan) 7%, var(--gp-surface-bg-elv)),
      color-mix(in srgb, var(--gp-purple) 6%, var(--gp-surface-bg-elv))
    );
    box-shadow: 0 5px 14px rgb(42 67 89 / 0.09);
    cursor: pointer;
  }

  .mobile-filter-toggle:focus-visible {
    outline: 2px solid var(--gp-cyan);
    outline-offset: 2px;
  }

  .mobile-filter-toggle-label {
    display: inline-flex;
    gap: 7px;
    align-items: center;
  }

  .mobile-filter-toggle-label > svg {
    width: 16px;
    height: 16px;
    color: var(--gp-icon-highlight);
  }

  .mobile-filter-count {
    padding: 3px 7px;
    color: var(--vp-c-text-1);
    font-size: 10px;
    font-weight: 750;
    line-height: 1.2;
    border: 1px solid color-mix(in srgb, var(--gp-cyan) 44%, var(--gp-home-card-border));
    border-radius: 999px;
    background: var(--gp-gradient-active);
  }

  .mobile-filter-chevron {
    width: 17px;
    height: 17px;
    margin-left: auto;
    color: var(--vp-c-text-2);
    transition: transform 180ms ease;
  }

  .mobile-filters-open .mobile-filter-chevron {
    transform: rotate(180deg);
  }

  h1 {
    font-size: clamp(28px, 9vw, 36px);
  }

  .intro {
    font-size: 12px;
    line-height: 1.45;
  }

  .system-filter,
  .category-rail {
    display: none;
  }

  .mobile-filters-open .system-filter {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 5px;
    margin: 0 0 8px;
    padding: 7px;
    overflow: visible;
    border: 1px solid color-mix(in srgb, var(--gp-blue) 22%, var(--gp-home-card-border));
    border-radius: 14px;
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 76%, transparent);
    animation: mobile-filter-panel-enter 220ms ease-out;
  }

  .system-filter-item {
    width: 100%;
    min-width: 0;
    min-height: 40px;
    flex: none;
  }

  .navigation-content {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .mobile-filters-open .category-rail {
    position: static;
    display: grid;
    width: auto;
    gap: 10px;
    margin-bottom: 8px;
    padding: 8px;
    border: 1px solid color-mix(in srgb, var(--gp-blue) 22%, var(--gp-home-card-border));
    border-radius: 14px;
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 76%, transparent);
    animation: mobile-filter-panel-enter 220ms ease-out;
  }

  .category-rail-title {
    margin-bottom: 5px;
  }

  .feature-filter-group {
    margin-top: 0;
  }

  .category-rail-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 5px;
    margin: 0;
    padding: 0;
    overflow: visible;
  }

  .feature-filter-list {
    grid-template-columns: 1fr;
  }

  .category-rail-list::before,
  .category-rail button::before {
    display: none;
  }

  .category-rail button {
    width: 100%;
    min-height: 38px;
    flex: none;
    gap: 7px;
    padding: 6px 10px;
    white-space: nowrap;
    border: 1px solid color-mix(in srgb, var(--gp-blue) 18%, var(--gp-home-card-border));
    border-radius: 10px;
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 76%, transparent);
    transform: none;
  }

  .category-rail button:hover {
    transform: translateY(-1px);
  }

  .category-rail button.active {
    background: var(--gp-gradient-active);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 74%, transparent),
      0 5px 14px color-mix(in srgb, var(--gp-active-glow) 58%, transparent);
    transform: none;
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
  .mobile-filter-chevron,
  .system-filter-item,
  .system-filter-icon,
  .category-rail button,
  .category-rail button::before,
  .active-filter-bar,
  .active-filter-chips button,
  .nav-card,
  .card-aura,
  .open-icon {
    transition: none;
  }

  .hero-aurora,
  .hero-route-highlight,
  .hero-orbit-ring,
  .hero-orbit-core,
  .command-search.focused::before,
  .mobile-filters-open .system-filter,
  .mobile-filters-open .category-rail,
  .system-filter-item.active::before,
  .active-filter-bar {
    animation: none;
  }

  .hero-aurora,
  .hero-orbit-ring {
    will-change: auto;
  }
}
</style>
