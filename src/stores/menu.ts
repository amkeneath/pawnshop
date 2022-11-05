import { acceptHMRUpdate, defineStore } from 'pinia'

import { MenuItems } from '~/shims'

export const useMenuStore = defineStore('menu', () => {
  // CONSTANTS
  const defaultItems: MenuItems = [
    {
      icon: 'heroicons-plus',
      text: 'New Pawn',
      type: 'group',
      childMenu: [
        { icon: 'heroicons-squares-plus', text: 'Existing Account', path: '', color: 'base' },
        {
          icon: 'heroicons-scale',
          text: 'New Pawn',
          path: '/new/pawn',
          action(): void {
            console.log('sample menu action')
          }
        },
        { icon: 'heroicons-user-plus', text: 'New Account', path: '/new/account', color: 'base' },
        { icon: 'heroicons-user', text: 'Existing Account', path: '/accounts', color: 'base' }
      ]
    },
    { type: 'divider' },
    { icon: 'heroicons-home', text: 'Home', path: '/' },
    { icon: 'heroicons-scale', text: 'Pawns', path: '/pawns' },
    { icon: 'heroicons-squares-2x2', text: 'Pawn Items', path: '/pawn-items' },
    { icon: 'heroicons-user', text: 'Accounts', path: '/accounts' }
  ]

  // REFERENCES
  const _items = ref()
  const activeItemIndex = ref(-1)

  // COMPUTED
  const items = computed((): MenuItems => _items.value || defaultItems)

  // USE
  // const router = useRouter()
  const route = useRoute()

  // METHODS
  function updateActiveItem(path?: string): void {
    let currentPath = path || route.path
    let idx = -1
    while (!~idx && currentPath !== '') {
      idx = (items.value as MenuItems).findIndex(({ path }) => currentPath === path)
      if (!~idx) currentPath = currentPath.slice(0, currentPath.lastIndexOf('/'))
    }
    activeItemIndex.value = idx
  }
  function setItems(menuItems?: MenuItems): void {
    _items.value = menuItems
    updateActiveItem()
  }
  function clearItems(): void {
    _items.value = undefined
  }

  // INITIALIZE

  return {
    activeItemIndex,
    clearItems,
    items,
    setItems,
    updateActiveItem
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
