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
</script>

<template>
  <main class="bg-base-100 text-base-content">
    <div v-if="false" id="title-bar" />
    <div class="content flex h-screen w-screen overflow-hidden">
      <side-menu :active-item-index="activeItemIndex" :items="items" />
      <!-- ROUTER VIEW -->
      <router-view class="max-h-full w-full" />
    </div>
  </main>
</template>
