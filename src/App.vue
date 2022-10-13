<script setup lang="ts">
useHead({
  title: 'Pawnshop',
  meta: [
    { name: 'description', content: 'A simple pawnshop system' },
    { name: 'msapplication-TileColor', content: themeColor.value },
    { name: 'theme-color', content: themeColor }
  ],
  link: [
    { rel: 'apple-touch-icon', type: 'image/svg+xml', href: '/images/pwa/icon-192x192.png' },
    { rel: 'icon', type: 'image/svg+xml', href: favicon }
    // { rel: 'mask-icon', type: 'image/svg+xml', href: '/safari-pinned-tab.svg', color: themeColor?.value }
  ]
})
</script>

<template>
  <router-view />
</template>
