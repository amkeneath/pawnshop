import { acceptHMRUpdate, defineStore } from 'pinia'

import { MenuItems } from '~/shims'

export const useMenuStore = defineStore('menu', () => {
  // USE
  const route = useRoute()
  const router = useRouter()

  // STATICS
  const icon = {
    plus: markRaw(IconHeroiconsPlusSolid),
    home: markRaw(IconHeroiconsHomeSolid),
    ticket: markRaw(IconHeroiconsTicketSolid),
    squaresPlus: markRaw(IconHeroiconsSquaresPlusSolid),
    user: markRaw(IconHeroiconsUserSolid)
  }
  const defaultItems: MenuItems = [
    { icon: markRaw(icon.plus), text: 'New Pawn', isAction: true, action: undefined },
    { isDivider: true },
    { icon: markRaw(icon.home), text: 'Home', path: '/' },
    { icon: markRaw(icon.ticket), text: 'Pawn Tickets', path: '/pawn-tickets' },
    { icon: markRaw(icon.squaresPlus), text: 'Pawn Items', path: '/pawn-items' },
    { icon: markRaw(icon.user), text: 'Account', path: '/account' }
  ]

  // REFERENCES
  const items = ref()
  const activeItemIndex = ref(-1)

  // COMPUTED
  const finalItems = computed((): MenuItems => items.value || defaultItems)

  // METHODS
  function updateActiveItem(path?: string): void {
    activeItemIndex.value = ((items.value || defaultItems) as MenuItems).findIndex(({ path: p }) => p === (path || route.path))
  }
  function setItems(menuItems?: MenuItems): void {
    items.value = menuItems
    updateActiveItem()
  }
  function newLoan(event: Event): void {
    if (event.currentTarget) {
      router.push('/new-loan')
    }
  }

  // INITIALIZE
  defaultItems[0].action = newLoan

  return {
    activeItemIndex,
    items: finalItems,
    setItems,
    updateActiveItem
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
