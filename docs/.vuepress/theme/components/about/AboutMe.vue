<template>
  <div class="page">
    <AboutProfilePanel
      :blog-count="blogCount"
      :note-count="noteCount"
      :game-count="gamesData.length"
      :language-count="langsData.length"
      :tool-count="toolsData.length"
    />

    <section class="media-grid">
      <div class="media-panel spotify-panel">
        <p class="section-label">Spotify</p>
        <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />
      </div>
      <section class="skills-panel" :aria-label="isEnglish ? 'Skills and tools' : '技能与工具'">
        <p class="section-label">{{ isEnglish ? 'Skills & Tools' : '技能与工具' }}</p>
        <IconMarquee :items="toolsData" direction="left" :duration="25" />
        <IconMarquee :items="langsData" direction="right" :duration="50" />
      </section>
    </section>

    <section class="game-section" :aria-label="isEnglish ? 'Games' : '游戏封面'">
      <GameCoverSwiper
        :items="gamesData"
        :title="isEnglish ? 'Games' : '游戏封面'"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@internal/routes"
import { computed } from "vue"
import { useData, usePostsData } from "vuepress-theme-plume/composables"

import { toolsData } from "./data/tools.data"
import { langsData } from "./data/lang.data"
import { gamesData } from "./data/game-cover.data"

import AboutProfilePanel from "./AboutProfilePanel.vue"
import IconMarquee from "./IconMarquee.vue"
import SpotifyEmbedded from "./SpotifyEmbedded.vue"
import GameCoverSwiper from "./GameCoverSwiper.vue"

const { lang } = useData()
const isEnglish = computed(() => lang.value.startsWith("en"))
const postsData = usePostsData()

const blogCount = computed(() => {
  const blogPath = lang.value.startsWith("en") ? "/en/blog/" : "/blog/"
  return postsData.value[blogPath]?.filter(post => !post.draft).length ?? 0
})

const noteCount = computed(() => {
  const localePrefix = lang.value.startsWith("en") ? "/en" : ""
  const notePath = `${localePrefix}/notes/`
  const routeTable = routes as Record<string, unknown>

  return Object.keys(routeTable).filter(path =>
    path.startsWith(notePath) && path !== `${notePath}about-me/`,
  ).length
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 基于视口高度的响应式布局高度，限制最小/最大值以保证跨浏览器一致性 */
.media-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  align-items: stretch;

  height: 216px;
}

/* 统一媒体区域的面板外观，内容组件保留各自的展示方式 */
.media-panel {
  box-sizing: border-box;
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 20px;
  background: var(--gp-home-card-bg);
  box-shadow: var(--gp-home-card-shadow);
}

.section-label {
  margin: 0;
  color: var(--gp-icon-highlight);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.4;
}

.spotify-panel {
  gap: 10px;
}

.spotify-panel :deep(.spotify) {
  flex: none;
  width: 100%;
  height: 152px;
  min-height: 152px;
  border-radius: 12px;
}

/* 让子项参与等高布局，避免跨浏览器（Chrome/Safari）高度计算不一致 */
.media-grid > * {
  height: 100%;
  min-height: 0;
}

.skills-panel {
  box-sizing: border-box;
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--gp-home-card-border);
  border-radius: 20px;
  background: var(--gp-home-card-bg);
  box-shadow: var(--gp-home-card-shadow);
}

.skills-panel > :deep(.marquee__group a) {
  width: 54px;
  height: 54px;
  margin: 0 8px;
  font-size: 40px;
}

.game-section {
  height: clamp(420px, 55vh, 680px);
}

.game-section > :deep(.coverflow-shell) {
  height: 100%;
}

@media (max-width: 768px) {
  .page {
    gap: 24px;
  }

  .media-grid {
    grid-template-columns: 1fr;
    gap: 16px;

    /* 移动端改为纵向排列，并让 Spotify 与技能面板保持相同高度 */
    height: auto;
  }

  .media-grid > * {
    height: 216px;
  }

  .game-section {
    height: 400px;
  }
}
</style>