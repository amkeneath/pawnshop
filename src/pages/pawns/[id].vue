<script setup lang="ts">
import { Pawn, PawnItems, TablePawnItem, TablePawnItems } from '~/shims'
import { usePawnStore } from '~/stores/pawns'

// STATICS
const stoneTypes = ['Gold', 'Diamond', 'Ruby', 'Sapphire']
const karats = ['6K', '8K', '9K', '10K', '12K', '14K', '15K', '18K', '20K', '21K', '22K', '24K']
const weights = ['Grams (g)', 'Milligrams (mg)', 'Kilograms (kg)', 'Pounds (lbs)']

const props = defineProps<{ id: string }>()

const pawnStore = usePawnStore()

const { pawnTypes } = toRefs(pawnStore)

// REACTIVE
const pawn = reactive<Pawn>({
  id: -1,
  pawnTypeId: -1,
  clientId: -1,
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
  pawnItems: [] as PawnItems
})

const tablePawnItems = ref([] as TablePawnItems)

const pawnTypeIndex = ref(0)

// COMPUTED
const appraiseValue = computed(() => [...tablePawnItems.value].map((item) => item.appraiseValue).reduce((accumulator, value): number => accumulator + value, 0))
const pawnType = computed(() => pawnTypes.value?.[pawnTypeIndex.value])

// USE
const { textarea: pawnDescriptionRef, input: pawnDescription } = useTextareaAutosize()

// METHODS
function tablePawnItemDescription(item: TablePawnItem): string {
  return item.haveStones ? `${item.stone} | ${item.purity} | ${groupedDecimals(item.weight, 2, 1)}${item.weightUnit.match(/\(([^)]+)\)/)?.[1]}` : 'No stones'
}
function toggleTablePawnItemDetails(index: number): void {
  tablePawnItems.value[index].open = !tablePawnItems.value[index].open
}
function expandAllTablePawnItems(expand = true): void {
  tablePawnItems.value.forEach((item) => (item.open = expand))
}

function submitForm(): void {
  // Do something
}
onBeforeMount(async () => {
  const newPawn = (await pawnStore.get(+props.id))[0]
  Object.assign(pawn, newPawn)

  tablePawnItems.value = newPawn.pawnItems.map((pawnItem) => ({ ...pawnItem, open: false }))
  pawnDescription.value = newPawn.pawnDescription
  pawnTypeIndex.value = Math.max(
    pawnTypes.value.findIndex(({ id }) => id === newPawn.pawnTypeId),
    0
  )
})
</script>

<template>
  <section class="flex h-full w-full">
    <div class="relative h-full w-1/2 overflow-hidden border-l">
      <x-section class="h-full w-full overflow-hidden rounded-tr-[3rem] bg-neutral text-neutral-content">
        <div class="mb-4 flex h-14 items-center justify-between">
          <h3 class="flex items-center gap-1"><x-icon icon="heroicons-star" class="text-primary" /> Pawn > {{ pawnType?.text }}</h3>
        </div>
        <table v-if="tablePawnItems.length > 0" class="card table w-full">
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
                    class="dropdown-content menu rounded-box menu-compact mt-3 flex w-52 flex-row justify-center bg-base-100 p-2 text-base-content"
                  >
                    <div class="divider divider-horizontal m-0 py-3" />
                    <li>
                      <a @click.stop="expandAllTablePawnItems()">
                        <x-icon icon="heroicons-chevron-double-down" class="text-base" />
                      </a>
                    </li>
                    <li>
                      <a @click.stop="expandAllTablePawnItems(false)">
                        <x-icon icon="heroicons-chevron-double-up" class="text-base" />
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
                    <button class="swap btn-ghost swap-rotate btn-circle btn" @click.stop="toggleTablePawnItemDetails(idx)">
                      <input type="checkbox" :checked="tablePawnItem.open" />
                      <x-icon icon="heroicons-chevron-up" class="swap-on text-base" />
                      <x-icon icon="heroicons-chevron-down" class="swap-off text-base" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="disabled w-full">
                <td class="w-full bg-neutral p-0" colspan="100">
                  <div class="h-0 w-full overflow-hidden p-0 transition-all duration-300" :class="[{ open: tablePawnItem.open }]">
                    <div class="flex flex-col gap-2 p-4">
                      <label class="flex cursor-pointer items-center gap-4">
                        <span class="label-text text-primary">Have Stones</span>
                        <input v-model="tablePawnItem.haveStones" type="checkbox" class="checkbox-primary checkbox" />
                      </label>
                      <div class="flex gap-2" :class="{ disabled: !tablePawnItem.haveStones }">
                        <select v-model="tablePawnItem.stone" class="select-bordered select flex-1">
                          <option v-for="(type, idx2) of stoneTypes" :key="idx2" :value="type">{{ type }}</option>
                        </select>
                        <label class="input-group flex-1">
                          <span class="label-text min-w-[132px]">Purity</span>
                          <select v-model="tablePawnItem.purity" class="select-bordered select w-60 grow">
                            <option v-for="(karat, idx2) of karats" :key="idx2" :value="karat">{{ karat }}</option>
                          </select>
                        </label>
                      </div>
                      <label class="input-group w-full">
                        <input v-model="tablePawnItem.weight" class="input-bordered input grow" placeholder="Weight" type="number" />
                        <select v-model="tablePawnItem.weightUnit" class="select-bordered select w-60">
                          <option v-for="(weight, idx2) of weights" :key="idx2" :value="weight">{{ weight }}</option>
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
        <div v-else class="card bg-base-100 p-4">No Items added</div>
      </x-section>
    </div>
    <x-section class="pointer-events-none w-1/2 overflow-y-auto">
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

        <form id="pawn" class="form flex-1" @submit.prevent="submitForm()">
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Ticket No.</span>
            <input v-model="pawn.ticketNumber" type="text" placeholder="Ticket Number" class="input-bordered input w-2/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Pawn Date</span>
            <input v-model="pawn.loanDate" type="date" placeholder="Pawn Date" class="input-bordered input w-2/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Maturity Date</span>
            <input v-model="pawn.maturityDate" type="date" placeholder="Maturity Date" class="input-bordered input w-2/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Expiry Date</span>
            <input v-model="pawn.expiryDate" type="date" placeholder="Expiry Date" class="input-bordered input w-2/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Appraise Value</span>
            <input type="number" placeholder="Appraise Value" class="input-bordered input w-2/3" readonly :value="appraiseValue" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Principal Amount</span>
            <input v-model="pawn.principalAmount" type="number" placeholder="Principal Amount" class="input-bordered input w-2/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Monthly (%)</span>
            <input v-model="pawn.monthly[0]" type="number" placeholder="First Month" class="input-bordered input w-1/3" />
            <input v-model="pawn.monthly[1]" type="number" placeholder="Other Month" class="input-bordered input w-1/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Liquidation (%)</span>
            <input v-model="pawn.liquidation" type="number" placeholder="Liquidation (%)" class="input-bordered input w-2/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Interest Amount</span>
            <input v-model="pawn.interestAmount[0]" type="number" placeholder="" class="input-bordered input w-1/3" />
            <input v-model="pawn.interestAmount[1]" type="number" placeholder="" class="input-bordered input w-1/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Service Charge</span>
            <input v-model="pawn.serviceCharge[0]" type="number" placeholder="" class="input-bordered input w-1/3" />
            <input v-model="pawn.serviceCharge[1]" type="number" placeholder="" class="input-bordered input w-1/3" />
          </label>
          <label class="input-group w-full">
            <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Net Proceeds</span>
            <input v-model="pawn.netProceeds" type="number" placeholder="Net Proceeds" class="input-bordered input w-2/3" />
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
  </section>
</template>

<style lang="postcss" scoped>
.open {
  @apply h-72;
}
</style>
