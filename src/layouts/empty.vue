<script setup lang="ts">
// USE
const route = useRoute()

// WATCHERS
watch(route, () => {
  setThemeColorByProp('--b1')
})
</script>

<template>
  <main class="h-screen w-screen">
    <router-view class="h-full w-full" />
  </main>
</template>
