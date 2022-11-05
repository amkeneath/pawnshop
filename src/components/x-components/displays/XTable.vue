<script setup lang="ts">
import { TableHeads, TableItems } from '~/shims'

interface Props {
  heads?: TableHeads
  items?: TableItems
  rowCount?: boolean
  itemClickable?: boolean
}
interface Emits {
  (e: 'itemClicked', payload: number): void
}

const props = withDefaults(defineProps<Props>(), {
  heads: undefined,
  items: undefined,
  rowCount: true,
  itemClickable: false
})
const emit = defineEmits<Emits>()

const { heads, items } = toRefs(props)

function itemClicked(index: number): void {
  emit('itemClicked', index)
}
</script>

<template>
  <table class="table-zebra table w-full">
    <thead>
      <tr>
        <th v-if="rowCount">({{ items.length }})</th>
        <th v-for="{ text, value, align } of heads" :key="value" :class="align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'">
          {{ text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, idx) of items"
        :key="item?.id || idx"
        class="duration-300 hover:text-primary"
        :class="[itemClickable ? 'cursor-pointer' : 'pointer-events-none']"
        @click.stop="itemClicked(idx)"
      >
        <td v-if="rowCount">{{ idx + 1 }}</td>
        <td v-for="{ value, align } of heads" :key="value" :class="align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'">
          {{ item?.[value] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
