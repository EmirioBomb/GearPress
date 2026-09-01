<template>
  <section class="about-profile-panel" aria-labelledby="about-profile-title">
    <div class="profile-copy">
      <p class="eyebrow">{{ isEnglish ? 'PERSONAL PROFILE' : '个人资料' }}</p>
      <h1 id="about-profile-title">
        {{ isEnglish ? 'Just figuring things out as I go.' : '日积月累，终见其深' }}
      </h1>
      <div class="profile-description">
        <p>
          {{ isEnglish
            ? 'I’m Emirio. I like coding, games, and music. Most of the time, I write code and make notes about what I’m learning and experimenting with.'
            : '我是 Emirio，一个喜欢编程、游戏和音乐的普通人。平时写代码，也记录开发、学习和折腾中积累的经验。' }}
        </p>
        <p>
          {{ isEnglish
            ? 'When I’m not doing that, I unwind with games or music, and curiosity often leads me to try new tools and different ways of doing things. I’m simply taking my time, learning at my own pace, and building a life around what matters to me.'
            : '闲下来会用游戏和音乐放松，也会因好奇心研究新工具、尝试不同的做事方式。不追求成为多么厉害的人，只想专注真正喜欢的事，按自己的节奏持续学习，安稳过好普通生活。' }}
        </p>
      </div>

        <div class="profile-stats" :aria-label="isEnglish ? 'Profile statistics' : '个人资料统计'">
          <div class="stat">
            <strong>{{ blogCount }}</strong>
            <span>{{ isEnglish ? 'Blog' : '博客' }}</span>
          </div>
          <div class="stat">
            <strong>{{ noteCount }}</strong>
            <span>{{ isEnglish ? 'Posts' : '随记' }}</span>
          </div>
          <div class="stat">
            <strong>{{ gameCount }}</strong>
            <span>{{ isEnglish ? 'Games' : '游戏' }}</span>
          </div>
          <div class="stat">
            <strong>{{ languageCount }}</strong>
            <span>{{ isEnglish ? 'Languages' : '语言' }}</span>
          </div>
          <div class="stat">
            <strong>{{ toolCount }}</strong>
            <span>{{ isEnglish ? 'Tools' : '工具' }}</span>
          </div>
        </div>
    </div>

    <div class="profile-visual" :aria-label="isEnglish ? 'GearPress profile' : 'GearPress 个人资料'">
      <div class="logo-frame">
        <img
          src="/logo.svg"
          class="logo-image is-static"
          alt="GearPress logo"
          draggable="false"
        />
      </div>
      <div class="profile-name">GearPress</div>
      <div class="profile-role">{{ isEnglish ? 'developer · gamer · music lover' : '开发者 · 游戏爱好者 · 音乐爱好者' }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vuepress-theme-plume/composables'

const props = defineProps<{
  blogCount: number
  noteCount: number
  gameCount: number
  languageCount: number
  toolCount: number
}>()

const { lang } = useData()
const isEnglish = computed(() => lang.value.startsWith('en'))
</script>

<style scoped>
.about-profile-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(176px, 0.5fr);
  gap: clamp(12px, 2vw, 22px);
  align-items: center;
  padding: clamp(12px, 1.5vw, 16px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--gp-home-card-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--gp-home-card-shadow);
}

.profile-copy {
  min-width: 0;
  max-width: 650px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--gp-icon-highlight);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.4;
}

h1 {
  margin: 0;
  max-width: 620px;
  font-size: clamp(24px, 2.7vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.045em;
}

.profile-description {
  max-width: 540px;
  margin: 11px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.profile-description p {
  margin: 0;
}

.profile-description p + p {
  margin-top: 8px;
}

.profile-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 10px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}

.stat {
  display: flex;
  min-width: 56px;
  flex-direction: column;
  gap: 2px;
}

.stat strong {
  color: var(--vp-c-brand-1);
  font-size: 18px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat span {
  color: var(--vp-c-text-2);
  font-size: 10px;
  line-height: 1.2;
}

.profile-visual {
  position: relative;
  display: flex;
  min-height: 0;
  padding: 4px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  border-radius: 16px;
  background: transparent;
}

.profile-visual::before {
  position: absolute;
  top: 12%;
  bottom: 12%;
  left: 0;
  width: 1px;
  content: '';
  background: var(--vp-c-divider);
}

.logo-frame {
  display: grid;
  width: clamp(148px, 13vw, 168px);
  height: clamp(148px, 13vw, 168px);
  place-items: center;
  overflow: hidden;
  border: 0;
  border-radius: 50%;
  background: transparent;
}

.logo-frame img {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: contain;
  object-position: 50% 50%;
}

.profile-name {
  color: transparent;
  background: var(--gp-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  font-size: 19px;
  font-weight: 800;
}

.profile-role {
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.is-static {
  pointer-events: none;
  user-select: none;
}

@media (max-width: 640px) {
  .about-profile-panel {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .profile-visual {
    min-height: 168px;
  }

  .profile-visual::before {
    display: none;
  }

  .logo-frame {
    width: clamp(148px, 42vw, 168px);
    height: clamp(148px, 42vw, 168px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-profile-panel,
  .logo-frame {
    transition: none;
  }
}
</style>