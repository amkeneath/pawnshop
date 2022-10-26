<script setup lang="ts">
import { formattedDate } from '~/composables'

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

// ICONS
const icon = {
  plus: markRaw(IconHeroiconsPlusSolid),
  trash: markRaw(IconHeroiconsTrashSolid),
  pencilSquare: markRaw(IconHeroiconsPencilSquareSolid),
  chevronUp: markRaw(IconHeroiconsChevronUpSolid),
  chevronDown: markRaw(IconHeroiconsChevronDownSolid),
  chevronDoubleUp: markRaw(IconHeroiconsChevronDoubleUpSolid),
  chevronDoubleDown: markRaw(IconHeroiconsChevronDoubleDownSolid),
  xMark: markRaw(IconHeroiconsXMarkSolid),
  check: markRaw(IconHeroiconsCheckSolid),

  lifebuoy: markRaw(IconHeroiconsLifebuoySolid),
  truck: markRaw(IconHeroiconsTruckSolid),
  devicePhoneMobile: markRaw(IconHeroiconsDevicePhoneMobileSolid),
  star: markRaw(IconHeroiconsStarSolid)
}

// STATICS
const stoneTypes = ['Gold', 'Diamond', 'Ruby', 'Sapphire']
const karats = ['6K', '8K', '9K', '10K', '12K', '14K', '15K', '18K', '20K', '21K', '22K', '24K']
const weights = ['Grams (g)', 'Milligrams (mg)', 'Kilograms (kg)', 'Pounds (lbs)']

const categories = [
  { text: 'Jewelry', icon: icon.lifebuoy },
  { text: 'Automotive', icon: icon.truck },
  { text: 'Appliances', icon: icon.star },
  { text: 'Gadgets', icon: icon.devicePhoneMobile }
]

// VUEUSE
const { textarea: pawnDescriptionRef, input: pawnDescription } = useTextareaAutosize()

// REACTIVE
const loan = reactive({
  ticketNumber: '',
  loanDate: '',
  maturityDate: '',
  expiryDate: '',
  appraiseValue: 0,
  principalAmount: 0,
  monthly: [0, 0],
  liquidation: 0,
  interestAmount: [0, 0],
  serviceCharge: [0, 0],
  netProceeds: 0,
  pawnDescription: '',
  pawnItems: [] as Array<PawnItem>,
  pawnTypeId: '',
  clientId: ''
})

const tablePawnItem = reactive({
  item: '',
  open: false,
  haveStones: false,
  stone: stoneTypes[0],
  purity: karats[0],
  description: '',
  weight: 0,
  weightUnit: weights[0],
  appraiseValue: 0
} as TablePawnItem)

// REFERENCES
const pawItems = ref([
  { text: 'Ring', icon: markRaw(icon.check) },
  { text: 'Necklace', icon: markRaw(icon.trash) },
  { text: 'Bracelet', icon: markRaw(icon.pencilSquare) },
  { text: 'Watch', icon: markRaw(icon.devicePhoneMobile) },
  { text: 'Item 1', icon: markRaw(icon.truck) },
  { text: 'Item 2', icon: markRaw(icon.chevronDoubleDown) },
  { text: 'Item 3', icon: markRaw(icon.chevronDoubleUp) },
  { text: 'Item 4', icon: markRaw(icon.star) }
])

const tablePawnItems = ref([] as Array<TablePawnItem>)
const tablePawnItemIndex = ref(0)

const categoryIndex = ref(0)
const activePawnItemIndex = ref(0)

const selectPawnItems = ref(true)
const editPawnItem = ref(false)

// COMPUTED
const appraiseValue = computed(() => [...tablePawnItems.value].map((item) => item.appraiseValue).reduce((accumulator, value): number => accumulator + value, 0))
const category = computed(() => categories[Math.min(Math.max(categoryIndex.value, 0), categories.length - 1)])
const activePawnItem = computed(() => pawItems.value[Math.min(Math.max(activePawnItemIndex.value, 0), pawItems.value.length - 1)])

// METHODS
function tablePawnItemDescription(item: TablePawnItem): string {
  return item.haveStones ? `${item.stone} | ${item.purity} | ${groupedDecimals(item.weight, 2, 1)}${item.weightUnit.match(/\(([^)]+)\)/)?.[1]}` : 'No stones'
}
function openSelectItem(): void {
  selectPawnItems.value = true
}
function closeSelectItem(): void {
  selectPawnItems.value = false
}
function createPawnItem(): void {
  //
}
function addPawnItem(index: number): void {
  activePawnItemIndex.value = index
  editPawnItem.value = true

  const item = pawItems.value[index]
  if (item) {
    const newTablePawnItem: TablePawnItem = tablePawnItem
    newTablePawnItem.item = item.text
    tablePawnItems.value.push(newTablePawnItem)
    tablePawnItemIndex.value = tablePawnItems.value.length - 1
  }
}
function confirmPawnItem(): void {
  tablePawnItemIndex.value = -1
  editPawnItem.value = false
}
function removePawnItem(): void {
  tablePawnItemIndex.value = -1
  editPawnItem.value = false
  tablePawnItems.value.splice(-1)
}
function editTablePawnItem(index: number): void {
  tablePawnItemIndex.value = index
  activePawnItemIndex.value = Math.max(
    0,
    pawItems.value?.findIndex(({ text }) => tablePawnItems.value?.[index]?.item === text)
  )
  Object.assign(tablePawnItem, tablePawnItems.value[index])
  editPawnItem.value = true
}

function removeTablePawnItem(index: number): void {
  tablePawnItems.value.splice(index, 1)
}
function toggleTablePawnItemDetails(index: number): void {
  tablePawnItems.value[index].open = !tablePawnItems.value[index].open
}
function expandAllTablePawnItems(expand = true): void {
  tablePawnItems.value.forEach((item) => (item.open = expand))
}
function removeAllTablePawnItems(): void {
  tablePawnItems.value.splice(0)
}

function submitForm(): void {
  loan.appraiseValue = appraiseValue.value
  loan.pawnDescription = pawnDescription.value
  loan.pawnItems = [...tablePawnItems.value].map((tablePawnItem: TablePawnItem): PawnItem => {
    const item: TablePawnItem = { ...tablePawnItem }
    delete item.open
    return item as PawnItem
  })
}

function slideFromMenu(state: boolean): string {
  return `absolute right-full top-0 duration-300${state ? ' !right-0' : ''}`
}

// INITIALIZE
setThemeColorByProp(controlsOnRight ? '--b1' : '--n') // --b1 is base-100 color

const date = formattedDate().value
loan.loanDate = date
loan.maturityDate = date
loan.expiryDate = date

// WATCHERS
watch(tablePawnItem, (newTablePawnItem) => {
  if (tablePawnItemIndex.value >= 0 && tablePawnItemIndex.value < tablePawnItems.value.length) {
    tablePawnItems.value[tablePawnItemIndex.value] = { ...newTablePawnItem }
  }
})
</script>

<route lang="yaml">
name: new-loan
</route>

<template>
  <section class="flex h-full w-full">
    <div class="relative h-full w-1/2 overflow-hidden border-l">
      <x-section class="h-full w-full overflow-hidden rounded-tr-[3rem] bg-neutral text-neutral-content" hide-titlebar>
        <div class="mb-4 flex h-14 items-center justify-between">
          <h3 class="flex items-center gap-1"><component :is="icon.star" v-if="false" class="text-primary" /> New Loan > {{ category.text }}</h3>
          <button class="btn-accent btn-circle btn" @click.stop="openSelectItem()"><component :is="icon.plus" /></button>
        </div>
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
              <th class="bg-primary py-2 text-right text-primary-content">
                <div class="dropdown-end dropdown">
                  <button tabindex="0" class="btn-ghost btn gap-2">Actions</button>
                  <ul
                    tabindex="0"
                    class="dropdown-content menu rounded-box menu-compact mt-3 flex w-52 flex-row justify-center bg-base-100 p-2 text-base-content shadow"
                  >
                    <li>
                      <a class="text-secondary" @click.stop="removeAllTablePawnItems()">
                        <component :is="icon.trash" class="text-base" />
                      </a>
                    </li>
                    <div class="divider divider-horizontal m-0 py-3" />
                    <li>
                      <a @click.stop="expandAllTablePawnItems()">
                        <component :is="icon.chevronDoubleDown" class="text-base" />
                      </a>
                    </li>
                    <li>
                      <a @click.stop="expandAllTablePawnItems(false)">
                        <component :is="icon.chevronDoubleUp" class="text-base" />
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
                      <component :is="icon.trash" class="text-base text-secondary" />
                    </button>
                    <button class="btn-ghost btn-circle btn" @click.stop="editTablePawnItem(idx)">
                      <component :is="icon.pencilSquare" class="text-base text-accent" />
                    </button>
                    <button class="swap btn-ghost swap-rotate btn-circle btn" @click.stop="toggleTablePawnItemDetails(idx)">
                      <input type="checkbox" :checked="tablePawnItem.open" />
                      <component :is="icon.chevronUp" class="swap-on text-base" />
                      <component :is="icon.chevronDown" class="swap-off text-base" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="disabled pointer-events-none w-full">
                <td class="w-full bg-neutral p-0" colspan="100">
                  <div class="h-0 w-full overflow-hidden p-0 transition-all duration-300" :class="[{ opened: tablePawnItem.open }]">
                    <div class="flex flex-col gap-2 p-4">
                      <label class="flex cursor-pointer items-center gap-4">
                        <span class="label-text text-primary">Have Stones</span>
                        <input v-model="tablePawnItem.haveStones" type="checkbox" class="checkbox-primary checkbox" />
                      </label>
                      <div class="flex gap-2" :class="{ disabled: !tablePawnItem.haveStones }">
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
      </x-section>

      <x-section
        class="h-full w-full overflow-hidden rounded-tr-[3rem] bg-neutral text-neutral-content"
        :class="[slideFromMenu(selectPawnItems)]"
        hide-titlebar
      >
        <div class="mb-2 flex h-12 items-center justify-between">
          <h3 class="flex items-center gap-1"><component :is="category.icon" class="text-primary" /> Add {{ category.text }} Item</h3>
          <button class="btn-accent btn-circle btn" @click.stop="closeSelectItem()"><component :is="icon.check" /></button>
        </div>
        <div class="tab-content grid-cols-fit-md grid gap-4">
          <a
            v-for="(pawItem, idx) of pawItems"
            :key="pawItem.text"
            class="card flex-row items-center gap-2 bg-base-100 text-base-content"
            @click.stop="addPawnItem(idx)"
          >
            <component
              :is="pawItem.icon"
              class="rounded-box h-20 w-20 flex-none scale-90 bg-neutral p-3 text-neutral-content duration-300"
              :class="{ '!bg-primary !text-primary-content': idx === activePawnItemIndex }"
            />
            <span class="w-full duration-300" :class="{ 'text-primary': idx === activePawnItemIndex }">{{ pawItem.text }}</span>
          </a>
          <a class="card flex-row items-center gap-2 bg-accent text-accent-content" @click.stop="createPawnItem()">
            <component :is="icon.plus" class="rounded-box h-20 w-20 flex-none scale-90 bg-neutral p-3 text-neutral-content duration-300" />
            <span class="w-full duration-300">Add New</span>
          </a>
        </div>
      </x-section>

      <x-section class="h-full w-full overflow-hidden rounded-tr-[3rem] bg-neutral text-neutral-content" :class="[slideFromMenu(editPawnItem)]" hide-titlebar>
        <div class="mb-2 flex h-12 items-center justify-between">
          <h3 class="flex items-center gap-1"><component :is="activePawnItem.icon" class="text-primary" /> Jewelry > {{ activePawnItem.text }}</h3>
        </div>
        <div class="flex flex-col gap-2">
          <label class="flex cursor-pointer items-center gap-4">
            <span class="label-text text-primary">Have Stones</span>
            <input v-model="tablePawnItem.haveStones" type="checkbox" class="checkbox-primary checkbox" />
          </label>
          <div class="flex gap-2" :class="{ disabled: !tablePawnItem.haveStones }">
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
        <div class="mt-6 flex gap-4">
          <button class="btn-outline btn-secondary btn gap-1" @click.stop="removePawnItem()"><component :is="icon.xMark" />Remove</button>
          <button class="btn-primary btn gap-1" @click.stop="confirmPawnItem()"><component :is="icon.check" /> Confirm</button>
        </div>
      </x-section>
    </div>
    <div class="h-full w-1/2">
      <x-section class="h-full w-full" draggable-titlebar>
        <div class="flex flex-col gap-4">
          <div class="card">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="mask mask-hexagon m-4 w-32">
                  <img src="https://assets.mycast.io/actor_images/actor-nancy-jewel-mcdonie-116861_large.jpg?1596711861" />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <h3>Nancy McDonie</h3>
                <p>F. Torres Street, Wilfredo Aquino, Davao City, 8000</p>
                <p>0912 345 6789</p>
              </div>
            </div>
          </div>

          <form id="loan" class="form flex-1" @submit.prevent="submitForm">
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Ticket No.</span>
              <input v-model="loan.ticketNumber" type="text" placeholder="Ticket Number" class="input-bordered input w-2/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Loan Date</span>
              <input v-model="loan.loanDate" type="date" placeholder="Loan Date" class="input-bordered input w-2/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Maturity Date</span>
              <input v-model="loan.maturityDate" type="date" placeholder="Maturity Date" class="input-bordered input w-2/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Expiry Date</span>
              <input v-model="loan.expiryDate" type="date" placeholder="Expiry Date" class="input-bordered input w-2/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Appraise Value</span>
              <input type="number" placeholder="Appraise Value" class="input-bordered input w-2/3" readonly :value="appraiseValue" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Principal Amount</span>
              <input v-model="loan.principalAmount" type="number" placeholder="Principal Amount" class="input-bordered input w-2/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Monthly (%)</span>
              <input v-model="loan.monthly[0]" type="number" placeholder="First Month" class="input-bordered input w-1/3" />
              <input v-model="loan.monthly[1]" type="number" placeholder="Other Month" class="input-bordered input w-1/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Liquidation (%)</span>
              <input v-model="loan.liquidation" type="number" placeholder="Liquidation (%)" class="input-bordered input w-2/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Interest Amount</span>
              <input v-model="loan.interestAmount[0]" type="number" placeholder="" class="input-bordered input w-1/3" />
              <input v-model="loan.interestAmount[1]" type="number" placeholder="" class="input-bordered input w-1/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Service Charge</span>
              <input v-model="loan.serviceCharge[0]" type="number" placeholder="" class="input-bordered input w-1/3" />
              <input v-model="loan.serviceCharge[1]" type="number" placeholder="" class="input-bordered input w-1/3" />
            </label>
            <label class="input-group w-full">
              <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Net Proceeds</span>
              <input v-model="loan.netProceeds" type="number" placeholder="Net Proceeds" class="input-bordered input w-2/3" />
            </label>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Pawn Description</span>
              </label>
              <textarea
                ref="pawnDescriptionRef"
                v-model="pawnDescription"
                class="textarea-bordered textarea w-full resize-none overflow-hidden"
                placeholder="Pawn Description"
              />
            </div>
          </form>
        </div>
      </x-section>
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
