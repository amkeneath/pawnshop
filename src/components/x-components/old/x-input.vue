<script setup lang="ts">
import { styles, xColor, xId } from '~/components/x-components/scripts'

interface Props {
  id?: string
  label?: string
  type?: string
  color?: string
  icon?: unknown
  required?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  label: 'Label',
  type: 'text',
  color: 'primary',
  icon: undefined,
  required: false
})

const id = props.id || xId()
</script>

<template>
  <div
    :class="[styles.base.replace('block', 'grid'), styles.focus, styles.radius, styles.transition, xColor.focus(color), xColor.op(color)]"
    class="x-input items-center"
  >
    <input
      :id="id"
      :type="props.type"
      :required="props.required || undefined"
      :name="''"
      :placeholder="props.label"
      :class="[props.icon ? 'pl-10' : 'pl-4']"
      class="h-full w-full bg-transparent pr-4 outline-none"
    />
    <label v-if="false" :for="id">{{ props.label }}</label>
    <span v-if="props.icon" class="z-10 flex h-full w-10 items-center justify-center">
      <component :is="props.icon" aria-hidden="true" class="text-current" />
    </span>
  </div>
</template>

<style lang="postcss" scoped>
.x-input > * {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}
</style>
