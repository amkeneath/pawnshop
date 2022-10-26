<script setup lang="ts">
import { debounce } from 'ts-debounce'

import { WorkerNavigator } from '~/shims'

useHead({
  title: 'Pawnshop',
  meta: [
    { name: 'description', content: 'A simple pawnshop system' },
    { name: 'msapplication-TileColor', content: themeColor },
    { name: 'theme-color', content: themeColor }
  ],
  link: [
    { rel: 'apple-touch-icon', type: 'image/svg+xml', href: '/images/pwa/icon-192x192.png' },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    { rel: 'mask-icon', type: 'image/svg+xml', href: '/safari-pinned-tab.svg', color: themeColor } as any
  ]
})

onMounted(() => {
  // ADD LISTENER
  const _navigator: WorkerNavigator = navigator
  if (_navigator?.windowControlsOverlay)
    _navigator.windowControlsOverlay.ongeometrychange = debounce(() => {
      updateOverlay()
    }, 200)
})
</script>

<template>
  <router-view />
</template>
