<script lang="ts" setup>
const el = ref<HTMLElement>()

const data = ref([1, 2, 3, 4, 5, 6])

useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(...Array.from({ length: 5 }, (_, i) => length + i))
  },
  { distance: 10 }
)

// INITIALIZE
setThemeColorByProp(controlsOnRight ? '--n' : '--b1')
</script>

<template>
  <div ref="el" class="flex h-40 flex-col gap-4 overflow-auto">
    <div v-for="item in data" :key="item" class="flex h-10 items-center bg-neutral p-4 text-neutral-content">
      {{ item }}
    </div>
  </div>
</template>
