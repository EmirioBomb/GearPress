import { defineClientConfig } from 'vuepress/client'
import { Layout as PlumeLayout } from 'vuepress-theme-plume/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import { h } from 'vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

import SectionTitle from './theme/components/SectionTitle.vue'
import SpotifyEmbedded from './theme/components/about/SpotifyEmbedded.vue'
import ProfileCard from './theme/components/about/ProfileCard.vue'
import AboutMe from './theme/components/about/AboutMe.vue'
import HeroEffectSwitch from './theme/components/HeroEffectSwitch.vue'

import './theme/styles/index.css'

export default defineClientConfig({
  layouts: {
    Layout: () => h(PlumeLayout, null, {
      'nav-bar-content-after': () => h(HeroEffectSwitch),
    }),
  },
  enhance({ app }) {
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
  },
})
