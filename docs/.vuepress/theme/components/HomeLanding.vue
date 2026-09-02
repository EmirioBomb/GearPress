<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { routes } from '@internal/routes'
import { withBase } from 'vuepress/client'
import { useData, usePostsData } from 'vuepress-theme-plume/composables'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type DailyQuote = {
  text: string
  source: string
}

type ArticleRecord = {
  number: string
  type: string
  date: string
  title: string
  link: string
  icon: string
}

type ArticleCandidate = Omit<ArticleRecord, 'number'> & {
  source: 'note' | 'blog'
}

type LocaleContent = {
  casualLine: string
  about: string
  navigation: string
  authorLine: string
  dailyLabel: string
  selectedLabel: string
  currentlyLabel: string
  noteLabel: string
  blogLabel: string
  emptyLabel: string
  statuses: { label: string, value: string, icon: string, href?: string }[]
  fallbackQuote: DailyQuote
}

const { lang } = useData()
const isEnglish = computed(() => lang.value.startsWith('en'))

const content: Record<'zh' | 'en', LocaleContent> = {
  zh: {
    casualLine: '日积月累，终见其深',
    about: '关于我',
    navigation: '导航',
    authorLine: 'by Emirio',
    dailyLabel: '每日一句',
    selectedLabel: '我的随记',
    currentlyLabel: '最近',
    noteLabel: '随记',
    blogLabel: '博客',
    emptyLabel: '暂无可展示文章',
    statuses: [
      { label: '研究中', value: 'AI Agent', icon: 'lucide:flask-conical' },
      { label: '游玩中', value: '传说系列', icon: 'lucide:gamepad-2', href: 'https://tales-ch.jp/' },
      { label: '开发中', value: 'GearPress', icon: 'lucide:code-2' },
      { label: '听着', value: 'Spotify', icon: 'lucide:headphones', href: 'https://open.spotify.com/playlist/50zTqYDKkup6TbU3TFpdN3' },
    ],
    fallbackQuote: {
      text: '慢一点，把真正想留下的东西做好。',
      source: '— 今天也留一点空白给自己',
    },
  },
  en: {
    casualLine: 'Building & Keeping',
    about: 'About me',
    navigation: 'Navigation',
    authorLine: 'by Emirio',
    dailyLabel: 'DAILY NOTE',
    selectedLabel: 'My Posts',
    currentlyLabel: 'CURRENTLY',
    noteLabel: 'NOTE',
    blogLabel: 'BLOG',
    emptyLabel: 'No articles available',
    statuses: [
      { label: 'Researching', value: 'AI agents', icon: 'lucide:flask-conical' },
      { label: 'Playing', value: 'Tales Series', icon: 'lucide:gamepad-2', href: 'https://tales-ch.jp/' },
      { label: 'Building', value: 'GearPress', icon: 'lucide:code-2' },
      { label: 'Listening', value: 'Spotify', icon: 'lucide:headphones', href: 'https://open.spotify.com/playlist/50zTqYDKkup6TbU3TFpdN3' },
    ],
    fallbackQuote: {
      text: 'Take it slower, and make the things worth keeping.',
      source: '— leaving a little room for today',
    },
  },
}

const current = computed(() => content[isEnglish.value ? 'en' : 'zh'])
const postsData = usePostsData()
const selectedRecords = ref<ArticleRecord[]>([])
const isRecordsLoading = ref(true)
const isHomeMounted = ref(false)
const apiQuote = ref<DailyQuote | null>(null)
const isQuoteLoading = ref(true)
const dailyQuote = computed(() => apiQuote.value ?? current.value.fallbackQuote)
let quoteRequestController: AbortController | undefined

const routeTable = routes as Record<string, {
  loader: () => Promise<unknown>
  meta?: { title?: string, icon?: string }
}>

type PageModule = {
  _pageData?: {
    frontmatter?: {
      title?: string
      icon?: string
      createTime?: string
      draft?: boolean
    }
  }
}

function formatArticleDate(createTime?: string) {
  const match = createTime?.match(/^(\d{4})[/-](\d{2})[/-](\d{2})/)
  return match ? `${match[1]}.${match[2]}.${match[3]}` : '—'
}

function getArticleTitle(title: string | undefined, fallback: string) {
  const value = title || fallback
  const separatorIndex = value.lastIndexOf('-')
  return separatorIndex > 0 ? value.slice(0, separatorIndex) : value
}

function getArticleCandidates(): ArticleCandidate[] {
  const localePrefix = isEnglish.value ? '/en' : ''
  const notePrefix = `${localePrefix}/notes/`
  const blogPrefix = `${localePrefix}/blog/`
  const notes = Object.entries(routeTable)
    .filter(([path]) => path.startsWith(notePrefix) && path !== `${notePrefix}about-me/`)
    .map(([path, route]) => ({
      source: 'note' as const,
      type: current.value.noteLabel,
      date: '—',
      title: getArticleTitle(route.meta?.title, path.split('/').slice(-2, -1)[0] || 'Untitled'),
      link: path,
      icon: route.meta?.icon || 'lucide:notebook-pen',
    }))
  const blogs = (postsData.value[blogPrefix] || [])
    .filter(post => !post.draft)
    .map(post => ({
      source: 'blog' as const,
      type: current.value.blogLabel,
      date: formatArticleDate(post.createTime),
      title: getArticleTitle(routeTable[post.path]?.meta?.title, post.title),
      link: post.path,
      icon: routeTable[post.path]?.meta?.icon || 'lucide:pen-line',
    }))

  return [...notes, ...blogs]
}

function shuffleArticles(records: ArticleCandidate[]) {
  const shuffled = [...records]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentPath = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = currentPath
  }
  return shuffled
}

async function resolveArticleCandidate(candidate: ArticleCandidate) {
  try {
    const module = await routeTable[candidate.link]?.loader() as PageModule | undefined
    const frontmatter = module?._pageData?.frontmatter
    if (frontmatter?.draft) {
      return null
    }

    return {
      ...candidate,
      title: getArticleTitle(frontmatter?.title, candidate.title),
      date: frontmatter?.createTime ? formatArticleDate(frontmatter.createTime) : candidate.date,
      icon: frontmatter?.icon || candidate.icon,
    }
  }
  catch {
    return candidate.source === 'blog' ? candidate : null
  }
}

async function getEligibleArticleCandidates() {
  const candidates = getArticleCandidates()
  const blogs = candidates.filter(candidate => candidate.source === 'blog')
  const notes = candidates.filter(candidate => candidate.source === 'note')
  const resolvedNotes = await Promise.all(notes.map(resolveArticleCandidate))
  return [...resolvedNotes.filter((candidate): candidate is ArticleCandidate => candidate !== null), ...blogs]
}

let articleSelectionId = 0

async function loadSelectedRecords() {
  const selectionId = ++articleSelectionId
  isRecordsLoading.value = true
  selectedRecords.value = []
  const candidates = await getEligibleArticleCandidates()
  const selected = shuffleArticles(candidates).slice(0, 5)
  const resolved = await Promise.all(selected.map(candidate => (
    candidate.source === 'blog' ? resolveArticleCandidate(candidate) : candidate
  )))

  if (isHomeMounted.value && selectionId === articleSelectionId) {
    selectedRecords.value = resolved
      .filter((record): record is ArticleCandidate => record !== null)
      .map((record, index) => ({
        number: String(index + 1).padStart(2, '0'),
        type: record.type,
        date: record.date,
        title: record.title,
        link: record.link,
        icon: record.icon,
      }))
    isRecordsLoading.value = false
  }
}

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
  isHomeMounted.value = true
  void Promise.all([loadDailyQuote(), loadSelectedRecords()])
})

watch(isEnglish, () => {
  if (isHomeMounted.value) {
    void loadSelectedRecords()
  }
})

onBeforeUnmount(() => {
  isHomeMounted.value = false
  articleSelectionId += 1
  quoteRequestController?.abort()
})
</script>

<template>
  <main class="gear-home">
    <section class="gear-home-identity" aria-labelledby="gear-home-title">
      <div class="gear-home-logo-orbit">
        <img class="gear-home-logo" :src="withBase('/logo.svg')" alt="" aria-hidden="true" no-view>
      </div>
      <h1 id="gear-home-title"><span>GearPress</span></h1>
      <p class="gear-home-casual-line">{{ current.casualLine }}</p>
      <div class="gear-home-actions">
        <a class="gear-home-button gear-home-button-primary" :href="withBase(isEnglish ? '/en/notes/about-me/' : '/notes/about-me/')">
          <Icon icon="lucide:user-round" class="gear-home-button-icon" aria-hidden="true" />
          <span>{{ current.about }}</span>
        </a>
        <a class="gear-home-button gear-home-button-secondary" :href="withBase(isEnglish ? '/en/navigation/' : '/navigation/')">
          <Icon icon="lucide:compass" class="gear-home-button-icon" aria-hidden="true" />
          <span>{{ current.navigation }}</span>
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
        <span class="gear-home-section-dot" aria-hidden="true" />
        <p class="gear-home-eyebrow">{{ current.selectedLabel }}</p>
      </div>

      <div class="gear-home-records" :aria-label="current.selectedLabel" :aria-busy="isRecordsLoading">
        <template v-if="selectedRecords.length">
          <a
            v-for="record in selectedRecords"
            :key="record.link"
            class="gear-home-record"
            :href="withBase(record.link)"
          >
            <span class="gear-home-record-spine" aria-hidden="true" />
            <span class="gear-home-record-index" aria-hidden="true">{{ record.number }}</span>
            <span class="gear-home-record-disc" aria-hidden="true">
              <Icon :icon="record.icon" />
            </span>
            <span class="gear-home-record-copy">
              <span class="gear-home-record-meta">{{ record.type }} · {{ record.date }}</span>
              <span class="gear-home-record-title">{{ record.title }}</span>
            </span>
            <span class="gear-home-record-arrow" aria-hidden="true">↗</span>
          </a>
        </template>
        <template v-else-if="isRecordsLoading">
          <div v-for="placeholder in 5" :key="placeholder" class="gear-home-record is-loading" aria-hidden="true">
            <span class="gear-home-record-spine" />
            <span class="gear-home-record-index">{{ String(placeholder).padStart(2, '0') }}</span>
            <span class="gear-home-record-skeleton" />
          </div>
        </template>
        <p v-else class="gear-home-record-empty">{{ current.emptyLabel }}</p>
      </div>

      <div class="gear-home-currently">
        <div class="gear-home-currently-heading">
          <span class="gear-home-section-dot" aria-hidden="true" />
          <span class="gear-home-eyebrow">{{ current.currentlyLabel }}</span>
        </div>
        <div class="gear-home-status-rail">
          <component
            :is="status.href ? 'a' : 'div'"
            v-for="status in current.statuses"
            :key="status.label"
            class="gear-home-status"
            :class="{ 'is-link': status.href }"
            :href="status.href"
            :target="status.href ? '_blank' : undefined"
            :rel="status.href ? 'noreferrer' : undefined"
          >
            <span class="gear-home-status-icon"><Icon :icon="status.icon" aria-hidden="true" /></span>
            <span class="gear-home-status-copy">
              <strong>{{ status.label }}</strong>
              <span class="gear-home-status-value">{{ status.value }}</span>
            </span>
            <span v-if="status.href" class="gear-home-status-arrow" aria-hidden="true">↗</span>
          </component>
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

@property --gear-home-logo-orbit-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.gear-home-logo-orbit {
  position: relative;
  display: grid;
  width: clamp(180px, 17vw, 250px);
  aspect-ratio: 290 / 255;
  place-items: center;
  margin: 0 auto 24px;
  isolation: isolate;
}

.gear-home-logo-orbit::before {
  position: absolute;
  z-index: -2;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--gp-cyan) 40%, transparent) 0%,
    color-mix(in srgb, var(--gp-blue) 25%, transparent) 40%,
    color-mix(in srgb, var(--gp-purple) 18%, transparent) 58%,
    transparent 76%
  );
  filter: blur(10px);
  opacity: 0.28;
  content: '';
  animation: gear-home-logo-halo 3.8s ease-in-out infinite;
  pointer-events: none;
}

.gear-home-logo-orbit::after {
  position: absolute;
  z-index: 0;
  inset: -10px;
  padding: 2px;
  border-radius: 50%;
  background: conic-gradient(
    from var(--gear-home-logo-orbit-angle),
    transparent 0deg 34deg,
    color-mix(in srgb, var(--gp-cyan) 45%, transparent) 46deg,
    var(--gp-cyan) 56deg,
    #eaffff 64deg,
    var(--gp-blue) 74deg,
    var(--gp-purple) 92deg,
    color-mix(in srgb, var(--gp-purple) 20%, transparent) 110deg,
    transparent 124deg 360deg
  );
  content: '';
  animation: gear-home-logo-orbit 4.8s linear infinite;
  pointer-events: none;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.gear-home-logo {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--gp-cyan) 28%, transparent)) drop-shadow(0 0 16px color-mix(in srgb, var(--gp-purple) 14%, transparent));
  animation: gear-home-logo-glow 3.8s ease-in-out infinite;
}

@keyframes gear-home-logo-halo {
  0%,
  100% {
    opacity: 0.16;
    transform: scale(1);
  }

  50% {
    opacity: 0.44;
    transform: scale(1.04);
  }
}

@keyframes gear-home-logo-orbit {
  from {
    --gear-home-logo-orbit-angle: 0deg;
  }

  to {
    --gear-home-logo-orbit-angle: 360deg;
  }
}

@keyframes gear-home-logo-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--gp-cyan) 28%, transparent)) drop-shadow(0 0 16px color-mix(in srgb, var(--gp-purple) 14%, transparent));
    transform: scale(1);
  }

  50% {
    filter: drop-shadow(0 0 10px color-mix(in srgb, var(--gp-cyan) 44%, transparent)) drop-shadow(0 0 18px color-mix(in srgb, var(--gp-purple) 21%, transparent));
    transform: scale(1.008);
  }
}

.gear-home-identity h1 {
  position: relative;
  width: fit-content;
  padding-inline: 0.04em;
  margin: 0 auto;
  font-size: clamp(42px, 4.4vw, 62px);
  font-weight: 750;
  line-height: 1.08;
  letter-spacing: -0.04em;
  isolation: isolate;
}

.gear-home-identity h1::before {
  position: absolute;
  z-index: 0;
  inset: -2% -1%;
  border-radius: 50%;
  background:
    radial-gradient(
      ellipse at 34% 50%,
      color-mix(in srgb, var(--gp-cyan) 40%, transparent) 0%,
      color-mix(in srgb, var(--gp-cyan) 16%, transparent) 30%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 68% 50%,
      color-mix(in srgb, var(--gp-purple) 32%, transparent) 0%,
      color-mix(in srgb, var(--gp-blue) 15%, transparent) 32%,
      transparent 54%
    );
  filter: blur(4px);
  opacity: 0.16;
  content: '';
  animation: gear-home-title-halo 3.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes gear-home-title-halo {
  0%,
  100% {
    filter: blur(3px);
    opacity: 0.08;
    transform: scale(1);
  }

  50% {
    filter: blur(5px);
    opacity: 0.26;
    transform: scale(1.006, 1.012);
  }
}

.gear-home-identity h1 > span {
  display: block;
  position: relative;
  z-index: 1;
  color: transparent;
  background: linear-gradient(110deg, var(--gp-cyan) 0%, var(--gp-blue) 48%, var(--gp-purple) 100%);
  background-size: 100% 100%;
  background-clip: text;
  filter:
    drop-shadow(0 0 2px color-mix(in srgb, var(--gp-cyan) 26%, transparent))
    drop-shadow(0 0 4px color-mix(in srgb, var(--gp-blue) 17%, transparent))
    drop-shadow(0 0 7px color-mix(in srgb, var(--gp-purple) 11%, transparent));
  animation: gear-home-title-glow 3.8s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes gear-home-title-glow {
  0%,
  100% {
    filter:
      drop-shadow(0 0 2px color-mix(in srgb, var(--gp-cyan) 23%, transparent))
      drop-shadow(0 0 4px color-mix(in srgb, var(--gp-blue) 14%, transparent))
      drop-shadow(0 0 6px color-mix(in srgb, var(--gp-purple) 9%, transparent));
  }

  50% {
    filter:
      drop-shadow(0 0 4px color-mix(in srgb, var(--gp-cyan) 40%, transparent))
      drop-shadow(0 0 6px color-mix(in srgb, var(--gp-blue) 25%, transparent))
      drop-shadow(0 0 9px color-mix(in srgb, var(--gp-purple) 16%, transparent));
  }
}

.gear-home-identity h1::after {
  position: absolute;
  z-index: 2;
  inset: 0;
  color: transparent;
  background-image: linear-gradient(
    110deg,
    transparent 0%,
    transparent 31%,
    color-mix(in srgb, var(--gp-cyan) 24%, transparent) 39%,
    color-mix(in srgb, var(--gp-cyan) 72%, transparent) 46%,
    #f3ffff 50%,
    color-mix(in srgb, var(--gp-blue) 72%, transparent) 55%,
    color-mix(in srgb, var(--gp-purple) 28%, transparent) 62%,
    transparent 71%,
    transparent 100%
  );
  background-size: 280% 100%;
  background-clip: text;
  content: 'GearPress';
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--gp-cyan) 16%, transparent));
  opacity: 0;
  pointer-events: none;
  animation: gear-home-title-sweep 5.6s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

@keyframes gear-home-title-sweep {
  0%,
  18%,
  100% {
    background-position: 210% 50%;
    opacity: 0;
  }

  27% {
    background-position: 150% 50%;
    opacity: 0.76;
  }

  53% {
    background-position: 30% 50%;
    opacity: 1;
  }

  82% {
    background-position: -110% 50%;
    opacity: 0;
  }
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
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 300ms ease, box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1), background-position 420ms ease;
}

@property --gear-home-border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.gear-home-button::before {
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
  content: '';
  animation: gear-home-button-border-flow 4.2s linear infinite;
  transition: opacity 260ms ease;
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

.gear-home-button-icon {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-right: 7px;
}

.gear-home-button:hover,
.gear-home-button:focus-visible {
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgb(32 52 75 / 0.21);
}

.gear-home-button:hover::before,
.gear-home-button:focus-visible::before {
  opacity: 1;
  animation-duration: 3.2s;
}

.gear-home-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 3px;
}

.gear-home-button-primary,
.gear-home-button-secondary {
  color: var(--gp-home-button-secondary-text);
  background: transparent;
  border: 2px solid color-mix(in srgb, var(--gp-blue) 38%, var(--gp-home-card-border));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 28%, transparent),
    0 0 16px color-mix(in srgb, var(--gp-blue) 14%, transparent),
    0 8px 22px rgb(32 52 75 / 0.22);
}

.gear-home-button-primary:hover,
.gear-home-button-primary:focus-visible,
.gear-home-button-secondary:hover,
.gear-home-button-secondary:focus-visible {
  color: var(--gp-home-button-secondary-text);
  background: var(--gp-gradient-soft);
  filter: none;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 42%, transparent),
    0 0 20px color-mix(in srgb, var(--gp-blue) 32%, transparent),
    0 12px 30px rgb(32 52 75 / 0.26);
}

/* 暗色主题使用亮色外发光，避免深色投影融入背景。 */
:global(html[data-theme="dark"] .gear-home .gear-home-button-primary),
:global(html[data-theme="dark"] .gear-home .gear-home-button-secondary) {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 40%, transparent),
    0 0 12px color-mix(in srgb, #eaffff 18%, transparent),
    0 0 24px color-mix(in srgb, var(--gp-blue) 22%, transparent),
    0 10px 26px rgb(2 8 20 / 0.45);
}

:global(html[data-theme="dark"] .gear-home .gear-home-button-primary:hover),
:global(html[data-theme="dark"] .gear-home .gear-home-button-primary:focus-visible),
:global(html[data-theme="dark"] .gear-home .gear-home-button-secondary:hover),
:global(html[data-theme="dark"] .gear-home .gear-home-button-secondary:focus-visible) {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 58%, transparent),
    0 0 14px color-mix(in srgb, #eaffff 24%, transparent),
    0 0 26px color-mix(in srgb, var(--gp-cyan) 42%, transparent),
    0 0 38px color-mix(in srgb, var(--gp-blue) 34%, transparent),
    0 14px 34px rgb(2 8 20 / 0.48);
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
  transition: border-color 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-backdrop-filter: blur(14px);
}

.gear-home-daily-note:hover {
  box-shadow: 0 10px 24px rgb(42 67 89 / 0.16);
  transform: translateY(-1px);
}

.gear-home-daily-rule {
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  overflow: hidden;
  background: color-mix(in srgb, var(--gp-home-card-border) 78%, var(--gp-cyan) 22%);
  box-shadow: 0 1px 5px color-mix(in srgb, var(--gp-cyan) 18%, transparent);
}

.gear-home-daily-note::before,
.gear-home-status-rail::after {
  position: absolute;
  z-index: 2;
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
  content: '';
  clip-path: inset(0 0 calc(100% - 3px) 0);
  animation: gear-home-button-border-flow 4.2s linear infinite;
  pointer-events: none;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
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

.gear-home-selected-heading,
.gear-home-currently-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-inline: 4px;
}

.gear-home-selected-heading {
  margin: 18px 0 8px;
}

.gear-home-section-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  background: var(--gp-gradient-readable);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgb(104 174 193 / 0.10);
  animation: gear-home-section-dot-pulse 4.5s ease-in-out infinite;
}

@keyframes gear-home-section-dot-pulse {
  0%,
  100% {
    opacity: 0.72;
    box-shadow: 0 0 0 3px rgb(104 174 193 / 0.08);
  }

  50% {
    opacity: 1;
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--gp-cyan) 18%, transparent),
      0 0 9px color-mix(in srgb, var(--gp-blue) 22%, transparent);
  }
}

.gear-home-records {
  display: grid;
  gap: 4px;
}

.gear-home-record {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 56px;
  overflow: hidden;
  color: var(--gp-home-text);
  text-decoration: none;
  background: var(--gp-home-card-bg);
  border: 1px solid var(--gp-home-card-border);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgb(42 67 89 / 0.12);
  transition: border-color 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gear-home-record::before {
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

.gear-home-record.is-loading {
  pointer-events: none;
}

.gear-home-record:hover,
.gear-home-record:focus-visible {
  color: var(--gp-home-text);
  text-decoration: none;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 18%, transparent),
    0 8px 22px rgb(42 67 89 / 0.18);
  transform: translateY(-1px);
}

.gear-home-record:hover::before,
.gear-home-record:focus-visible::before {
  opacity: 1;
  animation: gear-home-button-border-flow 3.6s linear infinite;
}

.gear-home-record:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 2px;
}

.gear-home-record-spine {
  align-self: stretch;
  width: 4px;
  flex: 0 0 4px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--gp-cyan) 78%, var(--gp-home-card-border)) 0%,
    color-mix(in srgb, var(--gp-blue) 74%, var(--gp-home-card-border)) 52%,
    color-mix(in srgb, var(--gp-purple) 70%, var(--gp-home-card-border)) 100%
  );
  transition: filter 260ms ease, opacity 260ms ease;
}

.gear-home-record:hover .gear-home-record-spine,
.gear-home-record:focus-visible .gear-home-record-spine {
  filter: brightness(1.12);
  opacity: 1;
}

.gear-home-record-index {
  width: 28px;
  flex: 0 0 28px;
  margin-left: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
  color: var(--gp-home-meta);
  opacity: 0.65;
}

.gear-home-record-disc {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  margin: 0 11px 0 8px;
  color: var(--gp-home-icon-color);
  background: var(--gp-home-icon-bg);
  border: 1px solid var(--gp-home-icon-border);
  border-radius: 8px;
}

.gear-home-record-disc :deep(svg) {
  width: 14px;
  height: 14px;
}

.gear-home-record-skeleton {
  width: min(42%, 220px);
  height: 10px;
  margin-left: 10px;
  border-radius: 999px;
  background: var(--gp-home-divider);
  opacity: 0.7;
  animation: gear-home-record-loading 1.5s ease-in-out infinite;
}

.gear-home-record-empty {
  min-height: 56px;
  padding: 18px 20px;
  margin: 0;
  font-size: 13px;
  color: var(--gp-home-meta);
  border: 1px dashed var(--gp-home-card-border);
  border-radius: 12px;
}

@keyframes gear-home-record-loading {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 0.85;
  }
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

.gear-home-status-rail {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 8px;
  overflow: hidden;
  background: var(--gp-home-card-bg);
  border: 1px solid var(--gp-home-card-border);
  border-radius: 14px;
  box-shadow: 0 6px 16px rgb(42 67 89 / 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.gear-home-status-rail::before {
  position: absolute;
  z-index: 1;
  inset: 0 0 auto;
  height: 3px;
  pointer-events: none;
  background: color-mix(in srgb, var(--gp-blue) 28%, var(--gp-home-card-border));
  box-shadow: 0 1px 7px color-mix(in srgb, var(--gp-cyan) 22%, transparent);
  opacity: 0.88;
  content: '';
}

.gear-home-status {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 58px;
  padding: 11px 13px 10px;
  color: var(--gp-home-text);
  text-decoration: none;
  border: 1px solid transparent;
  transition: color 220ms ease, background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.gear-home-status:not(:last-child)::after {
  position: absolute;
  top: 12px;
  right: 0;
  bottom: 12px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gp-home-divider) 22%, var(--gp-home-divider) 78%, transparent);
  content: '';
}

.gear-home-status.is-link {
  cursor: pointer;
}

.gear-home-status.is-link::before {
  position: absolute;
  z-index: 2;
  inset: 1px;
  padding: 1px;
  pointer-events: none;
  background: conic-gradient(
    from var(--gear-home-border-angle),
    transparent 0deg 36deg,
    color-mix(in srgb, var(--gp-cyan) 46%, transparent) 47deg,
    var(--gp-cyan) 57deg,
    #eaffff 65deg,
    var(--gp-blue) 75deg,
    var(--gp-purple) 93deg,
    color-mix(in srgb, var(--gp-purple) 20%, transparent) 113deg,
    transparent 130deg 360deg
  );
  content: '';
  opacity: 0;
  transition: opacity 220ms ease, filter 220ms ease;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.gear-home-status.is-link:hover,
.gear-home-status.is-link:focus-visible {
  z-index: 1;
  color: var(--gp-home-text);
  text-decoration: none;
  background: color-mix(in srgb, var(--gp-blue) 7%, var(--gp-home-card-bg));
  border-color: transparent;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gp-cyan) 14%, transparent);
}

.gear-home-status.is-link:hover::before,
.gear-home-status.is-link:focus-visible::before {
  opacity: 0.78;
  animation: gear-home-button-border-flow 3.6s linear infinite;
}

:global(html[data-theme="dark"] .gear-home .gear-home-status.is-link:hover::before),
:global(html[data-theme="dark"] .gear-home .gear-home-status.is-link:focus-visible::before) {
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--gp-cyan) 24%, transparent));
  opacity: 0.92;
}

.gear-home-status.is-link:focus-visible {
  z-index: 2;
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: -3px;
}

.gear-home-status-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  color: var(--gp-home-icon-color);
  background: var(--gp-home-icon-bg);
  border: 1px solid var(--gp-home-icon-border);
  border-radius: 9px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06);
  transition: background 220ms ease, border-color 220ms ease, box-shadow 220ms ease, color 220ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gear-home-status.is-link:hover .gear-home-status-icon,
.gear-home-status.is-link:focus-visible .gear-home-status-icon {
  color: var(--gp-icon-highlight);
  background: var(--gp-home-icon-bg);
  border-color: var(--gp-icon-highlight);
  box-shadow: 0 0 10px color-mix(in srgb, var(--gp-cyan) 16%, transparent);
  transform: scale(1.04);
}

/* 亮色主题不填充状态项和图标，只显示跑马灯与描边反馈。 */
:global(html:not([data-theme="dark"]) .gear-home .gear-home-status.is-link:hover),
:global(html:not([data-theme="dark"]) .gear-home .gear-home-status.is-link:focus-visible) {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

:global(html:not([data-theme="dark"]) .gear-home .gear-home-status.is-link:hover::before),
:global(html:not([data-theme="dark"]) .gear-home .gear-home-status.is-link:focus-visible::before) {
  filter: none;
  opacity: 0.62;
}

:global(html:not([data-theme="dark"]) .gear-home .gear-home-status.is-link:hover .gear-home-status-icon),
:global(html:not([data-theme="dark"]) .gear-home .gear-home-status.is-link:focus-visible .gear-home-status-icon) {
  color: var(--gp-icon-highlight);
  background: transparent;
  border-color: var(--gp-icon-highlight);
  box-shadow: none;
}

.gear-home-status-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.gear-home-status-copy strong,
.gear-home-status-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gear-home-status-copy strong {
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.07em;
  color: var(--gp-home-meta);
}

.gear-home-status-value {
  font-size: 12px;
  font-weight: 650;
  line-height: 1.25;
  color: var(--gp-home-text);
}

.gear-home-status-arrow {
  flex: 0 0 auto;
  margin-left: auto;
  font-size: 13px;
  color: var(--gp-icon-highlight);
  opacity: 0.52;
  transition: opacity 220ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gear-home-status.is-link:hover .gear-home-status-arrow,
.gear-home-status.is-link:focus-visible .gear-home-status-arrow {
  opacity: 1;
  transform: translate(2px, -1px);
}

@media (prefers-reduced-motion: reduce) {
  .gear-home-button,
  .gear-home-daily-note,
  .gear-home-record,
  .gear-home-status,
  .gear-home-status-icon,
  .gear-home-status-arrow,
  .gear-home-button::before,
  .gear-home-record::before,
  .gear-home-status.is-link::before {
    transition-duration: 0.01ms;
  }

  .gear-home-logo,
  .gear-home-logo-orbit::before,
  .gear-home-logo-orbit::after,
  .gear-home-identity h1::before,
  .gear-home-identity h1 > span,
  .gear-home-identity h1::after,
  .gear-home-button::before,
  .gear-home-button:hover::before,
  .gear-home-button:focus-visible::before,
  .gear-home-daily-note::before,
  .gear-home-status-rail::after,
  .gear-home-status.is-link::before,
  .gear-home-status.is-link:hover::before,
  .gear-home-status.is-link:focus-visible::before,
  .gear-home-record::before,
  .gear-home-record:hover::before,
  .gear-home-record:focus-visible::before,
  .gear-home-section-dot,
  .gear-home-status-rail::before,
  .gear-home-record-skeleton {
    animation: none;
  }

  .gear-home-button:hover,
  .gear-home-button:focus-visible,
  .gear-home-daily-note:hover,
  .gear-home-record:hover,
  .gear-home-record:focus-visible,
  .gear-home-status.is-link:hover,
  .gear-home-status.is-link:focus-visible,
  .gear-home-status.is-link:hover .gear-home-status-icon,
  .gear-home-status.is-link:focus-visible .gear-home-status-icon,
  .gear-home-status.is-link:hover .gear-home-status-arrow,
  .gear-home-status.is-link:focus-visible .gear-home-status-arrow {
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

  .gear-home-logo-orbit,
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

  .gear-home-logo-orbit {
    width: 176px;
    margin-bottom: 26px;
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
    margin-left: 8px;
  }

  .gear-home-record-index {
    width: 24px;
    flex-basis: 24px;
    margin-left: 8px;
    font-size: 12px;
  }

  .gear-home-record-title {
    font-size: 14px;
  }

  .gear-home-record-arrow {
    margin-right: 13px;
  }

  .gear-home-status-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gear-home-status {
    min-height: 62px;
    padding: 12px;
  }

  .gear-home-status::after {
    display: none;
  }

  .gear-home-status:nth-child(odd)::after {
    display: block;
  }

  .gear-home-status:nth-child(-n + 2)::before {
    position: absolute;
    right: 12px;
    bottom: 0;
    left: 12px;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gp-home-divider) 18%, var(--gp-home-divider) 82%, transparent);
    content: '';
  }
}
</style>
