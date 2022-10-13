<script setup lang="ts">
import { height, styles, xColor, xId } from '~/components/x-components/scripts'

interface Props {
  modelValue?: string
  id?: string
  label?: string
  color?: string
  icon?: unknown
  options?: Array<string>
  required?: boolean
}
interface Emits {
  (e: 'update:modelValue', payload: string): void
  (e: 'change', payload: string): void
  (e: 'select', payload: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  id: undefined,
  label: 'Label',
  color: 'primary',
  icon: undefined,
  options: undefined,
  required: false
})
const emit = defineEmits<Emits>()

const { modelValue } = toRefs(props)
const model = ref<string>('')

watch(
  [modelValue],
  ([newModelValue], [oldModelValue]) => {
    const idx = props.options.indexOf(newModelValue)
    model.value = idx !== -1 ? props.options[idx] : ''
  },
  { immediate: true }
)

const id = props.id || xId()
const chevron = markRaw(IconHeroiconsChevronDown)
let open = ref(false)

const openClose = (): void => {
  open.value = !open.value
}

const itemClick = (value: string): void => {
  open.value = false
  const idx = props.options.indexOf(value)
  model.value = idx !== -1 ? props.options[idx] : ''

  emit('update:modelValue', model.value)
  emit('change', model.value)
  emit('select', model.value)
}
</script>

<template>
  <a
    :class="[
      styles.base.replace(height, '').replace('overflow-hidden', ''),
      styles.focus,
      styles.radius,
      styles.transition,
      xColor.focus(color),
      xColor.op(color)
    ]"
    class="x-input items-center"
  >
    <button type="button" :class="[height]" class="relative w-full" @click="openClose">
      <input
        :id="id"
        v-model="model"
        :name="''"
        :placeholder="props.label"
        :required="props.required || undefined"
        :list="`${id}-list`"
        :class="[props.icon ? 'pl-10' : 'pl-4', styles.base]"
        class="w-full bg-transparent pr-4 outline-none"
        type="text"
        readonly
      />
      <span v-if="props.icon" class="z-10 flex h-full w-10 items-center justify-center">
        <component :is="props.icon" aria-hidden="true" class="text-current" />
      </span>
      <span class="absolute top-0 right-0 z-10 flex h-full w-10 items-center justify-center">
        <component :is="chevron" aria-hidden="true" class="text-current" />
      </span>
    </button>
    <datalist
      :id="`${id}-list`"
      :class="[styles.transition, styles.radius, open ? 'max-h-40' : 'max-h-0']"
      class="h-content bg-base-50 absolute z-20 mt-2 flex w-full flex-col overflow-hidden"
    >
      <button
        v-for="(item, idx) of options"
        :key="idx"
        type="button"
        :class="[styles.transition]"
        class="hover:bg-base-800/20 text-left"
        @click="itemClick(item)"
      >
        <option :value="item" class="px-4 py-2">{{ item }}</option>
      </button>
    </datalist>
  </a>
</template>

<style lang="postcss" scoped>
.x-input > * {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}
</style>
