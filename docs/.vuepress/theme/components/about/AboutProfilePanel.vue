<template>
  <section class="about-profile-panel" aria-labelledby="about-profile-title">
    <div class="profile-copy">
      <p class="eyebrow">{{ isEnglish ? 'PERSONAL PROFILE' : '个人资料' }}</p>
      <h1 id="about-profile-title">
        {{ isEnglish ? 'Just figuring things out as I go.' : '踩过的坑，看过的东西' }}
      </h1>
      <div class="profile-description">
        <p>
          {{ isEnglish
            ? 'I’m Emirio. I like coding, games, and music.'
            : '我是 Emirio，一个喜欢编程、游戏和音乐的普通人。' }}
        </p>
        <p>
          {{ isEnglish
            ? 'Most of the time, you’ll find me writing code or making notes about whatever I’m learning and messing around with. When I’m not doing that, I’m happy to switch off for a while with a game or some music. And if something catches my interest, I’ll probably end up trying a new tool or doing things a different way.'
            : '平时写代码，也会记录开发、学习和折腾过程中积累下来的经验。生活里有时喜欢安静地躺平，享受游戏与音乐带来的放松；有时也会因为一点好奇心，去研究新的工具，尝试不同的做事方式。' }}
        </p>
        <p>
          {{ isEnglish
            ? 'I’m not in a rush to become anything in particular. I just want to spend my time on things I enjoy, keep learning at my own pace, and make a decent life out of the things that matter to me.'
            : '不追求成为多么厉害的人，只希望专注于自己真正喜欢的事情，在持续学习和偶尔折腾中慢慢积累，安稳地过好属于自己的普通生活。' }}
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
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
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
  gap: 10px;
  margin: 12px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
}

.stat {
  display: flex;
  min-width: 70px;
  flex-direction: column;
  gap: 4px;
}

.stat strong {
  color: var(--vp-c-brand-1);
  font-size: 19px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat span {
  color: var(--vp-c-text-2);
  font-size: 10px;
}

.profile-visual {
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

@media (max-width: 760px) {
  .about-profile-panel {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 18px 16px;
  }

  .profile-visual {
    min-height: 190px;
  }

  .logo-frame {
    width: 168px;
    height: 168px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-profile-panel,
  .logo-frame {
    transition: none;
  }
}
</style>