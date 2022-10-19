<script setup lang="ts">
import { MenuItems } from '~/shims'

interface Props {
  items?: MenuItems
  activeItemIndex?: number
  hideItems?: boolean
}
interface Emits {
  (e: 'itemClicked', payload: number): void
}

const props = withDefaults(defineProps<Props>(), {
  items: undefined,
  activeItemIndex: -1,
  hideItems: false
})

const emit = defineEmits<Emits>()

// STATICS
const icon = {
  sun: markRaw(IconHeroiconsSunSolid),
  moon: markRaw(IconHeroiconsMoonSolid)
}

// REFERENCES
const { items, activeItemIndex, hideItems } = toRefs(props)
const activeItemOffsetTop = ref('0')
const menu = ref()

// METHODS
function itemClicked(idx = -1): void {
  emit('itemClicked', idx)
}
function setActiveItemOffsetTop(): void {
  if (menu.value)
    nextTick(() => {
      activeItemOffsetTop.value = activeItemIndex.value !== -1 ? `${menu?.value?.querySelector('.active')?.parentElement?.offsetTop || '0'}px` : '0'
    })
}

// WATCHERS
watch(activeItemIndex, () => {
  setActiveItemOffsetTop()
})

// HOOKS
onMounted(() => {
  setActiveItemOffsetTop()
})
</script>

<template>
  <nav class="draggable flex h-full w-20 flex-none flex-col justify-between bg-neutral text-neutral-content">
    <!-- TOP -->
    <div class="flex h-20 flex-col items-center justify-center px-6 py-4">
      <img class="hidden w-full" src="/logo.png" alt="Pawnshop Logo" />
    </div>
    <!-- MIDDLE -->
    <div class="flex w-full flex-col justify-center">
      <ul v-if="items" ref="menu" class="menu relative flex w-full flex-col flex-nowrap duration-300" :class="{ '-translate-x-3/4': hideItems }">
        <span
          class="menu-prop absolute flex h-[64px] w-full duration-300"
          :class="{ '!opacity-0': activeItemIndex === -1 }"
          :style="{ top: activeItemOffsetTop }"
        >
          <span class="my-auto h-12 w-2 rounded-r-lg bg-primary"></span>
        </span>
        <li v-for="(item, idx) of items" :key="idx" :class="{ 'px-6 py-4': !item.isDivider }">
          <router-link
            v-if="!item.isDivider"
            class="!aspect-1 h-full w-full cursor-pointer rounded-lg !p-0 transition-all duration-300"
            :class="{ active: activeItemIndex === idx, 'action-menu': item.isAction }"
            :title="item.isDivider ? 'Menu Divider' : item.text || 'Menu Item'"
            :to="item.path || ''"
            @click.stop="item.isAction ? item.action?.($event) : itemClicked(idx)"
          >
            <component :is="item.icon" class="m-auto h-6 w-6 !p-0" />
          </router-link>
          <span v-else class="m-auto h-0 w-8 border-b !p-0" />
        </li>
      </ul>
    </div>
    <!-- BOTTOM -->
    <div class="flex min-h-[5rem] flex-col items-center justify-center px-6 py-4">
      <x-switch :icon="(icon.moon as any)" :alt-icon="(icon.sun as any)" vertical :on="isDark" class="border before:!bg-accent" @toggle="toggleDark(!isDark)" />
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
.active {
  @apply text-primary bg-transparent;
}

.action-menu {
  @apply bg-accent text-accent-content rounded-lg;

  &:hover {
    @apply bg-accent-focus;
  }
}
</style>
