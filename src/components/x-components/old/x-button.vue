<script setup lang="ts">
import { styles, xColor, xId } from '~/components/x-components/old/scripts'

interface Props {
  id?: string
  type?: 'submit' | 'reset' | 'button'
  color?: string
  icon?: unknown
}
interface Emits {
  (e: 'clicked'): void
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  type: 'button',
  color: undefined,
  icon: undefined
})

const emit = defineEmits<Emits>()

const id = props.id || xId()

const onClick = (): void => {
  emit('clicked')
}
</script>

<template>
  <button
    :id="id"
    :type="props.type"
    :class="[styles.base, styles.focus, styles.radius, styles.transition, xColor.bg(color), xColor.hover(color), xColor.focus(color)]"
    class="x-button px-4 py-2"
    @click="onClick"
  >
    <span v-if="props.icon" class="absolute top-0 left-0 z-10 flex h-full w-10 items-center justify-center rounded-md">
      <component :is="props.icon" aria-hidden="true" class="text-current" />
    </span>
    <slot v-if="!props.icon">Click Me</slot>
  </button>
</template>
