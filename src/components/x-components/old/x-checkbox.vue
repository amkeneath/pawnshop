<script setup lang="ts">
import { styles, xColor, xId } from '~/components/x-components/scripts'

interface Props {
  id?: 'string'
  modelValue?: boolean | Array<string>
  color?: string
  icon?: unknown
  value?: string
  checked?: boolean
}

interface Emits {
  (e: 'update:modelValue', payload: boolean | Array<string>): void
  (e: 'change', payload: boolean | Array<string>): void
  (e: 'toggle', payload: boolean | Array<string>): void
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: undefined,
  color: undefined,
  icon: undefined,
  value: 'value',
  checked: false
})

const emit = defineEmits<Emits>()

const id = props.id || xId()

const { modelValue, checked } = toRefs(props)
const model = ref<boolean>(false)

watch(
  [modelValue, checked],
  ([newModelValue, newChecked], [oldModelValue, oldChecked]) => {
    if (!Array.isArray(newModelValue)) {
      model.value = typeof newModelValue === 'boolean' ? newModelValue : typeof newChecked === 'boolean' ? newChecked : false
    }
  },
  { immediate: true }
)

const onToggle = (): void => {
  let value: boolean | Array<string> = model.value

  if (Array.isArray(props.modelValue)) {
    value = [...props.modelValue]
    if (model.value) value.push(props.value)
    else {
      const idx = props.modelValue.indexOf(props.value)
      if (idx !== -1) value.splice(idx, 1)
    }
  }

  emit('update:modelValue', value)
  emit('change', value)
  emit('toggle', value)
}

const icon = markRaw(IconHeroiconsCheck)
</script>

<template>
  <a :class="[styles.base, styles.transition]" class="x-checkbox flex w-8 items-center p-1">
    <input :id="id" ref="checkbox" v-model="model" type="checkbox" class="hidden" @change="onToggle" />
    <label
      :for="id"
      :class="[styles.radius, styles.transition, styles.focus, xColor.op(color), xColor.focus(color)]"
      class="relative flex h-6 w-6 items-center justify-center overflow-hidden"
    >
      <span :class="[styles.transition, xColor.bg(color), { 'opacity-0': !model }]" class="absolute h-full w-full" />
      <!-- <component :is="icon" :class="[styles.transition, { 'opacity-0': !model }]" class="absolute z-10 h-6" /> -->
      <!-- <component :is="props.icon" :class="[{ 'hidden': model }]" class="absolute z-10 h-6" /> -->
      <component :is="icon" v-if="model" class="absolute z-10 h-6" />
      <component :is="props.icon" v-else class="absolute z-10 h-6" />
    </label>
  </a>
</template>
