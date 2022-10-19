<script setup lang="ts">
import { debounce } from 'ts-debounce'

import { XWorkerNavigator } from '~/shims'

onMounted(() => {
  setOverlay()
  const xNavigator: XWorkerNavigator = navigator
  if (xNavigator?.windowControlsOverlay) {
    xNavigator.windowControlsOverlay.ongeometrychange = debounce(() => {
      setOverlay()
    }, 250)
  }
})

useHead({
  title: 'Pawnshop',
  meta: [
    { name: 'description', content: 'A simple pawnshop system' },
    { name: 'msapplication-TileColor', content: themeColor },
    { name: 'theme-color', content: themeColor }
  ],
  link: [
    { rel: 'apple-touch-icon', type: 'image/svg+xml', href: '/images/pwa/icon-192x192.png' },
    { rel: 'icon', type: 'image/svg+xml', href: favicon }
  ]
})
</script>

<template>
  <router-view />
</template>
