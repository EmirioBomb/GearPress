<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { withBase } from 'vuepress/client'
import { useData } from 'vuepress-theme-plume/composables'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type DailyQuote = {
  text: string
  source: string
}

type LocaleContent = {
  casualLine: string
  about: string
  authorLine: string
  dailyLabel: string
  selectedLabel: string
  currentlyLabel: string
  statuses: { label: string, value: string, icon: string }[]
  fallbackQuote: DailyQuote
  records: { number: string, type: string, date: string, title: string, link: string, icon: string }[]
}

const { lang } = useData()
const isEnglish = computed(() => lang.value.startsWith('en'))

const content: Record<'zh' | 'en', LocaleContent> = {
  zh: {
    casualLine: '日积月累，终见其深',
    about: '关于我',
    authorLine: 'by Emirio',
    dailyLabel: '每日一句',
    selectedLabel: '你可能会喜欢',
    currentlyLabel: '最近',
    statuses: [
      { label: '研究中', value: 'AI Agent', icon: 'lucide:flask-conical' },
      { label: '游玩中', value: '传说系列', icon: 'lucide:gamepad-2' },
      { label: '开发中', value: 'GearPress', icon: 'lucide:code-2' },
      { label: '听着', value: 'Spotify', icon: 'lucide:headphones' },
    ],
    fallbackQuote: {
      text: '慢一点，把真正想留下的东西做好。',
      source: '— 今天也留一点空白给自己',
    },
    records: [
      { number: '01', type: 'NOTE', date: '05.07', title: '命令速查', link: '/notes/vcs/git/git/', icon: 'lucide:terminal' },
      { number: '02', type: 'BLOG', date: '05.15', title: '个性签名卡片', link: '/blog/profile-card/', icon: 'lucide:id-card' },
      { number: '03', type: 'NOTE', date: '05.29', title: 'Homebrew', link: '/notes/macos/homebrew/', icon: 'lucide:package-open' },
      { number: '04', type: 'BLOG', date: '05.14', title: 'Spotify 网页播放器', link: '/blog/spotify-embedded/', icon: 'lucide:audio-lines' },
      { number: '05', type: 'NOTE', date: '04.28', title: 'jsDelivr', link: '/notes/network/cdn/js-delivr/', icon: 'lucide:globe-2' },
    ],
  },
  en: {
    casualLine: 'Building & Keeping',
    about: 'About me',
    authorLine: 'by Emirio',
    dailyLabel: 'DAILY NOTE',
    selectedLabel: 'You might like',
    currentlyLabel: 'CURRENTLY',
    statuses: [
      { label: 'Researching', value: 'AI agents', icon: 'lucide:flask-conical' },
      { label: 'Playing', value: 'Tales Series', icon: 'lucide:gamepad-2' },
      { label: 'Building', value: 'GearPress', icon: 'lucide:code-2' },
      { label: 'Listening', value: 'Spotify', icon: 'lucide:headphones' },
    ],
    fallbackQuote: {
      text: 'Take it slower, and make the things worth keeping.',
      source: '— leaving a little room for today',
    },
    records: [
      { number: '01', type: 'NOTE', date: '05.07', title: 'Cheat Sheet', link: '/en/notes/vcs/git/git/', icon: 'lucide:terminal' },
      { number: '02', type: 'BLOG', date: '05.15', title: 'Profile Card', link: '/en/blog/profile-card/', icon: 'lucide:id-card' },
      { number: '03', type: 'NOTE', date: '05.29', title: 'Homebrew', link: '/en/notes/macos/homebrew/', icon: 'lucide:package-open' },
      { number: '04', type: 'BLOG', date: '05.14', title: 'Spotify Embedded Player', link: '/en/blog/spotify-embedded/', icon: 'lucide:audio-lines' },
      { number: '05', type: 'NOTE', date: '04.29', title: 'jsDelivr', link: '/en/notes/network/cdn/js-delivr/', icon: 'lucide:globe-2' },
    ],
  },
}

const current = computed(() => content[isEnglish.value ? 'en' : 'zh'])
const apiQuote = ref<DailyQuote | null>(null)
const isQuoteLoading = ref(true)
const dailyQuote = computed(() => apiQuote.value ?? current.value.fallbackQuote)
let quoteRequestController: AbortController | undefined

function isHitokotoResponse(value: unknown): value is { hitokoto: string, from?: string, from_who?: string } {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const data = value as Record<string, unknown>
  return typeof data.hitokoto === 'string' && data.hitokoto.trim().length > 0
}

async function loadDailyQuote() {
  quoteRequestController?.abort()
  const controller = new AbortController()
  quoteRequestController = controller
  const timeout = window.setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch('https://v1.hitokoto.cn/', { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Hitokoto request failed with status ${response.status}`)
    }

    const data: unknown = await response.json()
    if (!isHitokotoResponse(data)) {
      throw new Error('Hitokoto response did not contain a quote')
    }

    const source = [data.from, data.from_who].filter(Boolean).join(' / ')
    apiQuote.value = {
      text: data.hitokoto.trim(),
      source: source ? `— ${source}` : (isEnglish.value ? '— Hitokoto' : '— 一言'),
    }
  }
  catch {
    apiQuote.value = null
  }
  finally {
    window.clearTimeout(timeout)
    isQuoteLoading.value = false
    if (quoteRequestController === controller) {
      quoteRequestController = undefined
    }
  }
}

onMounted(() => {
  void loadDailyQuote()
})

onBeforeUnmount(() => {
  quoteRequestController?.abort()
})
</script>

<template>
  <main class="gear-home">
    <section class="gear-home-identity" aria-labelledby="gear-home-title">
      <img class="gear-home-logo" :src="withBase('/logo.svg')" alt="" aria-hidden="true" no-view>
      <h1 id="gear-home-title">GearPress</h1>
      <p class="gear-home-casual-line">{{ current.casualLine }}</p>
      <div class="gear-home-actions">
        <a class="gear-home-button gear-home-button-primary" :href="withBase(isEnglish ? '/en/notes/about-me/' : '/notes/about-me/')">
          {{ current.about }}
        </a>
        <a class="gear-home-button gear-home-button-secondary" href="https://github.com/EmirioBomb/GearPress" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <p class="gear-home-author"><span>{{ current.authorLine }}</span></p>
    </section>

    <section class="gear-home-desk" aria-label="GearPress home highlights">
      <article class="gear-home-daily-note" :class="{ 'is-loading': isQuoteLoading }" :aria-busy="isQuoteLoading">
        <div class="gear-home-daily-rule" aria-hidden="true" />
        <p class="gear-home-eyebrow">{{ current.dailyLabel }}</p>
        <p class="gear-home-quote" aria-live="polite">“{{ dailyQuote.text }}”</p>
        <p class="gear-home-quote-source">{{ dailyQuote.source }}</p>
        <span class="gear-home-quote-mark" aria-hidden="true">“</span>
      </article>

      <div class="gear-home-selected-heading">
        <p class="gear-home-eyebrow">{{ current.selectedLabel }}</p>
      </div>

      <div class="gear-home-records" aria-label="Selected notes">
        <a
          v-for="record in current.records"
          :key="record.number"
          class="gear-home-record"
          :href="withBase(record.link)"
        >
          <span class="gear-home-record-spine" aria-hidden="true" />
          <span class="gear-home-record-disc" aria-hidden="true">
            <Icon :icon="record.icon" />
          </span>
          <span class="gear-home-record-copy">
            <span class="gear-home-record-meta">{{ record.number }}　{{ record.type }} / {{ record.date }}</span>
            <span class="gear-home-record-title">{{ record.title }}</span>
          </span>
          <span class="gear-home-record-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div class="gear-home-currently">
        <div class="gear-home-currently-heading">
          <span class="gear-home-eyebrow">{{ current.currentlyLabel }}</span>
          <span class="gear-home-currently-line" aria-hidden="true" />
        </div>
        <div class="gear-home-status-rail">
          <div v-for="status in current.statuses" :key="status.label" class="gear-home-status">
            <span class="gear-home-status-icon"><Icon :icon="status.icon" aria-hidden="true" /></span>
            <span class="gear-home-status-copy">
              <strong>{{ status.label }}</strong>
              <small>{{ status.value }}</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(.gear-home-page .vp-home-custom) {
  width: 100%;
  padding: 0;
  background: transparent;
}

:global(.gear-home-page .vp-home-custom > .container) {
  width: 100%;
  max-width: none;
  padding: 0;
}

:global(.gear-home-page .vp-home-custom .vp-doc) {
  max-width: none;
  padding: 0;
  margin: 0;
}

.gear-home {
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.58fr);
  gap: clamp(48px, 7vw, 112px);
  width: min(100%, 1320px);
  height: calc(100vh - var(--vp-nav-height));
  min-height: 0;
  padding: clamp(24px, 4vh, 48px) clamp(28px, 6vw, 100px);
  margin: 0 auto;
  overflow: hidden;
  color: var(--vp-c-text-1);
}

.gear-home-identity {
  position: relative;
  align-self: center;
  min-width: 0;
  text-align: center;
  transform: translateY(-1vh);
}

.gear-home-identity::after {
  position: absolute;
  top: -12%;
  right: calc(clamp(48px, 7vw, 112px) / -2);
  bottom: -12%;
  width: 2px;
  background: linear-gradient(to bottom, transparent, var(--gp-home-divider) 12%, var(--gp-home-divider) 88%, transparent);
  content: '';
}

.gear-home-logo {
  display: block;
  width: clamp(180px, 17vw, 250px);
  height: auto;
  margin: 0 auto 18px;
}

.gear-home-identity h1 {
  width: fit-content;
  padding-inline: 0.04em;
  margin: 0 auto;
  font-size: clamp(42px, 4.4vw, 62px);
  font-weight: 750;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: transparent;
  background: var(--gp-gradient-readable);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gear-home-casual-line {
  margin: 12px 0 0;
  font-size: 15px;
  color: var(--gp-home-muted);
}

.gear-home-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.gear-home-button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 116px;
  height: 42px;
  padding: 0 18px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
  border-radius: 11px;
  box-shadow: 0 6px 16px rgb(32 52 75 / 0.18);
  transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1), filter 260ms ease, box-shadow 320ms cubic-bezier(0.4, 0, 0.2, 1), background-position 320ms ease;
}

.gear-home-button::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  padding: 1px;
  pointer-events: none;
  background: var(--gp-gradient-readable);
  border-radius: inherit;
  opacity: 0;
  content: '';
  transition: opacity 260ms ease;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.gear-home-button:hover,
.gear-home-button:focus-visible {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgb(32 52 75 / 0.24);
}

.gear-home-button:hover::before,
.gear-home-button:focus-visible::before {
  opacity: 1;
}

.gear-home-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 3px;
}

.gear-home-button-primary {
  color: #fff;
  background: var(--gp-gradient-readable);
  background-position: 0 50%;
  background-size: 140% 100%;
  border: 1px solid var(--gp-home-button-border);
  box-shadow: var(--gp-shadow), 0 6px 16px rgb(32 52 75 / 0.18);
}

.gear-home-button-primary:hover,
.gear-home-button-primary:focus-visible {
  color: #fff;
  background-position: 100% 50%;
  filter: brightness(1.06) saturate(1.08);
  box-shadow: var(--gp-shadow), 0 10px 24px rgb(32 52 75 / 0.24);
}

.gear-home-button-secondary {
  color: var(--gp-home-button-secondary-text);
  background: var(--gp-home-button-secondary-bg);
  border: 1px solid var(--gp-home-button-border);
  box-shadow: var(--gp-shadow), 0 6px 16px rgb(32 52 75 / 0.12);
}

.gear-home-button-secondary:hover,
.gear-home-button-secondary:focus-visible {
  color: var(--gp-home-button-secondary-text);
  box-shadow: var(--gp-shadow), 0 10px 24px rgb(32 52 75 / 0.18);
}

.gear-home-author {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(100%, 250px);
  margin: 18px auto 0;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.gear-home-author > span {
  color: transparent;
  background: var(--gp-gradient-readable);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gear-home-author::before,
.gear-home-author::after {
  height: 1px;
  flex: 1;
  background: var(--gp-home-divider);
  content: '';
}

.gear-home-desk {
  align-self: center;
  min-width: 0;
}

.gear-home-daily-note {
  position: relative;
  min-height: 104px;
  padding: 20px 24px 16px;
  overflow: hidden;
  color: var(--gp-home-text);
  background: var(--gp-home-card-bg);
  border: 1px solid var(--gp-home-card-border);
  border-radius: 16px;
  box-shadow: var(--gp-home-card-shadow);
  backdrop-filter: blur(14px);
  transition: border-color 380ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 380ms cubic-bezier(0.4, 0, 0.2, 1), transform 380ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-backdrop-filter: blur(14px);
}

.gear-home-daily-note:hover {
  box-shadow: 0 12px 28px rgb(42 67 89 / 0.18);
  transform: translateY(-2px);
}

.gear-home-daily-rule {
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: var(--gp-gradient-readable);
  background-size: 180% 100%;
}

.gear-home-daily-note.is-loading .gear-home-daily-rule {
  animation: gear-home-quote-loading 1.8s ease-in-out infinite;
}

@keyframes gear-home-quote-loading {
  0%,
  100% {
    background-position: 0 50%;
    opacity: 0.7;
  }

  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gear-home-daily-note.is-loading .gear-home-daily-rule {
    animation: none;
  }
}

.gear-home-eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--gp-home-meta);
}

.gear-home-quote {
  position: relative;
  z-index: 1;
  max-width: 100%;
  padding-right: 64px;
  margin: 11px 0 6px;
  font-size: clamp(16px, 1.5vw, 18px);
  font-weight: 560;
  line-height: 1.65;
  letter-spacing: 0.01em;
  color: var(--gp-home-text);
  text-wrap: balance;
}

.gear-home-quote-source {
  max-width: calc(100% - 64px);
  margin: 0;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.4;
  color: var(--gp-home-muted);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.gear-home-quote-mark {
  position: absolute;
  right: 22px;
  bottom: -2px;
  pointer-events: none;
  font-family: Georgia, serif;
  font-size: 72px;
  line-height: 1;
  color: var(--gp-icon-highlight);
  opacity: 0.14;
}

.gear-home-selected-heading {
  padding-top: 14px;
  margin: 18px 0 8px;
  border-top: 2px solid var(--gp-home-divider);
}

.gear-home-records {
  display: grid;
  gap: 4px;
}

.gear-home-record {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 48px;
  overflow: hidden;
  color: var(--gp-home-text);
  text-decoration: none;
  background: var(--gp-home-card-bg);
  border: 1px solid var(--gp-home-card-border);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgb(42 67 89 / 0.12);
  transition: box-shadow 360ms cubic-bezier(0.4, 0, 0.2, 1), transform 360ms cubic-bezier(0.4, 0, 0.2, 1);
}

.gear-home-record::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  padding: 1px;
  pointer-events: none;
  background: var(--gp-gradient-readable);
  border-radius: inherit;
  opacity: 0;
  content: '';
  transition: opacity 280ms ease;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.gear-home-record:nth-child(even) {
  background: var(--gp-home-card-bg-alt);
}

.gear-home-record:hover,
.gear-home-record:focus-visible {
  color: var(--gp-home-text);
  text-decoration: none;
  box-shadow: 0 9px 20px rgb(42 67 89 / 0.20);
  transform: translate3d(2px, -1px, 0);
}

.gear-home-record:hover::before,
.gear-home-record:focus-visible::before {
  opacity: 1;
}

.gear-home-record:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 2px;
}

.gear-home-record-spine {
  align-self: stretch;
  width: 8px;
  flex: 0 0 8px;
  background: var(--gp-gradient-readable);
}

.gear-home-record-disc {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  margin: 0 11px 0 13px;
  color: var(--gp-home-icon-color);
  background: var(--gp-home-icon-bg);
  border: 1px solid var(--gp-home-icon-border);
  border-radius: 8px;
  transform: rotate(-3deg);
}

.gear-home-record:nth-child(2) .gear-home-record-disc {
  transform: rotate(3deg);
}

.gear-home-record:nth-child(3) .gear-home-record-disc {
  transform: rotate(-5deg);
}

.gear-home-record:nth-child(4) .gear-home-record-disc {
  transform: rotate(4deg);
}

.gear-home-record:nth-child(5) .gear-home-record-disc {
  transform: rotate(-2deg);
}

.gear-home-record-disc :deep(svg) {
  width: 14px;
  height: 14px;
}

.gear-home-record-copy {
  display: grid;
  gap: 1px;
  min-width: 0;
  transform: translateY(-2px);
}

.gear-home-record-meta {
  overflow: hidden;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--gp-home-meta);
}

.gear-home-record-title {
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  font-size: 15px;
  font-weight: 680;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--gp-home-text);
}

.gear-home-record:hover .gear-home-record-title,
.gear-home-record:focus-visible .gear-home-record-title {
  color: transparent;
  background: var(--gp-gradient-readable);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gear-home-record-arrow {
  margin: 0 22px 0 auto;
  font-size: 19px;
  color: var(--gp-icon-highlight);
}

.gear-home-currently {
  margin-top: 14px;
}

.gear-home-currently-heading {
  display: flex;
  align-items: center;
  gap: 18px;
}

.gear-home-currently-line {
  height: 2px;
  flex: 1;
  background: repeating-linear-gradient(to right, var(--gp-home-divider) 0 3px, transparent 3px 10px);
}

.gear-home-status-rail {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 8px;
  padding-top: 9px;
  border-top: 2px solid var(--gp-home-divider);
}

.gear-home-status {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding-right: 12px;
  border-right: 1px solid var(--gp-home-divider);
}

.gear-home-status:last-child {
  padding-right: 0;
  border-right: 0;
}

.gear-home-status-icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  color: var(--gp-home-icon-color);
  background: var(--gp-home-icon-bg);
  border: 1px solid var(--gp-home-icon-border);
  border-radius: 8px;
  transform: rotate(-4deg);
}

.gear-home-status:nth-child(even) .gear-home-status-icon {
  color: var(--gp-home-icon-purple);
  border-color: var(--gp-home-icon-purple-border);
  transform: rotate(4deg);
}

.gear-home-status-icon :deep(svg) {
  width: 13px;
  height: 13px;
}

.gear-home-status-copy {
  display: grid;
  min-width: 0;
}

.gear-home-status-copy strong,
.gear-home-status-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gear-home-status-copy strong {
  font-size: 12px;
  font-weight: 650;
  color: var(--gp-home-text);
}

.gear-home-status-copy small {
  margin-top: 3px;
  font-size: 11px;
  color: var(--gp-home-muted);
}

@media (prefers-reduced-motion: reduce) {
  .gear-home-button,
  .gear-home-daily-note,
  .gear-home-record,
  .gear-home-button::before,
  .gear-home-record::before {
    transition-duration: 0.01ms;
  }

  .gear-home-button:hover,
  .gear-home-button:focus-visible,
  .gear-home-daily-note:hover,
  .gear-home-record:hover,
  .gear-home-record:focus-visible {
    transform: none;
  }
}

@media (max-width: 960px) {
  .gear-home {
    height: auto;
    min-height: calc(100vh - var(--vp-nav-height));
    overflow: visible;
    grid-template-columns: 1fr;
    gap: 64px;
    padding-top: 72px;
    padding-bottom: 72px;
  }

  .gear-home-identity::after {
    display: none;
  }

  .gear-home-identity {
    max-width: 520px;
    margin: 0 auto;
    text-align: center;
    transform: none;
  }

  .gear-home-logo,
  .gear-home-identity h1 {
    margin-right: auto;
    margin-left: auto;
  }

  .gear-home-actions {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .gear-home {
    gap: 40px;
    padding: 56px 20px 40px;
  }

  .gear-home-logo {
    width: 176px;
    margin-bottom: 22px;
  }

  .gear-home-identity h1 {
    font-size: 43px;
  }

  .gear-home-selected-heading {
    margin-top: 30px;
  }

  .gear-home-record {
    min-height: 60px;
  }

  .gear-home-record-disc {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
    margin-right: 12px;
    margin-left: 14px;
  }

  .gear-home-record-title {
    font-size: 14px;
  }

  .gear-home-record-arrow {
    margin-right: 13px;
  }

  .gear-home-status-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 16px;
  }
}
</style>
