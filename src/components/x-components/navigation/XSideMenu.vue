<script setup lang="ts">
import { clearFocus, requestFocus } from '~/composables'
import { MenuItem, MenuItemAction, MenuItems } from '~/shims'

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

// REFERENCES
const menuElement = ref<HTMLUListElement>()
const openedGroup = ref<number>()

const { items, activeItemIndex, hideItems } = toRefs(props)
const activeItemOffsetTop = ref('0')

// METHODS
function setActiveItemOffsetTop(): void {
  if (menuElement.value)
    nextTick(() => {
      activeItemOffsetTop.value = ~activeItemIndex.value ? `${menuElement?.value?.querySelector('.active')?.parentElement?.offsetTop || '0'}px` : '0'
    })
}
function openGroup(event?: Event, index?: number): void {
  const idx = index !== openedGroup.value ? index : undefined
  openedGroup.value = idx
  if (typeof idx !== 'undefined' && event?.target) requestFocus(event.target as HTMLElement)
  else clearFocus()
}
function closeGroup(): void {
  openGroup(undefined, undefined)
}

function itemClicked(event: Event, item: MenuItem, idx = -1): void {
  if (item.type === 'group') openGroup(event, idx)
  item.action?.(event)
  emit('itemClicked', idx)
}
function childItemClicked(event: Event, action?: MenuItemAction): void {
  closeGroup()
  action?.(event)
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
  <nav class="z-50 flex h-full w-20 flex-none flex-col justify-between bg-neutral text-neutral-content">
    <!-- TOP -->
    <div class="flex min-h-[5rem] flex-col items-center justify-center gap-4 px-6 py-4">
      <slot name="top" />
    </div>
    <!-- MIDDLE -->
    <div class="flex w-full flex-col justify-center">
      <ul v-if="items" ref="menuElement" class="menu relative flex w-full flex-col flex-nowrap duration-300" :class="{ '-translate-x-3/4': hideItems }">
        <span class="menu-prop absolute flex h-[64px] w-full duration-300" :class="{ '!opacity-0': !~activeItemIndex }" :style="{ top: activeItemOffsetTop }">
          <span class="my-auto h-12 w-2 rounded-r-lg bg-primary"></span>
        </span>
        <li v-for="(item, idx) of items" :key="idx" :class="{ 'px-6 py-4': item.type !== 'divider' }">
          <router-link
            v-if="item.type !== 'divider'"
            class="relative !aspect-1 h-full w-full cursor-pointer rounded-lg !p-0 transition-all duration-300"
            :class="{
              'active text-primary bg-transparent': activeItemIndex === idx,
              'bg-accent text-accent-content rounded-lg hover:bg-accent-focus':
                (item.color === 'accent' || !item.color) && (item.type === 'action' || item.type === 'group'),
              'bg-primary text-primary-content rounded-lg hover:bg-primary-focus':
                item.color === 'primary' && (item.type === 'action' || item.type === 'group'),
              'bg-secondary text-secondary-content rounded-lg hover:bg-secondary-focus':
                item.color === 'secondary' && (item.type === 'action' || item.type === 'group'),
              'bg-neutral text-neutral-content rounded-lg hover:bg-neutral-focus':
                item.color === 'neutral' && (item.type === 'action' || item.type === 'group'),
              'bg-base-100 text-base-content rounded-lg hover:bg-base-300': item.color === 'base' && (item.type === 'action' || item.type === 'group')
            }"
            :title="item.text || 'Menu Item'"
            :to="item.path || ''"
            @click.stop="itemClicked($event, item, idx)"
          >
            <x-icon :icon="openedGroup !== idx ? item.icon : 'heroicons-x-mark'" class="m-auto h-6 w-6 !p-0" />

            <!-- CHILD MENU ITEM -->
            <div
              v-if="item.childMenu && item.childMenu.length > 0"
              class="absolute top-1/2 left-1/2 z-10 scale-[20%] duration-300"
              :class="{ '!scale-100': openedGroup === idx }"
              :style="{ rotate: `${((item.childMenu.length - 1) / 2) * -45}deg` }"
            >
              <div
                v-for="(childItem, idx2) of item.childMenu"
                :key="idx2"
                class="duration-300"
                :style="{ rotate: openedGroup === idx ? `${idx2 * 45}deg` : `${idx2 * 135}deg` }"
              >
                <ul class="pointer-events-none absolute left-20 w-20 -translate-y-1/2">
                  <li class="px-6 py-4">
                    <router-link
                      class="pointer-events-auto relative !aspect-1 h-full w-full rounded-lg !p-0 drop-shadow transition-all duration-300"
                      :class="{
                        'bg-accent text-accent-content rounded-lg hover:bg-accent-focus': childItem.color === 'accent' || !childItem.color,
                        'bg-primary text-primary-content rounded-lg hover:bg-primary-focus': childItem.color === 'primary',
                        'bg-secondary text-secondary-content rounded-lg hover:bg-secondary-focus': childItem.color === 'secondary',
                        'bg-neutral text-neutral-content rounded-lg hover:bg-neutral-focus': childItem.color === 'neutral',
                        'bg-base-100 text-base-content rounded-lg hover:bg-base-300': childItem.color === 'base',
                        '!pointer-events-none opacity-0': openedGroup !== idx
                      }"
                      :style="{ rotate: `${idx2 * -45 - ((item.childMenu.length - 1) / 2) * -45}deg` }"
                      :title="childItem.text || 'Sub Menu Item'"
                      :to="childItem.path || ''"
                      @click.stop="childItemClicked($event, childItem.action)"
                    >
                      <x-icon :icon="childItem.icon" class="m-auto h-6 w-6 !p-0" />
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </router-link>
          <span v-else class="m-auto h-0 w-8 border-b !p-0" />
        </li>
      </ul>
    </div>
    <!-- BOTTOM -->
    <div class="flex min-h-[5rem] flex-col items-center justify-center gap-4 px-6 py-4">
      <slot name="bottom" />
    </div>
  </nav>
</template>
