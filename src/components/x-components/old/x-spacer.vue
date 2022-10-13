<script setup lang="ts">
import { styles } from '~/components/x-components/scripts'
// interface Props {
//   color?: string
//   icon?: unknown
// }

// const props = withDefaults(defineProps<Props>(), {
//   color: undefined,
//   icon: undefined,
// })
</script>

<template>
  <label class="flex h-1 w-full items-center">
    <span :class="[styles.base]" class="bg-base-500/20 h-[1px] w-full"></span>
  </label>
</template>
