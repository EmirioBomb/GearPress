<template>
  <iframe
    title="Spotify Embedded Player"
    class="spotify"
    :src="src"
    :style="iframeStyle"
    loading="lazy"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vuepress-theme-plume/composables"

const props = withDefaults(defineProps<{
  playlistId: string
  mode?: 'normal' | 'compact' | 'full'
  height?: number
}>(), {
  mode: 'normal'
})

const { isDark } = useData()

/** Spotify embed url */
const src = computed(() => {
  const theme = isDark.value ? 0 : 1
  return `https://open.spotify.com/embed/playlist/${props.playlistId}?utm_source=generator&theme=${theme}`
})

const iframeHeight = computed(() => {
  if (props.height != null) return `${props.height}px`

  const map: Record<'compact' | 'normal' | 'full', string> = {
    compact: '152px',
    normal: '352px',
    full: '100%',
  }

  return map[props.mode] ?? '152px'
})

const iframeStyle = computed(() => ({
  width: "100%",
  height: iframeHeight.value,
  border: 0,
}))
</script>

<style scoped>
.spotify {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 12px;
  overflow: hidden;
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
</style>