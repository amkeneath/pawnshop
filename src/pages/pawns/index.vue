<script setup lang="ts">
import { DisplayPawnItems, Pawns, TableHeads } from '~/shims'
import { usePawnStore } from '~/stores/pawns'

const tableHeaders: TableHeads = [
  { text: 'Ticket No.', value: 'ticketNumber' },
  { text: 'Type', value: 'pawnType' },
  { text: 'Items', value: 'items' },
  { text: 'Principal', value: 'principalAmount', align: 'right' },
  { text: 'Expiry', value: 'expiryDate' },
  { text: 'Pawner', value: 'pawner' }
]

const el = ref<HTMLElement>()

const pawnStore = usePawnStore()
const pawns = ref<Pawns>([])
const tableDisplay = ref(false)

const route = useRoute()
const router = useRouter()

const { pawnTypes } = toRefs(pawnStore)

const pawnItems = computed<DisplayPawnItems>(() =>
  [...pawns.value].map((pawn) => ({
    id: pawn.id,
    ticketNumber: pawn.ticketNumber,
    pawnType: pawnTypes.value.find(({ id }) => id === pawn.pawnTypeId)?.text || 'Type',
    items: pawn.pawnItems.length,
    principalAmount: groupedDecimals(pawn.principalAmount),
    expiryDate: pawn.expiryDate,
    pawner: 'Nancy McDonie'
  }))
)

const isFetching = ref(false)
let timeout: number

async function getPawns(): Promise<void> {
  clearTimeout(timeout)
  isFetching.value = true
  timeout = setTimeout(async () => {
    try {
      const newPawns = await pawnStore.get()
      pawns.value.push(...newPawns)
    } catch (error) {
      console.log('ERROR:getPawns', error)
    }
    isFetching.value = false
  }, 1000)
}
function setTableDisplay(value = true): void {
  tableDisplay.value = value
}
function itemClicked(index: number): void {
  router.push(`${route.path}/${pawnItems.value[index]?.id}`)
}

useInfiniteScroll(
  el,
  async () => {
    await getPawns()
  },
  { distance: 0 }
)

onMounted(async () => {
  await getPawns()
})
</script>

<template>
  <x-section ref="el" class="flex h-full w-full flex-col overflow-y-auto">
    <div>
      <div class="mb-2 flex h-12 flex-none items-center justify-between">
        <h3 class="flex items-center">Pawn Pawns</h3>
      </div>
      <div class="mb-2 flex flex-none gap-2">
        <label class="input-group w-96">
          <span><x-icon icon="heroicons-magnifying-glass" /></span>
          <select class="select-bordered select">
            <option selected>Ticket No.</option>
            <option>Pawner</option>
          </select>
          <input class="input-bordered input w-full" type="text" placeholder="Search" />
        </label>
        <label class="input-group w-auto">
          <span><x-icon icon="heroicons-calendar" /></span>
          <select class="select-bordered select">
            <option selected>Expiry Date</option>
            <option>Maturity Date</option>
            <option>Loan Date</option>
          </select>
          <input class="input-bordered input w-full" type="date" placeholder="Date" />
          <input class="input-bordered input w-full" type="date" placeholder="Date" />
        </label>
        <label class="input-group w-40">
          <span>Status</span>
          <select class="select-bordered select w-full">
            <option selected>All</option>
            <option>Renewal</option>
            <option>Renewed</option>
          </select>
        </label>
      </div>
      <div class="mb-2 flex gap-4">
        <div class="btn-group">
          <button class="btn-sm btn" :class="{ 'btn-active': !tableDisplay }" @click.stop="setTableDisplay(false)">
            <x-icon icon="heroicons-squares-2x2" />
          </button>
          <button class="btn-sm btn" :class="{ 'btn-active': tableDisplay }" @click.stop="setTableDisplay(true)"><x-icon icon="heroicons-queue-list" /></button>
        </div>
        <label class="input-group w-40">
          <span><x-icon icon="heroicons-bars-3" /></span>
          <select class="select-bordered select select-sm w-full">
            <option selected>By Expiry Date</option>
            <option>By Maturity Date</option>
            <option>By Loan Date</option>
          </select>
        </label>
      </div>
    </div>
    <div class="">
      <div v-if="!tableDisplay" class="grid grid-cols-3 gap-4">
        <router-link v-for="pawnItem of pawnItems" :key="pawnItem.id" :to="`${route.path}/${pawnItem.id}`">
          <pawn-item :pawn-item="pawnItem" class="duration-300 hover:text-primary" />
        </router-link>
        <button class="btn-ghost btn h-full" :class="[{ loading: isFetching }, isFetching ? 'gap-2' : 'gap-3']" @click="getPawns()">
          <x-icon v-if="!isFetching" icon="heroicons-plus" />
          {{ isFetching ? 'Loading' : 'Load More' }}
        </button>
      </div>
      <div v-else>
        <x-table :heads="tableHeaders" :items="pawnItems" item-clickable @item-clicked="itemClicked($event)" />
        <button class="btn-ghost btn w-full" :class="[{ loading: isFetching }, isFetching ? 'gap-2' : 'gap-3']" @click="getPawns()">
          <x-icon v-if="!isFetching" icon="heroicons-plus" />
          {{ isFetching ? 'Loading' : 'Load More' }}
        </button>
      </div>
    </div>
  </x-section>
</template>
