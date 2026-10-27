<template>
  <main ref="navigationHub" class="navigation-hub" :class="{ 'mobile-filters-open': mobileFiltersOpen, 'is-favorites-view': isFavoritesView }">
    <h1 class="navigation-title">{{ copy.title }}</h1>
    <section class="navigation-panel">
      <div
        ref="filterDockSlot"
        class="filter-dock-slot"
        :style="filterDockSlotStyle"
      >
        <div
          ref="filterDock"
          class="filter-dock"
          :class="{ 'is-fixed': isFilterDockFixed }"
          :style="filterDockStyle"
        >
      <label class="command-search" :class="{ focused: isSearchFocused }">
        <Icon icon="lucide:search" class="search-icon" />
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          :placeholder="isFavoritesView ? copy.favoritesSearchPlaceholder : copy.searchPlaceholder"
          :aria-label="copy.searchLabel"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        >
        <kbd class="search-shortcut" aria-hidden="true">Alt /</kbd>
        <button v-if="query" type="button" :aria-label="copy.clear" @click="clearSearch">
          <Icon icon="lucide:x" />
        </button>
      </label>

      <button
        type="button"
        class="mobile-filter-toggle"
        :aria-expanded="mobileFiltersOpen"
        :aria-controls="isFavoritesView ? 'mobile-platform-filters' : 'mobile-platform-filters mobile-detail-filters'"
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
          v-for="filter in scopeFilterOptions"
          :key="filter.id"
          type="button"
          class="system-filter-item"
          :class="{ active: activeScope === filter.id }"
          :aria-label="filterCountLabel(localize(filter.label), filter.count)"
          :aria-pressed="activeScope === filter.id"
          :disabled="filter.id !== 'favorites' && filter.count === 0 && activeScope !== filter.id"
          @click="selectScope(filter.id)"
        >
          <Icon :icon="filter.icon" class="system-filter-icon" aria-hidden="true" />
          <span>{{ localize(filter.label) }}</span>
          <small class="count-badge">{{ filter.count }}</small>
        </button>
        </section>
        </div>
      </div>
    </section>

    <div class="navigation-content">
      <aside v-if="!isFavoritesView" id="mobile-detail-filters" class="category-rail" :aria-label="copy.categoryLabel">
        <div class="filter-group">
          <div class="category-rail-title">{{ copy.categoryTitle }}</div>
          <div class="category-rail-list">
            <button
              type="button"
              :class="{ active: activeCategory === 'all' }"
              :aria-label="filterCountLabel(copy.allCategories, allCategoryCount)"
              :aria-pressed="activeCategory === 'all'"
              :disabled="allCategoryCount === 0 && activeCategory !== 'all'"
              :title="copy.allCategories"
              @click="activeCategory = 'all'"
            >
              <span class="filter-label">{{ copy.allCategories }}</span>
              <small class="count-badge">{{ allCategoryCount }}</small>
            </button>
            <button
              v-for="category in categoryFilterOptions"
              :key="category.id"
              type="button"
              :class="{ active: activeCategory === category.id }"
              :aria-label="filterCountLabel(localize(category.label), category.count)"
              :aria-pressed="activeCategory === category.id"
              :disabled="category.count === 0 && activeCategory !== category.id"
              :title="localize(category.label)"
              @click="activeCategory = category.id"
            >
              <span class="filter-label">{{ localize(category.label) }}</span>
              <small class="count-badge">{{ category.count }}</small>
            </button>
          </div>
        </div>

        <div class="filter-group feature-filter-group">
          <div class="category-rail-title">{{ copy.featureTitle }}</div>
          <div class="category-rail-list feature-filter-list">
            <button
              v-for="feature in featureFilterOptions"
              :key="feature.id"
              type="button"
              :class="{ active: isFeatureActive(feature.id) }"
              :aria-label="filterCountLabel(localize(feature.label), feature.count)"
              :aria-pressed="isFeatureActive(feature.id)"
              :disabled="feature.count === 0 && !isFeatureActive(feature.id)"
              :title="localize(feature.label)"
              @click="toggleFeature(feature.id)"
            >
              <span class="filter-label">{{ localize(feature.label) }}</span>
              <small class="count-badge">{{ feature.count }}</small>
            </button>
          </div>
        </div>
      </aside>

      <div class="card-area">
        <div v-if="!isFavoritesView" class="card-toolbar">
          <div class="view-switch" role="group" :aria-label="copy.viewLabel">
            <button
              type="button"
              :class="{ active: activeView === 'grid' }"
              :aria-label="copy.gridView"
              :aria-pressed="activeView === 'grid'"
              :title="copy.gridView"
              @click="setActiveView('grid')"
            >
              <Icon icon="lucide:grid-2x2" aria-hidden="true" />
            </button>
            <button
              type="button"
              :class="{ active: activeView === 'list' }"
              :aria-label="copy.listView"
              :aria-pressed="activeView === 'list'"
              :title="copy.listView"
              @click="setActiveView('list')"
            >
              <Icon icon="lucide:rows-3" aria-hidden="true" />
            </button>
          </div>

          <div class="sort-control">
            <Icon icon="lucide:arrow-up-down" aria-hidden="true" />
            <span>{{ copy.sortLabel }}</span>
            <SelectMenu
              v-model="activeSort"
              class="navigation-sort"
              :options="sortOptions"
              :aria-label="copy.sortLabel"
            />
          </div>
        </div>

        <section v-if="hasActiveFilters" class="active-filter-bar" :aria-label="copy.activeFilters">
          <span class="active-filter-summary">
            <Icon icon="lucide:list-filter" aria-hidden="true" />
            <span>{{ copy.activeFilters }}</span>
            <strong aria-live="polite">{{ resultSummary }}</strong>
          </span>

          <span class="active-filter-chips">
            <button
              v-if="activeScope !== 'all'"
              type="button"
              :aria-label="`${copy.removeFilter} ${activeScopeLabel}`"
              @click="selectScope('all')"
            >
              <Icon :icon="activeScope === 'favorites' ? 'lucide:star' : platformIcon(activeScope)" aria-hidden="true" />
              <span>{{ activeScopeLabel }}</span>
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

        <div v-if="isFavoritesView" class="favorites-toolbar">
          <p v-if="storageUnavailable || orderStorageUnavailable" class="favorites-note storage-error" role="status">{{ copy.storageError }}</p>
          <p v-else class="favorites-note favorites-storage-note">
            <Icon icon="lucide:info" aria-hidden="true" />
            <span>{{ copy.favoritesNote }} {{ copy.favoritesStorageDetails }}</span>
          </p>
          <button
            v-if="favorites.length === 0"
            type="button"
            class="favorites-action"
            @click="importRecommendedFavorites"
          >
            <Icon icon="lucide:download" aria-hidden="true" />
            {{ copy.importFavorites }}
          </button>
          <button
            type="button"
            class="favorites-action secondary"
            @click="selectScope('all')"
          >
            {{ copy.browseCatalog }}
          </button>
          <button
            v-if="favoritesLoaded && favorites.length > 0"
            ref="favoriteSortButton"
            type="button"
            class="favorites-action secondary"
            :aria-pressed="isReorderingFavorites"
            :aria-describedby="isReorderingFavorites ? 'favorites-reorder-help' : undefined"
            @click="toggleFavoriteReordering"
          >
            <Icon :icon="isReorderingFavorites ? 'lucide:check' : 'lucide:grip-vertical'" aria-hidden="true" />
            {{ isReorderingFavorites ? copy.finishReordering : copy.reorderFavorites }}
          </button>
          <button
            v-if="favoritesLoaded && favorites.length > 0"
            type="button"
            class="favorites-action danger"
            @click="clearAllFavorites"
          >
            <Icon icon="lucide:trash-2" aria-hidden="true" />
            {{ copy.clearFavorites }}
          </button>
        </div>

        <p v-if="isFavoritesView && isReorderingFavorites" id="favorites-reorder-help" class="favorites-reorder-help">{{ copy.reorderHelp }}</p>
        <p class="reorder-announcement" role="status" aria-live="polite" aria-atomic="true">{{ reorderAnnouncement }}</p>
        <div
          v-if="isFavoritesView && filteredItems.length"
          class="favorites-groups"
          :class="{ 'is-reordering': isReorderingFavorites }"
          @dragover="onFavoriteNativeDragOver"
          @drop="onFavoriteNativeDrop"
          @dragend="stopFavoriteDrag"
        >
          <section
            v-for="group in displayedFavoritesGroups"
            :key="group.id"
            class="favorites-group"
            :class="[
              `favorites-group-${group.id}`,
              { 'is-dragging': isFavoriteDrag('group', group.id), 'is-drop-target': isFavoriteDropTarget('group', group.id) },
            ]"
            :data-favorite-group="group.id"
            :aria-labelledby="`favorites-heading-${group.id}`"
          >
            <h2 :id="`favorites-heading-${group.id}`" class="favorites-heading">
              <button
                v-if="isReorderingFavorites"
                type="button"
                class="favorite-drag-handle group-drag-handle"
                :data-reorder-handle="group.id"
                :aria-label="`${copy.reorderGroup}: ${localize(categoryLabels[group.id])}`"
                aria-describedby="favorites-reorder-help"
                draggable="true"
                @dragstart="startFavoriteNativeDrag($event, 'group', group.id)"
                @pointerdown="startFavoriteDrag($event, 'group', group.id)"
                @keydown="onFavoriteReorderKey($event, 'group', group.id)"
              >
                <Icon icon="lucide:grip-vertical" aria-hidden="true" />
              </button>
              <span>{{ localize(categoryLabels[group.id]) }}</span>
              <small>{{ group.items.length }}</small>
            </h2>
            <div class="favorites-links" tabindex="0" :aria-label="`${localize(categoryLabels[group.id])} — ${copy.favorites}`">
              <article
                v-for="item in group.items"
                :key="item.id"
                class="favorite-card"
                :class="{ 'is-dragging': isFavoriteDrag('item', item.id), 'is-drop-target': isFavoriteDropTarget('item', item.id) }"
                :data-favorite-id="item.id"
                :style="{ '--item-accent': item.accent }"
              >
                <button
                  v-if="isReorderingFavorites"
                  type="button"
                  class="favorite-drag-handle card-drag-handle"
                  :data-reorder-handle="item.id"
                  :aria-label="`${copy.reorderCard}: ${item.name}`"
                  aria-describedby="favorites-reorder-help"
                  draggable="true"
                  @dragstart="startFavoriteNativeDrag($event, 'item', item.id, group.id)"
                  @pointerdown="startFavoriteDrag($event, 'item', item.id, group.id)"
                  @keydown="onFavoriteReorderKey($event, 'item', item.id, group.id)"
                >
                  <Icon icon="lucide:grip-vertical" aria-hidden="true" />
                </button>
                <a
                  class="favorites-link"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="card-topline">
                    <span class="card-leading">
                      <span class="app-icon" :class="[`brand-icon-${item.id}`, { 'brand-icon-light-surface': usesLightIconSurface(item), 'brand-icon-monochrome': !item.iconSourceUrl || failedIconIds.has(item.id) }]">
                        <img
                          v-if="item.iconSourceUrl && !failedIconIds.has(item.id)"
                          :src="navigationIconUrl(item)"
                          class="is-static"
                          alt=""
                          width="24"
                          height="24"
                          loading="lazy"
                          decoding="async"
                          no-view
                          @load="measureIconContrast($event, item.id)"
                          @error="markIconAsFailed(item.id)"
                        >
                        <Icon v-else :icon="item.icon" aria-hidden="true" />
                      </span>
                      <span class="favorites-text">
                        <strong class="card-title">{{ item.name }}</strong>
                        <span class="favorites-description">{{ localize(item.description) }}</span>
                      </span>
                    </span>
                  </span>
                </a>
                <button
                  type="button"
                  class="favorite-toggle is-favorite"
                  :aria-label="`${copy.removeFavorite}: ${item.name}`"
                  :aria-pressed="true"
                  @click="toggleFavorite(item.id)"
                >
                  <Icon icon="lucide:star" aria-hidden="true" />
                </button>
              </article>
            </div>
          </section>
        </div>

        <section
          v-else-if="filteredItems.length"
          class="card-field"
          :class="{ 'is-list-view': activeView === 'list' }"
        >
          <article
            v-for="item in displayedItems"
            :key="item.id"
            class="nav-card"
            :class="[
              isRankedOverview && item.featured ? `is-${item.featured}` : undefined,
              cardRankClass(item),
            ]"
            :style="{ '--item-accent': item.accent }"
          >
            <span class="card-aura" aria-hidden="true" />
            <span v-if="cardRank(item) > 0" class="rank-sheen" aria-hidden="true" />
            <a
              class="nav-card-link"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="card-topline">
                <span class="card-leading">
                  <span class="app-icon" :class="[`brand-icon-${item.id}`, { 'brand-icon-light-surface': usesLightIconSurface(item), 'brand-icon-monochrome': !item.iconSourceUrl || failedIconIds.has(item.id) }]">
                    <img
                      v-if="item.iconSourceUrl && !failedIconIds.has(item.id)"
                      :src="navigationIconUrl(item)"
                      class="is-static"
                      alt=""
                      width="24"
                      height="24"
                      loading="lazy"
                      decoding="async"
                      no-view
                      @load="measureIconContrast($event, item.id)"
                      @error="markIconAsFailed(item.id)"
                    >
                    <Icon v-else :icon="item.icon" aria-hidden="true" />
                  </span>
                  <strong class="card-title">{{ item.name }}</strong>
                  <span
                    v-if="cardRank(item) > 0"
                    class="ranking-badge"
                    role="img"
                    :aria-label="rankLabel(cardRank(item))"
                  >
                    {{ rankMark(cardRank(item)) }} <small>#{{ cardRank(item) }}</small>
                  </span>
                </span>
              </span>

              <span class="card-content">
                <span class="card-description">{{ localize(item.description) }}</span>
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
              </span>
            </a>
            <button
              type="button"
              class="favorite-toggle"
              :class="{ 'is-favorite': favoriteItemIds.has(item.id) }"
              :aria-label="`${favoriteItemIds.has(item.id) ? copy.removeFavorite : copy.addFavorite}: ${item.name}`"
              :aria-pressed="favoriteItemIds.has(item.id)"
              @click="toggleFavorite(item.id)"
            >
              <Icon icon="lucide:star" aria-hidden="true" />
            </button>
          </article>
        </section>

        <section v-else class="empty-state">
          <span><Icon :icon="isFavoritesView ? 'lucide:star' : 'lucide:satellite'" aria-hidden="true" /></span>
          <h2>{{ isEmptyFavoritesCollection ? copy.favoritesEmptyTitle : copy.emptyTitle }}</h2>
          <p>{{ isEmptyFavoritesCollection ? copy.favoritesEmptyText : copy.emptyText }}</p>
          <button
            v-if="!isEmptyFavoritesCollection"
            type="button"
            @click="resetFilters"
          >
            {{ copy.reset }}
          </button>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { withBase } from "vuepress/client"
import { useData } from "vuepress-theme-plume/composables"

import SelectMenu from "../SelectMenu.vue"
import { useFavoriteOrdering, type FavoriteGroup } from "./useFavoriteOrdering"
import {
  categoryLabels,
  featureFilters,
  navigationRecommendedFavoriteIds,
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
    title: "导航",
    searchPlaceholder: "搜索应用、网站或分类…",
    searchLabel: "搜索导航项目",
    favorites: "收藏",
    favoritesSearchPlaceholder: "搜索我的收藏…",
    platformLabel: "选择收藏或平台",
    addFavorite: "收藏",
    removeFavorite: "取消收藏",
    importFavorites: "导入推荐 6 项",
    browseCatalog: "浏览全部条目",
    clearFavorites: "清空收藏",
    reorderFavorites: "调整顺序",
    finishReordering: "完成排序",
    reorderGroup: "调整分组顺序",
    reorderCard: "调整组内卡片顺序",
    reorderHelp: "拖动手柄调整顺序；卡片仅在组内移动。键盘聚焦手柄后用方向键移动，Home / End 移到首尾，Esc 退出。顺序自动保存在本浏览器。",
    favoritesEmptyTitle: "把常用的入口收藏在这里",
    favoritesEmptyText: "点击卡片上的星标，即可按分类汇总；网站和应用都可以收藏。",
    favoritesNote: "收藏仅存于本浏览器，不跨设备同步。",
    favoritesStorageDetails: "中英文页面共用收藏；清除站点数据会删除收藏。",
    storageError: "浏览器存储不可用，收藏或排序更改可能仅在当前页面有效。",
    favoritesLoading: "正在读取收藏…",
    favoritesUpdated: "收藏已更新",
    categoryLabel: "按分类与特性筛选",
    categoryTitle: "分类",
    featureTitle: "特性",
    mobileFilters: "筛选",
    selectedFilters: "已选",
    activeFilters: "当前筛选",
    removeFilter: "移除筛选",
    clearAll: "清除全部",
    sortLabel: "排序",
    sortRecommended: "推荐",
    sortNameAsc: "名称 A–Z",
    sortNameDesc: "名称 Z–A",
    viewLabel: "切换导航视图",
    gridView: "卡片视图",
    listView: "列表视图",
    allCategories: "全部",
    clear: "清空搜索",
    emptyTitle: "这条轨道暂时没有坐标",
    emptyText: "换一个关键词，或重置筛选回到默认视图。",
    reset: "重置筛选",
  },
  en: {
    title: "Navigation",
    searchPlaceholder: "Search apps, websites, or categories…",
    searchLabel: "Search navigation items",
    favorites: "Favorites",
    favoritesSearchPlaceholder: "Search my favorites…",
    platformLabel: "Choose favorites or a platform",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    importFavorites: "Import 6 recommendations",
    browseCatalog: "Browse all items",
    clearFavorites: "Clear favorites",
    reorderFavorites: "Reorder",
    finishReordering: "Done reordering",
    reorderGroup: "Reorder group",
    reorderCard: "Reorder card within group",
    reorderHelp: "Drag a handle to reorder; cards stay in their category. Focus a handle and use arrow keys to move, Home / End for first / last, or Esc to finish. Order is saved in this browser.",
    favoritesEmptyTitle: "Keep your everyday destinations here",
    favoritesEmptyText: "Use a card’s star to save apps and websites, automatically grouped by category.",
    favoritesNote: "Saved in this browser only; no device sync.",
    favoritesStorageDetails: "Favorites are shared across languages. Clearing site data deletes them.",
    storageError: "Browser storage is unavailable. Changes to favorites or their order may only last for this page session.",
    favoritesLoading: "Loading favorites…",
    favoritesUpdated: "Favorites updated",
    categoryLabel: "Filter by category and features",
    categoryTitle: "Category",
    featureTitle: "Features",
    mobileFilters: "Filters",
    selectedFilters: "Selected",
    activeFilters: "Active filters",
    removeFilter: "Remove filter",
    clearAll: "Clear all",
    sortLabel: "Sort",
    sortRecommended: "Recommended",
    sortNameAsc: "Name A–Z",
    sortNameDesc: "Name Z–A",
    viewLabel: "Switch navigation view",
    gridView: "Card view",
    listView: "List view",
    allCategories: "All",
    clear: "Clear search",
    emptyTitle: "No destinations on this orbit",
    emptyText: "Try another keyword or reset filters to return to the default view.",
    reset: "Reset filters",
  },
}

const copy = computed(() => content[locale.value])
const sortOptions = computed(() => [
  { value: "recommended", label: copy.value.sortRecommended },
  { value: "nameAsc", label: copy.value.sortNameAsc },
  { value: "nameDesc", label: copy.value.sortNameDesc },
])
type NavigationSort = "recommended" | "nameAsc" | "nameDesc"
type NavigationView = "grid" | "list"
// Favorites is a curated view, not an item platform.
type NavigationScope = NavigationPlatform | "all" | "favorites"

const favoritesStorageKey = "gearpress-navigation-favorites-v1"
const navigationViewStorageKey = "gearpress-navigation-view"
const defaultScope: NavigationScope = "favorites"
const activeScope = ref<NavigationScope>(defaultScope)
const favorites = ref<string[]>([])
const favoritesLoaded = ref(false)
const storageUnavailable = ref(false)
const favoriteItemIds = computed(() => new Set(favorites.value))
const isFavoritesView = computed(() => activeScope.value === "favorites")
const activeCategory = ref<NavigationCategory | "all">("all")
const activeFeatures = ref<NavigationFeature[]>([])
const activeSort = ref<NavigationSort>("recommended")
const activeView = ref<NavigationView>("grid")
const query = ref("")
const navigationHub = ref<HTMLElement>()
const favoriteSortButton = ref<HTMLButtonElement>()
const searchInput = ref<HTMLInputElement>()
const filterDock = ref<HTMLElement>()
const filterDockSlot = ref<HTMLElement>()
const filterDockSlotStyle = ref<Record<string, string>>({})
const filterDockStyle = ref<Record<string, string>>({})
const isFilterDockFixed = ref(false)
const isSearchFocused = ref(false)
const mobileFiltersOpen = ref(false)
const failedIconIds = ref(new Set<string>())
const darkSurfaceIconIds = ref(new Set<string>())
const categoryOrder: NavigationCategory[] = [
  "productivity",
  "development",
  "ai",
  "design",
  "utilities",
  "knowledge",
  "communication",
  "community",
  "media",
  "network",
  "gaming",
]

const {
  groupOrder, itemOrder, orderStorageUnavailable, isReorderingFavorites, reorderAnnouncement,
  toggleFavoriteReordering, finishFavoriteReordering, startFavoriteDrag, onFavoriteReorderKey,
  isFavoriteDrag, isFavoriteDropTarget,
  startFavoriteNativeDrag, onFavoriteNativeDragOver, onFavoriteNativeDrop, stopFavoriteDrag,
} = useFavoriteOrdering({
  root: navigationHub,
  categoryOrder,
  items: navigationItems,
  getGroups: () => displayedFavoritesGroups.value,
  label: (kind, id) => kind === "group"
    ? localize(categoryLabels[id as NavigationCategory])
    : navigationItems.find(item => item.id === id)?.name ?? id,
  announcement: (label, position, total) => locale.value === "zh"
    ? `${label}，已移至第 ${position} 位，共 ${total} 项。`
    : `${label}, moved to position ${position} of ${total}.`,
  onFinish: () => favoriteSortButton.value?.focus(),
})

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

function filterCountLabel(label: string, count: number) {
  if (locale.value === "zh") return `${label}，${count} 项结果`
  return `${label}, ${count} ${count === 1 ? "result" : "results"}`
}

function navigationIconUrl(item: NavigationItem) {
  return withBase(`/navigation-icons/${item.id}.webp`)
}

function usesLightIconSurface(item: NavigationItem) {
  // Full-color SVG collections keep their embedded colors; monochrome icons inherit CSS color.
  const isColoredSvg = /^(devicon|logos|thesvg-color):/.test(item.icon)
  if (!item.iconSourceUrl || failedIconIds.value.has(item.id)) return isColoredSvg
  return !darkSurfaceIconIds.value.has(item.id)
}

function relativeLuminance(channels: readonly number[]) {
  const [red, green, blue] = channels.map(channel => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function measureIconContrast(event: Event, id: string) {
  const image = event.target
  if (!(image instanceof HTMLImageElement)) return

  // Compare the actual local logo pixels, rather than the unrelated card accent.
  // Local, same-origin images make this safe; retain the light surface if sampling fails.
  try {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 32
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return
    context.drawImage(image, 0, 0, 32, 32)
    const { data } = context.getImageData(0, 0, 32, 32)
    const score = (background: readonly number[]) => {
      const backgroundLuminance = relativeLuminance(background)
      let total = 0
      for (let index = 0; index < data.length; index += 4) {
        const alpha = data[index + 3] / 255
        if (alpha < 0.1) continue
        const luminance = relativeLuminance(background.map((channel, offset) =>
          data[index + offset] * alpha + channel * (1 - alpha),
        ))
        const contrast = (Math.max(luminance, backgroundLuminance) + 0.05)
          / (Math.min(luminance, backgroundLuminance) + 0.05)
        total += Math.min(contrast, 4.5) * alpha
      }
      return total
    }
    const next = new Set(darkSurfaceIconIds.value)
    if (score([22, 32, 50]) > score([248, 250, 252])) next.add(id)
    else next.delete(id)
    darkSurfaceIconIds.value = next
  }
  catch {
    // Rendering the original logo remains available even if canvas sampling is blocked.
  }
}

function markIconAsFailed(id: string) {
  failedIconIds.value = new Set(failedIconIds.value).add(id)
}

function itemHasFeature(item: NavigationItem, feature: NavigationFeature) {
  if (feature === "openSource") return Boolean(item.openSource)
  if (feature === "crossPlatform") return item.platforms.length >= 3
  return Boolean(item.localFirst)
}

function matchesFeatures(item: NavigationItem, features: readonly NavigationFeature[]) {
  return features.every(feature => itemHasFeature(item, feature))
}

const searchCompactionPattern = /[\p{P}\p{S}\s]+/gu

function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase(locale.value)
}

function compactSearchText(value: string) {
  return normalizeSearchText(value).replace(searchCompactionPattern, "")
}

function navigationItemHostname(item: NavigationItem) {
  try {
    return new URL(item.url).hostname.replace(/^www\./, "")
  }
  catch {
    return ""
  }
}

function itemMatchesQuery(item: NavigationItem, searchQuery: string) {
  const normalizedQuery = normalizeSearchText(searchQuery.trim())
  if (!normalizedQuery) return true

  const matchingFeatureLabels = featureFilters
    .filter(feature => itemHasFeature(item, feature.id))
    .flatMap(feature => [feature.label.zh, feature.label.en])
  const searchable = [
    item.id,
    item.name,
    item.sortName ?? "",
    ...(item.aliases ?? []),
    item.url,
    navigationItemHostname(item),
    item.description.zh,
    item.description.en,
    categoryLabels[item.category].zh,
    categoryLabels[item.category].en,
    ...matchingFeatureLabels,
    ...item.tags,
  ].join(" ")

  const compactQuery = compactSearchText(normalizedQuery)

  return normalizeSearchText(searchable).includes(normalizedQuery)
    || (Boolean(compactQuery) && compactSearchText(searchable).includes(compactQuery))
}

interface NavigationFilterState {
  scope: NavigationScope
  category: NavigationCategory | "all"
  features: readonly NavigationFeature[]
  searchQuery: string
}

function itemMatchesFilters(item: NavigationItem, filters: NavigationFilterState) {
  const matchesScope = filters.scope === "favorites"
    ? favoritesLoaded.value && favoriteItemIds.value.has(item.id)
    : filters.scope === "all" || item.platforms.includes(filters.scope)
  const matchesCategory = filters.category === "all" || item.category === filters.category

  return matchesScope
    && matchesCategory
    && matchesFeatures(item, filters.features)
    && itemMatchesQuery(item, filters.searchQuery)
}

function scopeCount(scope: NavigationScope) {
  return navigationItems.filter(item => itemMatchesFilters(item, {
    scope,
    category: scope === "favorites" ? "all" : activeCategory.value,
    features: scope === "favorites" ? [] : activeFeatures.value,
    searchQuery: query.value,
  })).length
}

function categoryCount(category: NavigationCategory | "all") {
  return navigationItems.filter(item => itemMatchesFilters(item, {
    scope: activeScope.value,
    category,
    features: activeFeatures.value,
    searchQuery: query.value,
  })).length
}

function featureCount(feature: NavigationFeature) {
  const otherFeatures = activeFeatures.value.filter(item => item !== feature)

  return navigationItems.filter(item => itemMatchesFilters(item, {
    scope: activeScope.value,
    category: activeCategory.value,
    features: [...otherFeatures, feature],
    searchQuery: query.value,
  })).length
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

async function selectScope(scope: NavigationScope) {
  if (activeScope.value === scope) return
  if (isReorderingFavorites.value) finishFavoriteReordering()

  activeScope.value = scope
  mobileFiltersOpen.value = false
  if (scope === "favorites") {
    activeCategory.value = "all"
    activeFeatures.value = []
  }

  await nextTick()
  if (typeof window === "undefined" || !navigationHub.value || activeScope.value !== scope) return

  navigationHub.value.querySelectorAll<HTMLElement>(".favorites-links").forEach(list => {
    list.scrollTop = 0
  })
  const slot = filterDockSlot.value
  if (slot) {
    const top = slot.getBoundingClientRect().top + window.scrollY - filterDockTopOffset()
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" })
    scheduleFilterDockUpdate()
  }
}

const scopeFilterOptions = computed(() => [
  {
    id: "favorites" as const,
    label: { zh: content.zh.favorites, en: content.en.favorites },
    icon: "lucide:star",
    count: scopeCount("favorites"),
  },
  ...platformFilters.map(filter => ({ ...filter, count: scopeCount(filter.id) })),
])

const allCategoryCount = computed(() => categoryCount("all"))

const categoryFilterOptions = computed(() => {
  return categoryOrder.map(category => ({
    id: category,
    label: categoryLabels[category],
    count: categoryCount(category),
  }))
})

const featureFilterOptions = computed(() => {
  return featureFilters.map(feature => ({ ...feature, count: featureCount(feature.id) }))
})

const activeFeatureFilters = computed(() => {
  return featureFilters.filter(feature => isFeatureActive(feature.id))
})

const filteredItems = computed(() => {
  return navigationItems.filter(item => itemMatchesFilters(item, {
    scope: activeScope.value,
    category: activeCategory.value,
    features: activeFeatures.value,
    searchQuery: query.value,
  }))
})

const displayedFavoritesGroups = computed<FavoriteGroup[]>(() => {
  const visibleItems = new Map(filteredItems.value.map(item => [item.id, item]))
  const orderedItems = itemOrder.value.flatMap(id => {
    const item = visibleItems.get(id)
    return item && favoriteItemIds.value.has(id) ? [item] : []
  })
  return groupOrder.value.map(id => ({
    id: id as NavigationCategory,
    items: orderedItems.filter(item => item.category === id),
  })).filter(group => group.items.length > 0)
})

const isDefaultOverview = computed(() => {
  return activeScope.value === "web"
    && activeCategory.value === "all"
    && activeFeatures.value.length === 0
    && !query.value.trim()
})

const isRankedOverview = computed(() => {
  return isDefaultOverview.value && activeSort.value === "recommended"
})

const nameCollator = computed(() => {
  return new Intl.Collator(locale.value === "zh" ? "zh-CN" : "en", {
    numeric: true,
    sensitivity: "base",
  })
})

const displayedItems = computed(() => {
  if (isFavoritesView.value) return filteredItems.value

  const indexedItems = filteredItems.value.map((item, index) => ({ item, index }))

  if (activeSort.value === "nameAsc" || activeSort.value === "nameDesc") {
    const direction = activeSort.value === "nameAsc" ? 1 : -1
    return indexedItems
      .sort((a, b) =>
        direction * nameCollator.value.compare(
          a.item.sortName ?? a.item.name,
          b.item.sortName ?? b.item.name,
        ) || a.index - b.index,
      )
      .map(({ item }) => item)
  }

  return indexedItems
    .sort((a, b) => (b.item.priority ?? 0) - (a.item.priority ?? 0) || a.index - b.index)
    .map(({ item }) => item)
})

function cardRank(item: NavigationItem) {
  if (!isRankedOverview.value) return 0
  const rank = displayedItems.value.findIndex(displayedItem => displayedItem.id === item.id) + 1
  return rank <= 3 ? rank : 0
}

function cardRankClass(item: NavigationItem) {
  const rank = cardRank(item)
  if (rank === 1) return "rank-gold"
  if (rank === 2) return "rank-silver"
  if (rank === 3) return "rank-bronze"
  return undefined
}

function rankMark(rank: number) {
  if (rank === 1) return "🥇"
  if (rank === 2) return "🥈"
  return "🥉"
}

function rankLabel(rank: number) {
  if (locale.value === "zh") return `第 ${rank} 名`
  return `Rank ${rank}`
}

const isEmptyFavoritesCollection = computed(() => isFavoritesView.value && favoritesLoaded.value && favorites.value.length === 0 && !query.value.trim())

const hasActiveFilters = computed(() => {
  return (activeScope.value !== defaultScope && activeScope.value !== "all")
    || activeCategory.value !== "all"
    || activeFeatures.value.length > 0
    || Boolean(query.value.trim())
})

const activeFilterCount = computed(() => {
  return Number(activeScope.value !== defaultScope && activeScope.value !== "all")
    + Number(activeCategory.value !== "all")
    + activeFeatures.value.length
    + Number(Boolean(query.value.trim()))
})

const activeFilterCountLabel = computed(() => {
  if (locale.value === "zh") return `${copy.value.selectedFilters} ${activeFilterCount.value} 项`
  return `${activeFilterCount.value} ${copy.value.selectedFilters.toLocaleLowerCase(locale.value)}`
})

const activeScopeLabel = computed(() => {
  if (activeScope.value === "favorites") return copy.value.favorites
  return activeScope.value === "all" ? "" : platformName(activeScope.value)
})

const activeCategoryLabel = computed(() => {
  return activeCategory.value === "all" ? "" : localize(categoryLabels[activeCategory.value])
})

const resultSummary = computed(() => {
  return locale.value === "zh"
    ? `共 ${filteredItems.value.length} 项`
    : `${filteredItems.value.length} ${filteredItems.value.length === 1 ? "item" : "items"}`
})

let filterDockFrame: number | undefined
let filterDockResizeObserver: ResizeObserver | undefined

function filterDockTopOffset() {
  const value = filterDockSlot.value
    ? getComputedStyle(filterDockSlot.value).getPropertyValue("--filter-dock-top")
    : "0"

  return Number.parseFloat(value) || 0
}

function updateFilterDockPosition() {
  const dock = filterDock.value
  const slot = filterDockSlot.value
  if (!dock || !slot) return

  const top = filterDockTopOffset()
  const slotRect = slot.getBoundingClientRect()
  const shouldFix = slotRect.top <= top

  if (!shouldFix) {
    isFilterDockFixed.value = false
    filterDockStyle.value = {}
    filterDockSlotStyle.value = {}
    return
  }

  filterDockSlotStyle.value = {
    height: `${dock.offsetHeight}px`,
  }
  filterDockStyle.value = {
    position: "fixed",
    top: `${top}px`,
    left: `${slotRect.left}px`,
    width: `${slotRect.width}px`,
  }
  isFilterDockFixed.value = true
}

function scheduleFilterDockUpdate() {
  if (filterDockFrame !== undefined) return

  filterDockFrame = window.requestAnimationFrame(() => {
    filterDockFrame = undefined
    updateFilterDockPosition()
  })
}

function persistFavorites(nextFavorites: string[]) {
  favorites.value = [...new Set(nextFavorites)]
  try {
    window.localStorage.setItem(favoritesStorageKey, JSON.stringify({ version: 1, ids: favorites.value }))
    storageUnavailable.value = false
  }
  catch {
    storageUnavailable.value = true
  }
}

function restoreFavorites() {
  try {
    const stored = window.localStorage.getItem(favoritesStorageKey)
    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (
        typeof parsed === "object"
        && parsed !== null
        && "version" in parsed
        && parsed.version === 1
        && "ids" in parsed
        && Array.isArray(parsed.ids)
      ) {
        const validIds = new Set(navigationItems.map(item => item.id))
        favorites.value = [...new Set(parsed.ids.filter((id): id is string => typeof id === "string" && validIds.has(id)))]
      }
    }
  }
  catch {
    storageUnavailable.value = true
    favorites.value = []
  }
  finally {
    favoritesLoaded.value = true
  }
}

function toggleFavorite(id: string) {
  const nextFavorites = favoriteItemIds.value.has(id)
    ? favorites.value.filter(favoriteId => favoriteId !== id)
    : [...favorites.value, id]
  if (!nextFavorites.length && isReorderingFavorites.value) finishFavoriteReordering()
  persistFavorites(nextFavorites)
}

function clearAllFavorites() {
  if (favorites.value.length === 0) return
  const message = locale.value === "zh"
    ? `确定清空全部 ${favorites.value.length} 项收藏吗？此操作无法撤销。`
    : `Clear all ${favorites.value.length} favorites? This cannot be undone.`
  if (!window.confirm(message)) return
  if (isReorderingFavorites.value) finishFavoriteReordering()
  persistFavorites([])
}

function importRecommendedFavorites() {
  persistFavorites([...favorites.value, ...navigationRecommendedFavoriteIds])
}

function setActiveView(view: NavigationView) {
  activeView.value = view
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(navigationViewStorageKey, view)
  }
  catch {
    // Keep the in-memory preference when storage is unavailable.
  }
}

function restoreActiveView() {
  try {
    const storedView = window.localStorage.getItem(navigationViewStorageKey)
    if (storedView === "grid" || storedView === "list") activeView.value = storedView
  }
  catch {
    // Use the default grid view when storage is unavailable.
  }
}

onMounted(() => {
  restoreFavorites()
  restoreActiveView()
  window.addEventListener("scroll", scheduleFilterDockUpdate, { passive: true })
  window.addEventListener("resize", scheduleFilterDockUpdate)
  filterDockResizeObserver = new ResizeObserver(scheduleFilterDockUpdate)
  if (filterDock.value) filterDockResizeObserver.observe(filterDock.value)
  scheduleFilterDockUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scheduleFilterDockUpdate)
  window.removeEventListener("resize", scheduleFilterDockUpdate)
  filterDockResizeObserver?.disconnect()
  if (filterDockFrame !== undefined) window.cancelAnimationFrame(filterDockFrame)
})

function isEditingTarget(event: KeyboardEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return false

  return target.isContentEditable
    || target.tagName === "INPUT"
    || target.tagName === "SELECT"
    || target.tagName === "TEXTAREA"
}

function onNavigationSearchShortcut(event: KeyboardEvent) {
  if (event.code !== "Slash" || !event.altKey || event.ctrlKey || event.metaKey) return
  if (isEditingTarget(event) && event.target !== searchInput.value) return

  event.preventDefault()
  event.stopPropagation()
  searchInput.value?.focus()
}

onMounted(() => {
  window.addEventListener("keydown", onNavigationSearchShortcut, true)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onNavigationSearchShortcut, true)
})

function clearSearch() {
  query.value = ""
  searchInput.value?.focus()
}

function resetFilters() {
  activeScope.value = defaultScope
  activeCategory.value = "all"
  activeFeatures.value = []
  activeSort.value = "recommended"
  query.value = ""
}
</script>

<style scoped>
.is-static {
  pointer-events: none;
  user-select: none;
}

:global(.navigation-hub-page .vp-home-custom) {
  width: 100%;
  padding-top: 4px;
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

.navigation-panel {
  margin-bottom: 8px;
}

.filter-dock-slot {
  min-width: 0;
}

.filter-dock {
  position: relative;
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(230px, 0.42fr) minmax(0, 1fr);
  min-height: var(--filter-dock-height);
  box-sizing: border-box;
  gap: 8px;
  align-items: center;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  box-shadow: none;
}

@media (min-width: 681px) {
  .filter-dock.is-fixed {
    background: var(--gp-surface-bg-elv);
  }

  .filter-dock.is-fixed .command-search {
    background: var(--gp-surface-bg-elv);
  }
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

.navigation-title {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(50%);
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
  grid-template-columns: auto 1fr auto auto;
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

.search-shortcut {
  display: inline-flex;
  min-width: 36px;
  height: 22px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 650;
  line-height: 1;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 6px;
  background: color-mix(in srgb, var(--gp-surface-bg-soft) 82%, transparent);
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
  grid-template-columns: repeat(7, minmax(max-content, 1fr));
  min-width: 0;
  overflow-x: auto;
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

.system-filter-item:not(:disabled):hover {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--gp-cyan) 34%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 10%, transparent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--gp-blue) 8%, transparent);
  transform: translateY(-1px);
}

.system-filter-item:not(:disabled):hover .system-filter-icon,
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

.system-filter-item:disabled,
.category-rail button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
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

.system-filter-item:not(:disabled):hover .count-badge,
.system-filter-item.active .count-badge,
.category-rail button:not(:disabled):hover .count-badge,
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
  gap: 14px;
  align-items: start;
}

.is-favorites-view .navigation-content {
  grid-template-columns: minmax(0, 1fr);
}

.favorites-reorder-help {
  margin: 0 0 10px;
  color: var(--gp-home-muted);
  font-size: 12px;
  line-height: 1.6;
}

.reorder-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.favorite-drag-handle {
  display: grid;
  width: 32px;
  height: 32px;
  flex: none;
  box-sizing: border-box;
  place-items: center;
  padding: 0;
  color: var(--vp-c-text-2);
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.favorite-drag-handle > svg {
  width: 16px;
  height: 16px;
}

.favorite-drag-handle:hover,
.favorite-drag-handle:focus-visible {
  color: var(--gp-icon-highlight);
  border-color: var(--gp-active-border);
  background: var(--gp-surface-bg-elv);
}

.favorite-drag-handle:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 1px;
}

.favorite-drag-handle:active {
  cursor: grabbing;
}

.group-drag-handle {
  margin: -5px -5px -5px -3px;
}

.card-drag-handle {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 1px;
  translate: 0 -50%;
}

.is-reordering .favorites-link {
  padding-left: 34px;
}

.favorites-group.is-dragging,
.favorite-card.is-dragging {
  opacity: 0.6;
}

.favorites-group.is-drop-target,
.favorite-card.is-drop-target {
  outline: 2px dashed var(--gp-cyan);
  outline-offset: -2px;
}

.favorites-groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
}

.favorites-group > .favorites-heading {
  display: flex;
  gap: 9px;
  align-items: center;
  margin: 0 0 8px;
  padding: 0;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  border: 0;
}

.favorites-heading::before {
  width: 4px;
  height: 15px;
  flex: none;
  border-radius: 999px;
  background: var(--group-accent);
  content: "";
}

.favorites-group {
  --group-accent: var(--gp-cyan);
  --favorite-card-height: 64px;
  --favorite-card-gap: 6px;

  min-width: 0;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--group-accent) 18%, var(--gp-home-card-border));
  border-radius: 16px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--group-accent) 7%, var(--gp-home-card-bg)), var(--gp-home-card-bg));
}

.favorites-group-productivity {
  --group-accent: #2d9c8c;
}

.favorites-group-development {
  --group-accent: #4285c5;
}

.favorites-group-ai {
  --group-accent: #16a6c9;
}

.favorites-group-design {
  --group-accent: #b26ac7;
}

.favorites-group-utilities {
  --group-accent: #dc8b32;
}

.favorites-group-knowledge {
  --group-accent: #6276c9;
}

.favorites-group-communication {
  --group-accent: #299caa;
}

.favorites-group-community {
  --group-accent: #3b82d0;
}

.favorites-group-media {
  --group-accent: #bb659c;
}

.favorites-group-network {
  --group-accent: #41a36e;
}

.favorites-group-gaming {
  --group-accent: #d65d69;
}

.favorites-heading small {
  display: grid;
  min-width: 21px;
  height: 21px;
  box-sizing: border-box;
  place-items: center;
  margin-left: auto;
  padding: 0 5px;
  color: var(--vp-c-text-2);
  font-size: 10px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 999px;
  background: var(--gp-surface-bg-elv);
}

.favorites-links {
  display: grid;
  height: calc(var(--favorite-card-height) * 3 + var(--favorite-card-gap) * 2);
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: var(--favorite-card-height);
  gap: var(--favorite-card-gap);
  align-content: start;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--group-accent) transparent;
}

.favorites-links:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.favorite-card {
  position: relative;
  min-width: 0;
  border-radius: 12px;
}

.favorites-link {
  display: flex;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  padding: 8px 48px 8px 10px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 12px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 58%, transparent);
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.favorites-link:hover,
.favorites-link:focus-visible {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--item-accent) 30%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--item-accent) 7%, var(--gp-surface-bg-elv));
  box-shadow: 0 4px 12px color-mix(in srgb, var(--item-accent) 7%, transparent);
}

.favorites-link:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 3px;
}

.favorites-link .card-topline {
  width: 100%;
  min-width: 0;
}

.favorites-link .card-leading {
  display: grid;
  width: 100%;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
}

.favorites-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.favorites-link .card-title {
  font-size: 14px;
  line-height: 1.35;
  -webkit-line-clamp: 1;
}

.favorites-link .app-icon {
  width: 32px;
  height: 32px;
  font-size: 20px;
  border-radius: 9px;
}

.favorites-toolbar {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: center;
  margin-bottom: 8px;
  padding: 0;
}

.favorites-note {
  min-width: 0;
  flex: 1 1 240px;
  margin: 0;
  color: var(--gp-home-muted);
  font-size: 11px;
  line-height: 1.5;
}

.favorites-storage-note {
  display: flex;
  gap: 5px;
  align-items: flex-start;
}

.favorites-storage-note > svg {
  width: 13px;
  height: 13px;
  flex: none;
  margin-top: 2px;
}

.favorites-storage-note > span {
  min-width: 0;
}

.storage-error {
  color: var(--vp-c-text-1);
}

.favorites-action {
  display: inline-flex;
  box-sizing: border-box;
  min-height: 34px;
  flex: none;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
  border: 1px solid color-mix(in srgb, var(--gp-cyan) 35%, var(--gp-home-card-border));
  border-radius: 10px;
  background: var(--gp-gradient-active);
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.favorites-action.secondary {
  border-color: var(--gp-home-card-border);
  background: var(--gp-surface-bg-elv);
}

.favorites-action.danger {
  color: #b83c49;
  border-color: color-mix(in srgb, #d64d5a 40%, var(--gp-home-card-border));
  background: color-mix(in srgb, #d64d5a 9%, var(--gp-surface-bg-elv));
}

.favorites-action.danger:not(:disabled):hover,
.favorites-action.danger:focus-visible {
  border-color: color-mix(in srgb, #d64d5a 62%, var(--gp-home-card-border));
  box-shadow: 0 0 12px color-mix(in srgb, #d64d5a 22%, transparent);
}

:global(html[data-theme="dark"] .favorites-action.danger) {
  color: #ff969d;
}

.favorites-action:disabled {
  opacity: 0.65;
  cursor: default;
}

.favorites-action:not(:disabled):hover,
.favorites-action:focus-visible {
  border-color: var(--gp-active-border);
  box-shadow: 0 0 12px var(--gp-active-glow);
  transform: translateY(-1px);
}

.favorites-action:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.favorites-action > svg {
  width: 14px;
  height: 14px;
  color: var(--gp-icon-highlight);
}

.favorites-action.danger > svg {
  color: inherit;
}

.favorite-toggle {
  position: absolute;
  z-index: 2;
  top: 12px;
  right: 12px;
  display: grid;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  place-items: center;
  padding: 0;
  color: var(--vp-c-text-3);
  border: 1px solid var(--gp-home-card-border);
  border-radius: 11px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 88%, transparent);
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.favorite-toggle > svg {
  width: 18px;
  height: 18px;
}

.favorite-toggle.is-favorite {
  color: var(--gp-cyan);
  border-color: color-mix(in srgb, var(--gp-cyan) 48%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-cyan) 18%, var(--gp-surface-bg-elv));
  box-shadow: 0 2px 8px color-mix(in srgb, var(--gp-cyan) 15%, transparent);
}

.favorite-toggle.is-favorite > svg,
.favorite-toggle.is-favorite :deep(path) {
  fill: currentColor;
}

.favorite-toggle:hover,
.favorite-toggle:focus-visible {
  color: var(--gp-icon-highlight);
  border-color: var(--gp-active-border);
  box-shadow: 0 0 12px var(--gp-active-glow);
  transform: scale(1.05);
}

.favorite-toggle:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.favorite-card .favorite-toggle {
  top: 50%;
  right: 4px;
  width: 40px;
  height: 40px;
  translate: 0 -50%;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.favorite-card .favorite-toggle > svg {
  width: 16px;
  height: 16px;
}

.favorites-description {
  display: -webkit-box;
  overflow: hidden;
  color: var(--gp-home-muted);
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

@media (min-width: 601px) and (max-width: 959px) {
  .favorites-groups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 959px) {
  .favorites-groups {
    gap: 10px;
  }

  .favorites-group {
    --favorite-card-height: 58px;
    --favorite-card-gap: 5px;

    padding: 8px;
    border-radius: 12px;
  }

  .favorites-group > .favorites-heading {
    margin-bottom: 6px;
  }

  .favorites-link {
    padding: 6px 44px 6px 8px;
  }

  .favorites-link .card-leading {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 8px;
  }

  .favorites-link .app-icon {
    width: 28px;
    height: 28px;
    font-size: 18px;
    border-radius: 8px;
  }

  .favorites-link .app-icon img {
    width: 22px;
    height: 22px;
  }

  .favorites-action {
    min-height: 32px;
    padding: 4px 8px;
  }
}

@media (max-width: 600px) {
  .favorites-groups {
    grid-template-columns: minmax(0, 1fr);
  }
}

.card-area {
  min-width: 0;
}

.card-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.view-switch {
  display: inline-flex;
  flex: none;
  gap: 2px;
  padding: 3px;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 24%, var(--gp-home-card-border));
  border-radius: 10px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 88%, transparent);
  box-shadow: 0 4px 12px rgb(42 67 89 / 0.07);
}

.view-switch button {
  display: grid;
  width: 28px;
  height: 26px;
  padding: 0;
  place-items: center;
  color: var(--vp-c-text-3);
  border: 0;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.view-switch button:hover {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--gp-blue) 8%, transparent);
}

.view-switch button.active {
  color: var(--gp-icon-highlight);
  background: var(--gp-gradient-active);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 64%, transparent);
}

.view-switch button:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.view-switch svg {
  width: 14px;
  height: 14px;
}

.sort-control {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
}

.sort-control > svg {
  width: 15px;
  height: 15px;
  flex: none;
  color: var(--gp-icon-highlight);
}

.navigation-sort {
  --gp-select-z-index: 10;
  --gp-select-min-width: 126px;
  --gp-select-menu-min-width: 148px;
  --gp-select-option-height: 32px;
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

.category-rail button:not(:disabled):hover {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--gp-blue) 5%, transparent);
  transform: translateX(2px);
}

.category-rail button:not(:disabled):hover::before {
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
  grid-auto-rows: minmax(160px, auto);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
}

.card-field.is-list-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.is-list-view .nav-card,
.is-list-view .nav-card.is-wide,
.is-list-view .nav-card.is-tall {
  grid-column: span 1;
  grid-row: span 1;
  min-height: 88px;
  padding: 12px 58px 12px 12px;
}

.is-list-view .nav-card-link {
  display: grid;
  grid-template-areas: "top content";
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

.is-list-view .card-topline {
  position: static;
  grid-area: top;
}

.is-list-view .card-content {
  grid-area: content;
  margin: 0;
}

.is-list-view .card-meta-row {
  justify-content: flex-start;
  padding-top: 6px;
}

.is-list-view .card-description {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.is-list-view .card-aura {
  top: -88px;
  right: -42px;
  width: 170px;
  height: 170px;
}

.nav-card {
  position: relative;
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  flex-direction: column;
  justify-content: flex-start;
  padding: 18px;
  overflow: hidden;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border: 1px solid var(--gp-home-card-border);
  border-radius: var(--hub-radius);
  background: var(--gp-home-card-bg);
  box-shadow: var(--gp-home-card-shadow);
  isolation: isolate;
  transition: background 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.nav-card-link {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  color: inherit;
  text-decoration: none;
}

.nav-card-link .card-topline {
  padding-right: 38px;
}

.nav-card-link .card-content {
  flex: 1;
}

.nav-card-link:focus-visible {
  border-radius: calc(var(--hub-radius) - 2px);
  outline: 2px solid var(--gp-cyan);
  outline-offset: 3px;
}

.nav-card > :where(:not(.card-aura):not(.rank-sheen):not(.ranking-badge):not(.nav-card-link):not(.favorite-toggle)) {
  position: relative;
  z-index: 1;
}

.nav-card.rank-gold,
.nav-card.rank-silver,
.nav-card.rank-bronze {
  --rank-color: #f5b942;
  overflow: visible;
}

.nav-card.rank-silver {
  --rank-color: #b7c7dc;
  background:
    linear-gradient(135deg, rgb(240 248 255 / 0.14), transparent 32%, rgb(141 164 194 / 0.10) 72%, transparent),
    var(--gp-home-card-bg);
}

.nav-card.rank-bronze {
  --rank-color: #b87333;
}

.nav-card.rank-gold::before,
.nav-card.rank-silver::before,
.nav-card.rank-bronze::before {
  position: absolute;
  z-index: 0;
  inset: -1px;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(
    from 0deg,
    transparent 0deg 66deg,
    color-mix(in srgb, var(--rank-color) 30%, transparent) 74deg,
    color-mix(in srgb, var(--rank-color) 92%, white) 79deg,
    color-mix(in srgb, var(--rank-color) 36%, transparent) 84deg,
    transparent 94deg 212deg,
    color-mix(in srgb, var(--rank-color) 24%, transparent) 222deg,
    color-mix(in srgb, var(--rank-color) 68%, transparent) 229deg,
    transparent 240deg 360deg
  );
  content: "";
  opacity: 0.92;
  pointer-events: none;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--rank-color) 68%, transparent));
  animation: ranking-orbit 10s linear infinite;
}

.nav-card.rank-silver::before {
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--rank-color) 86%, transparent));
  animation-duration: 10.5s;
}

.nav-card.rank-bronze::before {
  animation-duration: 14s;
}

@keyframes ranking-orbit {
  to {
    transform: rotate(360deg);
  }
}

.nav-card.rank-gold {
  border-color: color-mix(in srgb, #f5b942 32%, var(--gp-home-card-border));
  box-shadow:
    0 0 0 1px color-mix(in srgb, #f5b942 24%, transparent),
    0 0 14px color-mix(in srgb, #f5b942 34%, transparent),
    0 0 36px color-mix(in srgb, #f5b942 16%, transparent),
    var(--gp-home-card-shadow);
}

.nav-card.rank-silver {
  border-color: color-mix(in srgb, #b7c7dc 58%, var(--gp-home-card-border));
  box-shadow:
    0 0 0 1px color-mix(in srgb, #e6f0ff 52%, transparent),
    0 0 18px color-mix(in srgb, #b7c7dc 58%, transparent),
    0 0 48px color-mix(in srgb, #91a9c7 29%, transparent),
    var(--gp-home-card-shadow);
}

.nav-card.rank-bronze {
  border-color: color-mix(in srgb, #b87333 34%, var(--gp-home-card-border));
  box-shadow:
    0 0 0 1px color-mix(in srgb, #b87333 24%, transparent),
    0 0 14px color-mix(in srgb, #b87333 34%, transparent),
    0 0 36px color-mix(in srgb, #b87333 16%, transparent),
    var(--gp-home-card-shadow);
}

.nav-card.rank-gold .card-aura,
.nav-card.rank-silver .card-aura,
.nav-card.rank-bronze .card-aura {
  z-index: 0;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--rank-color) 34%, transparent),
    color-mix(in srgb, var(--rank-color) 16%, transparent) 42%,
    transparent 72%
  );
  filter: blur(8px);
  animation: ranking-aura-pulse 4.8s ease-in-out infinite;
}

.nav-card.rank-silver .card-aura {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--rank-color) 60%, transparent),
    color-mix(in srgb, var(--rank-color) 28%, transparent) 42%,
    transparent 72%
  );
  filter: blur(7px);
  animation-duration: 5s;
}

.rank-sheen {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.rank-sheen::before {
  position: absolute;
  top: -42%;
  left: -52%;
  width: 52%;
  height: 190%;
  opacity: 0.58;
  background: linear-gradient(
    105deg,
    transparent 0 32%,
    color-mix(in srgb, var(--rank-color) 10%, transparent) 39%,
    color-mix(in srgb, white 72%, var(--rank-color)) 47%,
    color-mix(in srgb, var(--rank-color) 62%, transparent) 53%,
    color-mix(in srgb, white 12%, transparent) 61%,
    transparent 68% 100%
  );
  content: "";
  transform: skewX(-18deg);
  filter: blur(1px);
  animation: rank-sheen-sweep 5.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.nav-card.rank-gold .rank-sheen::before {
  opacity: 0.64;
  animation-duration: 5.4s;
}

.nav-card.rank-silver .rank-sheen::before {
  opacity: 0.72;
  animation-duration: 4.8s;
}

.nav-card.rank-bronze .rank-sheen::before {
  opacity: 0.48;
  animation-duration: 6.2s;
}

@keyframes rank-sheen-sweep {
  0%,
  24% {
    transform: translateX(0) skewX(-18deg);
  }

  62%,
  100% {
    transform: translateX(420%) skewX(-18deg);
  }
}

.nav-card.rank-bronze .card-aura {
  animation-duration: 6.8s;
}

@keyframes ranking-aura-pulse {
  0%,
  100% {
    opacity: 0.42;
    transform: scale(0.96);
  }

  50% {
    opacity: 0.78;
    transform: scale(1.1);
  }
}

.card-leading {
  display: flex;
  min-width: 0;
  gap: 10px;
  align-items: center;
}

.ranking-badge {
  display: inline-flex;
  flex: none;
  gap: 3px;
  align-items: center;
  padding: 3px 5px;
  color: var(--rank-color);
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid color-mix(in srgb, var(--rank-color) 38%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--rank-color) 9%, var(--gp-surface-bg-elv));
  box-shadow: 0 0 8px color-mix(in srgb, var(--rank-color) 13%, transparent);
}

.ranking-badge small {
  color: color-mix(in srgb, var(--rank-color) 74%, var(--vp-c-text-1));
  font-size: 9px;
  font-weight: 800;
}

.nav-card::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--item-accent) 9%, transparent), transparent 45%);
  content: "";
  opacity: 0;
  transition: opacity 240ms ease;
}

.nav-card.is-wide {
  grid-column: span 2;
}

.nav-card.is-tall {
  grid-row: span 2;
}

@media (min-width: 681px) and (max-width: 959px) {
  .nav-card.is-wide,
  .nav-card.is-tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}

.card-aura {
  position: absolute;
  z-index: -1;
  top: -75px;
  right: -65px;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--item-accent) 17%, transparent), transparent 68%);
  opacity: 0.52;
  pointer-events: none;
  transition: opacity 240ms ease, transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.nav-card:hover,
.nav-card:focus-within {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--item-accent) 38%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--item-accent) 5%, var(--gp-home-card-bg));
  box-shadow:
    0 13px 30px rgb(2 7 16 / 0.34),
    0 6px 16px color-mix(in srgb, var(--item-accent) 9%, transparent);
  transform: translateY(-2px);
}

.nav-card:hover::after,
.nav-card:focus-within::after {
  opacity: 1;
}

.nav-card:hover .card-aura,
.nav-card:focus-within .card-aura {
  opacity: 0.8;
  transform: scale(1.15);
}

.card-topline,
.card-meta-row,
.platform-stack {
  display: flex;
  align-items: center;
}

.card-topline,
.card-meta-row {
  justify-content: space-between;
}

.card-topline {
  gap: 10px;
}

.card-meta-row {
  min-width: 0;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}

.app-icon {
  display: grid;
  flex: none;
  width: 38px;
  height: 38px;
  place-items: center;
  overflow: hidden;
  color: var(--item-accent);
  font-size: 23px;
  border: 1px solid color-mix(in srgb, var(--item-accent) 34%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--item-accent) 12%, var(--gp-surface-bg-elv));
  transition: border-color 220ms ease, background 220ms ease, box-shadow 220ms ease, transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.nav-card:hover .app-icon,
.nav-card:focus-within .app-icon {
  border-color: color-mix(in srgb, var(--item-accent) 50%, transparent);
  background: color-mix(in srgb, var(--item-accent) 17%, var(--gp-surface-bg-elv));
  box-shadow: 0 5px 13px color-mix(in srgb, var(--item-accent) 13%, transparent);
  transform: scale(1.045) rotate(-1.5deg);
}

.app-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

:global(html[data-theme="dark"] .app-icon.brand-icon-monochrome) {
  color: color-mix(in srgb, var(--item-accent) 40%, #fff);
}

:global(html[data-theme="dark"] .app-icon:not(.brand-icon-monochrome):not(.brand-icon-light-surface)) {
  background: #162032;
}

:global(html[data-theme="dark"] .app-icon.brand-icon-light-surface) {
  border-color: rgb(255 255 255 / 0.68);
  background: #f8fafc;
}

:global(html[data-theme="dark"] .nav-card:hover .app-icon.brand-icon-light-surface),
:global(html[data-theme="dark"] .nav-card:focus-within .app-icon.brand-icon-light-surface),
:global(html[data-theme="dark"] .favorites-link:hover .app-icon.brand-icon-light-surface),
:global(html[data-theme="dark"] .favorites-link:focus-visible .app-icon.brand-icon-light-surface) {
  border-color: #fff;
  background: #fff;
}

.card-content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin: 12px 0 0;
}

.card-category {
  align-self: flex-start;
  min-width: 0;
  max-width: 100%;
  padding: 3px 7px;
  overflow: hidden;
  color: color-mix(in srgb, var(--item-accent) 76%, var(--vp-c-text-1));
  font-size: 10px;
  font-weight: 650;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid color-mix(in srgb, var(--item-accent) 24%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--item-accent) 10%, var(--gp-surface-bg-soft));
}

.card-title {
  display: -webkit-box;
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  font-size: 18px;
  line-height: 1.3;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.card-description {
  display: -webkit-box;
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
.nav-card:focus-within .platform-stack span {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--gp-blue) 32%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 8%, var(--gp-surface-bg-elv));
}

.platform-stack span:first-child {
  margin-left: 0;
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
  border-color: color-mix(in srgb, var(--gp-blue) 14%, var(--gp-home-card-border));
  background: rgb(22 32 50 / 0.94);
  box-shadow:
    0 8px 24px rgb(2 7 16 / 0.3),
    inset 0 1px 0 rgb(205 232 255 / 0.035);
}

:global(html[data-theme="dark"] .nav-card:hover),
:global(html[data-theme="dark"] .nav-card:focus-within) {
  border-color: color-mix(in srgb, var(--item-accent) 36%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--item-accent) 4%, rgb(25 36 55 / 0.97));
  box-shadow:
    0 14px 32px rgb(2 7 16 / 0.4),
    0 5px 15px color-mix(in srgb, var(--item-accent) 8%, transparent),
    inset 0 1px 0 rgb(205 232 255 / 0.045);
}

:global(html[data-theme="dark"] .nav-card::after) {
  background: radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--item-accent) 8%, transparent), transparent 46%);
}

:global(html[data-theme="dark"] .system-filter-item:not(.active)),
:global(html[data-theme="dark"] .category-rail button:not(.active)) {
  color: var(--gp-home-muted);
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

@media (max-width: 680px) {
  .navigation-hub {
    padding-bottom: 48px;
  }

  .filter-dock {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: transparent;
  }

  .command-search {
    position: relative;
    z-index: auto;
    top: auto;
    margin-bottom: 0;
    border-color: color-mix(in srgb, var(--gp-active-border) 56%, var(--gp-home-card-border));
    background: color-mix(in srgb, var(--gp-surface-bg-elv) 94%, transparent);
    box-shadow:
      0 7px 20px rgb(42 67 89 / 0.14),
      0 0 0 1px color-mix(in srgb, var(--gp-cyan) 6%, transparent);
    backdrop-filter: blur(18px) saturate(1.12);
    -webkit-backdrop-filter: blur(18px) saturate(1.12);
  }

  .search-shortcut {
    display: none;
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

  .category-rail button:not(:disabled):hover {
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

  .card-toolbar {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px;
    align-items: stretch;
    justify-content: stretch;
  }

  .view-switch {
    height: 44px;
    box-sizing: border-box;
    align-self: auto;
    gap: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--gp-blue) 24%, var(--gp-home-card-border)),
      0 4px 12px rgb(42 67 89 / 0.07);
  }

  .view-switch button {
    width: 44px;
    height: 44px;
    min-height: 44px;
  }

  .sort-control {
    display: block;
    min-width: 0;
    width: auto;
  }

  .sort-control > svg,
  .sort-control > span {
    display: none;
  }

  .navigation-sort {
    --gp-select-min-width: 0;
    --gp-select-trigger-height: 44px;
    --gp-select-option-height: 44px;

    width: 100%;
    min-width: 0;
    margin-left: 0;
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
    min-height: 160px;
  }

  .card-field.is-list-view .nav-card,
  .card-field.is-list-view .nav-card.is-wide,
  .card-field.is-list-view .nav-card.is-tall {
    display: flex;
    min-height: 0;
    padding: 11px 58px 11px 11px;
  }

  .card-field.is-list-view .nav-card-link {
    display: grid;
    grid-template-areas: "top" "content";
    grid-template-columns: minmax(0, 1fr);
    gap: 9px 11px;
  }

  .is-list-view .card-description {
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
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
  .view-switch button,
  .favorites-link,
  .favorites-action,
  .favorite-toggle,
  .nav-card,
  .nav-card::after,
  .card-aura,
  .app-icon {
    transition: none;
  }

  .nav-card:hover,
  .nav-card:focus-within,
  .nav-card:hover .card-aura,
  .nav-card:focus-within .card-aura,
  .nav-card:hover .app-icon,
  .nav-card:focus-within .app-icon,
  .favorite-toggle:hover,
  .favorite-toggle:focus-visible,
  .favorites-action:not(:disabled):hover,
  .favorites-action:focus-visible {
    transform: none;
  }

  .nav-card.rank-gold::before,
  .nav-card.rank-silver::before,
  .nav-card.rank-bronze::before,
  .rank-sheen::before,
  .nav-card.rank-gold .card-aura,
  .nav-card.rank-silver .card-aura,
  .nav-card.rank-bronze .card-aura,
  .command-search.focused::before,
  .mobile-filters-open .system-filter,
  .mobile-filters-open .category-rail,
  .system-filter-item.active::before,
  .active-filter-bar {
    animation: none;
  }
}
</style>
