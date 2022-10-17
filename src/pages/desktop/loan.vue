<script setup lang="ts">
interface PawnItem {
  item: string
  haveStones: boolean
  stone: string
  purity: string
  description: string
  weight: number
  weightUnit: string
  appraiseValue: number
}

interface TablePawnItem extends PawnItem {
  open?: boolean
}

const icons = {
  ellipsisHorizontal: markRaw(IconHeroiconsEllipsisHorizontal),
  magnifyingGlass: markRaw(IconHeroiconsMagnifyingGlass),
  arrowDownOnSquare: markRaw(IconHeroiconsArrowDownOnSquare),
  arrowUturnLeft: markRaw(IconHeroiconsArrowUturnLeft),
  plus: markRaw(IconHeroiconsPlus),
  minus: markRaw(IconHeroiconsMinus),
  trash: markRaw(IconHeroiconsTrash),
  pencilSquare: markRaw(IconHeroiconsPencilSquare),
  chevronRight: markRaw(IconHeroiconsChevronRight),
  chevronLeft: markRaw(IconHeroiconsChevronLeft),
  chevronUp: markRaw(IconHeroiconsChevronUp),
  chevronDown: markRaw(IconHeroiconsChevronDown),
  chevronDoubleUp: markRaw(IconHeroiconsChevronDoubleUp),
  chevronDoubleDown: markRaw(IconHeroiconsChevronDoubleDown),
  xMark: markRaw(IconHeroiconsXMark),
  listBullet: markRaw(IconHeroiconsListBullet)
}

const jewelries = [
  { id: 'ring', text: 'Ring' },
  { id: 'necklace', text: 'Necklace' },
  { id: 'bracelet', text: 'Bracelet' },
  { id: 'item1', text: 'Item 1' },
  { id: 'item2', text: 'Item 2' }
]

const stoneTypes = ['Gold', 'Diamond', 'Ruby', 'Sapphire']
const karats = ['6K', '8K', '9K', '10K', '12K', '14K', '15K', '18K', '20K', '21K', '22K', '24K']
const weights = ['Grams (g)', 'Milligrams (mg)', 'Kilograms (kg)', 'Pounds (lbs)']

const tablePawnItems = ref([] as Array<TablePawnItem>)

const addTablePawnItem = (id: string): void => {
  const item = jewelries.find(({ id: jId }) => jId === id)
  if (item) {
    const tablePawnItem: TablePawnItem = {
      item: item.text,
      open: false,
      haveStones: false,
      stone: stoneTypes[0],
      purity: karats[0],
      description: '',
      weight: 0,
      weightUnit: weights[0],
      appraiseValue: 0
    }
    tablePawnItems.value.push(tablePawnItem)
  }
}

const removeTablePawnItem = (idx: number): void => {
  tablePawnItems.value.splice(idx, 1)
}

const toggleTablePawnItemDetails = (index: number): void => {
  tablePawnItems.value[index].open = !tablePawnItems.value[index].open
}

const expandAllTablePawnItems = (expand = true): void => {
  tablePawnItems.value.forEach((item) => (item.open = expand))
}

const removeAllTablePawnItems = (): void => {
  tablePawnItems.value.splice(0)
}

const tablePawnItemDescription = (item: TablePawnItem): string =>
  item.haveStones ? `${item.stone} | ${item.purity} | ${groupedDecimals(item.weight, 2, 1)}${item.weightUnit.match(/\(([^)]+)\)/)?.[1]}` : 'No stones'

const loan = reactive({
  ticketNumber: '',
  oldTicketNumber: '',
  shortTerm: false,
  appraiseValue: 0,
  firstMonth: 0,
  otherMonth: 0,
  liquidation: 0,
  principalAmount: 0,
  interestAmount: 0,
  serviceCharge: 0,
  netProceeds: 0,
  orNumber: '',
  principal: 0,
  interest: 0,
  charge: 0,
  amountPaid: 0,
  pawnDescription: '',
  pawnItems: [] as Array<PawnItem>
})

const appraiseValue = computed(() => [...tablePawnItems.value].map((item) => item.appraiseValue).reduce((accumulator, value): number => accumulator + value, 0))
const submitForm = (): void => {
  loan.appraiseValue = appraiseValue.value
  loan.pawnItems = [...tablePawnItems.value].map((tablePawnItem: TablePawnItem): PawnItem => {
    const item: TablePawnItem = { ...tablePawnItem }
    delete item.open
    return item as PawnItem
  })
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <header class="card navbar sticky top-0 z-40 flex flex-row gap-4 overflow-visible bg-base-100 shadow">
      <div class="navbar-start">
        <div class="dropdown">
          <button tabindex="0" class="btn-ghost btn-circle btn">
            <component :is="icons.ellipsisHorizontal" class="text-base" />
          </button>
          <ul tabindex="0" class="rounded-box menu-compact dropdown-content menu mt-3 w-52 bg-base-100 p-2 shadow">
            <li><a>Mark PT as Lost</a></li>
            <li><a>Undo Lost Marking</a></li>
            <li><a>Undo Redemption</a></li>
            <li><a>Undo Renewal</a></li>
            <li><a>Jump to new Ticket</a></li>
            <li><a>Jump to Old Ticket</a></li>
            <li><a>Interest Query</a></li>
            <li><a>Mark OR#</a></li>
            <li><a>Remove Auction Mark</a></li>
            <li><a>Hold Auction</a></li>
            <li><a>Deposit</a></li>
          </ul>
        </div>
        <button class="btn-ghost btn">New</button>
        <button class="btn-ghost btn">Redeem</button>
        <button class="btn-ghost btn">Renew</button>
      </div>
      <div class="navbar-center">
        <label class="input-group">
          <span><component :is="icons.magnifyingGlass" /></span>
          <input type="text" placeholder="Find Ticket" class="input-bordered input" />
        </label>
      </div>
      <div class="navbar-end">
        <button class="btn-ghost btn">Inquiry</button>
        <button class="btn-ghost btn">
          <component :is="icons.listBullet" class="text-base" />
        </button>
        <button class="btn-ghost btn">
          <component :is="icons.chevronLeft" class="text-base" />
        </button>
        <button class="btn-ghost btn">
          <component :is="icons.chevronRight" class="text-base" />
        </button>
        <button class="btn-ghost btn">
          <component :is="icons.pencilSquare" class="text-base" />
        </button>
        <button class="btn-ghost btn">
          <component :is="icons.trash" class="text-base" />
        </button>
        <div class="divider-horizontal divider py-4"></div>
        <button class="btn-ghost btn-circle btn">
          <component :is="icons.arrowUturnLeft" class="text-base" />
        </button>
        <button form="loan" class="btn-ghost btn-circle btn" type="submit">
          <component :is="icons.arrowDownOnSquare" class="text-base" />
        </button>
      </div>
    </header>

    <form id="loan" class="flex gap-4" @submit.prevent="submitForm">
      <div class="flex flex-1 flex-col gap-2">
        <input v-model="loan.ticketNumber" type="text" placeholder="Ticket Number" class="input-bordered input w-full" />
        <input type="text" placeholder="Old Ticket Number" class="input-bordered input w-full" />
        <input type="date" placeholder="Loan Date" class="input-bordered input w-full" />
        <input type="date" placeholder="Type here" class="input-bordered input w-full" />
        <input type="date" placeholder="Type here" class="input-bordered input w-full" />
        <label class="flex cursor-pointer items-center gap-4">
          <span class="label-text">Short Term</span>
          <input v-model="loan.shortTerm" type="checkbox" class="checkbox" />
        </label>
      </div>
      <div class="flex flex-1 flex-col gap-2">
        <input type="number" placeholder="Appraise Value" class="input-bordered input w-full" readonly :value="appraiseValue" />
        <input type="number" placeholder="First Month (%)" class="input-bordered input w-full" />
        <input type="number" placeholder="Other Month (%)" class="input-bordered input w-full" />
        <input type="number" placeholder="Liquidation (%)" class="input-bordered input w-full" />
        <input type="number" placeholder="Principal Amount" class="input-bordered input w-full" />
        <label class="input-group w-full">
          <span class="label-text w-full min-w-[132px] whitespace-nowrap">Interest Amount</span>
          <input type="number" placeholder="" class="input-bordered input w-full" />
          <input type="number" placeholder="" class="input-bordered input w-full" />
        </label>
        <label class="input-group w-full">
          <span class="label-text w-full min-w-[132px] whitespace-nowrap">Service Charge</span>
          <input type="number" placeholder="" class="input-bordered input w-full" />
          <input type="number" placeholder="" class="input-bordered input w-full" />
        </label>
        <input type="number" placeholder="Net Proceeds" class="input-bordered input w-full" />
      </div>
      <div class="flex flex-1 flex-col gap-2">
        <input type="date" placeholder="Date" class="input-bordered input w-full" />
        <input type="number" placeholder="OR Number" class="input-bordered input w-full" />
        <input type="number" placeholder="Principal" class="input-bordered input w-full" />
        <input type="number" placeholder="Interest" class="input-bordered input w-full" />
        <input type="number" placeholder="Liquidation" class="input-bordered input w-full" />
        <input type="number" placeholder="Charge" class="input-bordered input w-full" />
        <input type="number" placeholder="Net Proceeds" class="input-bordered input w-full" />
        <input type="number" placeholder="Amount Paid" class="input-bordered input w-full" />
      </div>
    </form>
    <div class="divider"></div>
    <div class="">
      <header class="mb-4 flex items-center gap-2">
        <h2 class="font-semibold uppercase">Pawn Items</h2>
        <span class="grow"></span>
        <div class="dropdown-end dropdown">
          <button tabindex="0" class="btn gap-2">
            <component :is="icons.plus"></component>
            Add Item
          </button>
          <ul tabindex="0" class="rounded-box menu-compact dropdown-content menu mt-3 w-52 bg-base-100 p-2 shadow">
            <li v-for="jewelry of jewelries" :key="jewelry.id">
              <a @click.stop="addTablePawnItem(jewelry.id)">{{ jewelry.text }}</a>
            </li>
          </ul>
        </div>
      </header>
      <table v-if="tablePawnItems.length > 0" class="card table w-full shadow">
        <colgroup>
          <col />
          <col style="width: 25%" />
          <col style="width: 35%" />
          <col style="width: 25%" />
          <col style="width: 15%" />
          <col />
        </colgroup>
        <!-- head -->
        <thead>
          <tr>
            <th class="bg-primary text-primary-content">({{ tablePawnItems.length }})</th>
            <th class="bg-primary text-primary-content">Item</th>
            <th class="bg-primary text-primary-content">Description</th>
            <th class="bg-primary text-right text-primary-content">Appraise Value</th>
            <th class="bg-primary text-primary-content" />
            <th class="bg-primary py-2 text-primary-content">
              <div class="dropdown-end dropdown">
                <button tabindex="0" class="btn-ghost btn gap-2">Actions</button>
                <ul tabindex="0" class="rounded-box menu-compact dropdown-content menu mt-3 flex w-52 flex-row justify-center bg-base-100 p-2 shadow">
                  <li>
                    <a class="text-error" @click.stop="removeAllTablePawnItems()">
                      <component :is="icons.trash" class="text-base" />
                    </a>
                  </li>
                  <div class="divider-horizontal divider m-0 py-3" />
                  <li>
                    <a @click.stop="expandAllTablePawnItems()">
                      <component :is="icons.chevronDoubleDown" class="text-base" />
                    </a>
                  </li>
                  <li>
                    <a @click.stop="expandAllTablePawnItems(false)">
                      <component :is="icons.chevronDoubleUp" class="text-base" />
                    </a>
                  </li>
                </ul>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(tablePawnItem, idx) of tablePawnItems" :key="idx">
            <tr @click.stop="toggleTablePawnItemDetails(idx)">
              <th class="bg-base-100 text-base-content">{{ idx + 1 }}</th>
              <td class="bg-base-100 text-base-content">{{ tablePawnItem.item }}</td>
              <td class="bg-base-100 text-base-content">{{ tablePawnItem.description || tablePawnItemDescription(tablePawnItem) }}</td>
              <td class="bg-base-100 text-right text-base-content">{{ groupedDecimals(tablePawnItem.appraiseValue) }} PHP</td>
              <td class="bg-base-100 text-base-content" />
              <td class="bg-base-100 py-2 text-base-content">
                <div class="flex">
                  <button class="btn-ghost btn-circle btn" @click.stop="removeTablePawnItem(idx)">
                    <component :is="icons.trash" class="text-base text-error" />
                  </button>
                  <button class="btn-ghost swap-rotate btn-circle btn swap" @click.stop="toggleTablePawnItemDetails(idx)">
                    <input type="checkbox" :checked="tablePawnItem.open" />
                    <component :is="icons.chevronUp" class="swap-on text-base" />
                    <component :is="icons.chevronDown" class="swap-off text-base" />
                  </button>
                </div>
              </td>
            </tr>
            <tr class="w-full">
              <td class="w-full bg-neutral p-0" colspan="100">
                <div class="h-0 w-full overflow-hidden p-0 transition-all duration-500" :class="[{ opened: tablePawnItem.open }]">
                  <div class="flex flex-col gap-2 p-4">
                    <label class="flex cursor-pointer items-center gap-4">
                      <span class="label-text text-primary">Have Stones</span>
                      <input v-model="tablePawnItem.haveStones" type="checkbox" class="checkbox-primary checkbox" />
                    </label>
                    <div class="flex gap-2" :class="{ 'opacity-80 pointer-events-none': !tablePawnItem.haveStones }">
                      <select v-model="tablePawnItem.stone" class="select-bordered select flex-1">
                        <option v-for="(type, idx) of stoneTypes" :key="idx" :value="type">{{ type }}</option>
                      </select>
                      <label class="input-group flex-1">
                        <span class="label-text min-w-[132px]">Purity</span>
                        <select v-model="tablePawnItem.purity" class="select-bordered select w-60 grow">
                          <option v-for="(karat, idx) of karats" :key="idx" :value="karat">{{ karat }}</option>
                        </select>
                      </label>
                    </div>
                    <label class="input-group w-full">
                      <input v-model="tablePawnItem.weight" class="input-bordered input grow" placeholder="Weight" type="number" />
                      <select v-model="tablePawnItem.weightUnit" class="select-bordered select w-60">
                        <option v-for="(weight, idx) of weights" :key="idx" :value="weight">{{ weight }}</option>
                      </select>
                    </label>
                    <label class="input-group w-full">
                      <input v-model="tablePawnItem.appraiseValue" class="input-bordered input grow" type="number" placeholder="Appraise Value" />
                      <span class="label-text w-60">Min: {{ groupedDecimals(2000) }} | Max: {{ groupedDecimals(4000) }}</span>
                    </label>
                    <textarea v-model="tablePawnItem.description" class="textarea-bordered textarea h-0 w-full" placeholder="Item Description" />
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-else class="card bg-base-100 p-4 shadow">No Items added</div>
      <textarea form="loan" class="textarea-bordered textarea mt-4 w-full" placeholder="Pawn Description"></textarea>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.pawn-items {
  @apply grid gap-4;

  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.opened {
  @apply h-72;
}
</style>
