<script setup lang="ts">
import { BasicColorSchema } from '@vueuse/core'

interface SubMenu {
  name: string
  route: string
  icon: unknown
}

interface Menu {
  name: string
  route: string
  icon: unknown
  sub: Array<SubMenu>
  active?: boolean
}

// #region <VUEUSE>
const route = useRoute()
const router = useRouter()

// #endregion

// #region <STATE>
// Menu
const menu: Array<Menu> = [
  {
    name: 'Transactions',
    route: '/transactions',
    icon: markRaw(IconIconParkOutlineTransactionOrder),
    sub: [
      {
        name: 'Pawn Tickets',
        route: '/1',
        icon: markRaw(IconIconParkOutlineTicket)
      },
      {
        name: 'Jewelry Items',
        route: '/2',
        icon: markRaw(IconIconParkOutlineDiamondRing)
      },
      {
        name: 'Auction Sales',
        route: '/3',
        icon: markRaw(IconIconParkOutlineHammerAndAnvil)
      },
      {
        name: 'Cash Transactions',
        route: '/4',
        icon: markRaw(IconIconParkOutlinePaperMoneyTwo)
      },
      {
        name: 'Cash Flow Summary',
        route: '/5',
        icon: markRaw(IconIconParkOutlineIncreaseTheScale)
      }
    ],
    active: false
  },
  {
    name: 'Processes',
    route: '/processes',
    icon: markRaw(IconIconParkOutlineTime),
    sub: [
      {
        name: 'Generate Notice for Auction',
        route: '/1',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Auto Processing',
        route: '/2',
        icon: markRaw(IconCarbonLogoGithub)
      }
    ],
    active: false
  },
  {
    name: 'Reports',
    route: '/reports',
    icon: markRaw(IconIconParkOutlineTableReport),
    sub: [
      { name: 'Loans', route: '/1', icon: markRaw(IconCarbonLogoGithub) },
      {
        name: 'Loans Paid',
        route: '/2',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Renewal',
        route: '/3',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: "Cashier's Cash Balance",
        route: '/4',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Redemption / Renewal Ticket List',
        route: '/5',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Expenses Report',
        route: '/6',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Auction List',
        route: '/7',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Tickets for Auction',
        route: '/8',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Loans Extended Book Register',
        route: '/9',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Loans Extended Summary',
        route: '/10',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Loans Payment Register',
        route: '/11',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Loans Payment Summary',
        route: '/12',
        icon: markRaw(IconCarbonLogoGithub)
      },
      {
        name: 'Vault Check List',
        route: '/13',
        icon: markRaw(IconCarbonLogoGithub)
      }
    ],
    active: false
  }
]
// const userMenu = {
//   name: 'John Doe',
//   route: '/user',
//   icon: markRaw(IconCarbonUserAvatar)
// }

const icons = {
  wifi: markRaw(IconHeroiconsWifi),
  briefcase: markRaw(IconHeroiconsBriefcase)
}

// #endregion

// #region <FUNCTIONS>
// Menu
const setMenu = (): void => {
  // If page is parent and have sub pages, directly navigate to it's first sub page
  const x = menu.find((m) => route.path === m.route || route.path === `${m.route}/`)
  x && x.sub?.length > 0 && router.push(`${x.route}${x.sub[0].route}`)

  // Set current sub page's parent menu state to active
  menu.forEach((m, i) => {
    menu[i] = { ...m, active: route.path.startsWith(m.route) }
  })
  // Set sub menu data
  // const current = menu.find((m) => m.active)
  // subMenu.value = current?.sub.map((s) => ({ ...s, route: `${current.route}${s.route}` })) || []
}
// #endregion

// #region <VUE LIFE CYCLES>
onBeforeUpdate(() => {
  setMenu()
})

// #endregion

// Initialize
setMenu()
</script>

<template>
  <main class="max-w-screen flex h-screen max-h-screen w-screen overflow-hidden bg-base-200 text-base-content">
    <nav class="relative z-50 flex max-w-[4.5rem] flex-col gap-4 bg-neutral px-4 py-6 text-neutral-content shadow">
      <div class="flex w-full items-center">
        <img class="h-12 w-auto" src="/logo.png" alt="Pawnshop Logo" />
      </div>
      <ul class="mt-10 flex grow flex-col gap-2">
        <!-- Sidebar content here -->
        <li v-for="(item, idx) of menu" :key="item.route" class="parent-menu">
          <router-link
            :to="item.route"
            class="relative flex h-10 w-10 items-center overflow-hidden rounded-lg text-xs text-primary transition-all duration-500"
            :class="{ 'active-menu': item.active }"
          >
            <component :is="item.icon" class="w-10 flex-none text-base" />
            <span class="opacity-0">{{ item.name }}</span>
          </router-link>

          <div
            class="sub-menu mt-2 max-h-0 w-64 overflow-hidden rounded-lg border border-neutral/30 bg-neutral/90 opacity-0 shadow transition-all duration-500"
            :class="`sub-menu-${idx + 1} min-w-fit`"
          >
            <ul class="p-4">
              <li v-for="(subItem, idx2) of item.sub" :key="`${item.route}${subItem.route}`" class="relative ml-2">
                <span class="absolute right-full top-[1px] h-3/6 w-2 rounded-bl-md border-b-2 border-l-2 border-neutral-content" />
                <span v-if="idx2 < item.sub.length - 1" class="absolute bottom-[-1px] right-full h-2/3 w-2 border-l-2 border-neutral-content" />
                <router-link
                  :to="`${item.route}${subItem.route}`"
                  class="z-10 flex items-center gap-2 whitespace-nowrap rounded-lg p-2 text-xs transition-all duration-500 hover:bg-primary/50 hover:text-primary-content"
                  active-class="active-menu"
                >
                  <component :is="subItem.icon" class="flex-none text-base" />
                  {{ subItem.name }}</router-link
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="absolute left-0 bottom-4 flex w-full flex-col items-center justify-center gap-2">
        <div class="text-error">
          <component :is="icons.wifi" class="text-base" :class="{ 'text-success': online }" />
        </div>
        <input v-if="!fullTheme" type="checkbox" class="toggle-primary toggle" :checked="isDark" @change="toggleDark(!isDark)" />
        <div v-else class="dropdown-top dropdown">
          <button tabindex="0" class="btn-ghost btn-circle btn">
            <component :is="icons.briefcase" class="text-base" />
          </button>
          <ul tabindex="0" class="rounded-box menu-compact dropdown-content menu mt-3 w-52 gap-1 bg-base-100 p-2 shadow">
            <li v-for="t of themes" :key="t" class="w-full">
              <a
                :[themeAttribute]="t"
                class="flex w-full items-center gap-2 bg-base-100 px-2 py-1 text-base-content transition-all duration-500 hover:bg-base-300"
                @click.stop="setTheme(t as BasicColorSchema)"
              >
                <span class="label-text block flex-1 capitalize">{{ t }}</span>
                <div class="flex h-2 flex-1 gap-1">
                  <div class="badge-primary badge h-full w-full grow text-xs capitalize text-primary-content" />
                  <div class="badge-secondary badge h-full w-full grow text-xs capitalize text-secondary-content" />
                  <div class="badge-accent badge h-full w-full grow text-xs capitalize text-accent-content" />
                  <div class="badge-neutral badge h-full w-full grow text-xs capitalize text-neutral-content" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view class="page" />
  </main>
</template>

<style lang="postcss" scoped>
/* #region <PARENT MENU> */
.parent-menu:hover > a,
.parent-menu:focus > a,
.parent-menu:focus-within > a {
  @apply w-60 bg-primary text-primary-content;
}

.parent-menu:hover > a > span,
.parent-menu:focus > a > span,
.parent-menu:focus-within > a > span {
  @apply opacity-100;
}

.active-menu {
  @apply bg-primary text-primary-content;
}

/* #endregion */

/* #region <SUB MENU> */
.sub-menu-nav {
  grid-template-columns: 1fr auto;
}

.parent-menu:hover .sub-menu,
.parent-menu:focus .sub-menu,
.parent-menu:focus-within .sub-menu {
  @apply opacity-100;

  max-height: 208px;
}

.parent-menu:hover .sub-menu.sub-menu-2,
.parent-menu:focus .sub-menu.sub-menu-2,
.parent-menu:focus-within .sub-menu.sub-menu-2 {
  max-height: 103px !important;
}

.parent-menu:hover .sub-menu.sub-menu-3,
.parent-menu:focus .sub-menu.sub-menu-3,
.parent-menu:focus-within .sub-menu.sub-menu-3 {
  max-height: 500px !important;
}

/* #endregion */
</style>
