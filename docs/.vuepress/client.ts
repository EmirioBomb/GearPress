import { defineClientConfig } from 'vuepress/client'
import { Layout as PlumeLayout } from 'vuepress-theme-plume/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import { h } from 'vue'

const backToTopGradientId = 'gp-back-to-top-ring'
const backToTopProgressClass = 'gp-back-to-top-progress'

function enhanceBackToTopRing() {
  const button = document.querySelector<HTMLElement>('.vp-back-to-top')
  if (!button)
    return

  const syncRing = () => {
    const svg = button.querySelector<SVGSVGElement>('svg')
    const circle = svg?.querySelector<SVGCircleElement>(`circle:not(.${backToTopProgressClass})`)
    const percent = button.querySelector<HTMLElement>('.percent')
    if (!svg || !circle || !percent)
      return

    if (!svg.querySelector(`#${backToTopGradientId}`)) {
      const namespace = 'http://www.w3.org/2000/svg'
      const defs = document.createElementNS(namespace, 'defs')
      const gradient = document.createElementNS(namespace, 'linearGradient')
      gradient.id = backToTopGradientId
      gradient.setAttribute('x1', '0%')
      gradient.setAttribute('y1', '0%')
      gradient.setAttribute('x2', '100%')
      gradient.setAttribute('y2', '100%')

      for (const [offset, color] of [
        ['0%', 'var(--vp-c-brand-2)'],
        ['48%', 'var(--vp-c-brand-1)'],
        ['100%', 'var(--vp-c-brand-3)'],
      ]) {
        const stop = document.createElementNS(namespace, 'stop')
        stop.setAttribute('offset', offset)
        stop.style.stopColor = color
        gradient.append(stop)
      }

      defs.append(gradient)
      svg.prepend(defs)
    }

    let progressCircle = svg.querySelector<SVGCircleElement>(`.${backToTopProgressClass}`)
    if (!progressCircle) {
      progressCircle = circle.cloneNode(true) as SVGCircleElement
      progressCircle.classList.add(backToTopProgressClass)
      progressCircle.removeAttribute('data-allow-mismatch')
      svg.append(progressCircle)
    }

    progressCircle.style.stroke = `url(#${backToTopGradientId})`
    progressCircle.style.strokeDasharray = percent.textContent?.trim() === '100%'
      ? 'none'
      : circle.style.strokeDasharray
  }

  syncRing()
  new MutationObserver(syncRing).observe(button, {
    attributes: true,
    attributeFilter: ['style'],
    childList: true,
    characterData: true,
    subtree: true,
  })
}

function waitForBackToTopRing(attempt = 0) {
  if (document.querySelector('.vp-back-to-top')) {
    enhanceBackToTopRing()
    return
  }

  if (attempt < 20)
    requestAnimationFrame(() => waitForBackToTopRing(attempt + 1))
}
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

import SectionTitle from './theme/components/SectionTitle.vue'
import SpotifyEmbedded from './theme/components/about/SpotifyEmbedded.vue'
import ProfileCard from './theme/components/about/ProfileCard.vue'
import AboutMe from './theme/components/about/AboutMe.vue'
import HeroEffectSwitch from './theme/components/HeroEffectSwitch.vue'
import HomeLanding from './theme/components/HomeLanding.vue'
import NavigationHub from './theme/components/navigation/NavigationHub.vue'

import './theme/styles/index.css'

export default defineClientConfig({
  layouts: {
    Layout: () => h(PlumeLayout, null, {
      'nav-bar-content-after': () => h(HeroEffectSwitch),
    }),
  },
  enhance({ app }) {
    if (typeof window !== 'undefined')
      requestAnimationFrame(() => waitForBackToTopRing())

    // built-in components
    app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    app.component('SectionTitle', SectionTitle)
    app.component('SpotifyEmbedded', SpotifyEmbedded)
    app.component('ProfileCard', ProfileCard)
    app.component('AboutMe', AboutMe)
    app.component('HomeLanding', HomeLanding)
    app.component('NavigationHub', NavigationHub)
  },
})
