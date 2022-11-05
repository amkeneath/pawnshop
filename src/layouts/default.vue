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
  setThemeColorByProp('--b1')
})

// HOOKS
onBeforeMount(() => {
  menu.updateActiveItem()
})
</script>

<template>
  <main class="h-screen w-screen overflow-hidden bg-base-100 text-base-content">
    <titlebar />
    <div class="screen-safe-area flex">
      <x-side-menu :active-item-index="activeItemIndex" :items="items" class="draggable">
        <template #top>
          <logo class="h-full w-[150%]" />
        </template>
        <template #bottom>
          <x-icon v-if="!isOverlayVisible" icon="heroicons-wifi" :class="isOnline ? 'text-success' : 'text-error'" />
          <x-switch icon="heroicons-moon" alt-icon="heroicons-sun" vertical :on="isDark" class="border before:!bg-accent" @toggle="toggleDark(!isDark)" />
        </template>
      </x-side-menu>
      <!-- ROUTER VIEW -->
      <router-view class="flex-1" />
    </div>
  </main>
</template>
