<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useMenuStore } from '~/stores/menu'

// USE
const route = useRoute()
const menu = useMenuStore()

// REFERENCES
const { activeItemIndex, items } = storeToRefs(menu)

// WATCHERS
watch(route, () => {
  menu.updateActiveItem()
})

// HOOKS
onBeforeMount(() => {
  menu.updateActiveItem()
})
const icon = {
  wifi: markRaw(IconHeroiconsWifi),
  menu
}
</script>

<template>
  <main class="justify-end bg-base-100 text-base-content">
    <div v-if="isOverlayVisible" id="title-bar" class="windows-overlay items-center duration-300" :class="{ 'justify-end pl-4': controlsOnRight }">
      <component :is="icon.wifi" :class="[isOnline ? 'text-success' : 'text-error']"></component>
    </div>
    <div class="content flex h-screen w-screen overflow-hidden">
      <x-side-menu :active-item-index="activeItemIndex" :items="items" />
      <!-- ROUTER VIEW -->
      <router-view class="max-h-full w-full" />
    </div>
  </main>
</template>
