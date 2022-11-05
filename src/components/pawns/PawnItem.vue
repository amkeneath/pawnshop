<script setup lang="ts">
import { DisplayPawnItem } from '~/shims'

interface Props {
  pawnItem?: DisplayPawnItem
}

const props = withDefaults(defineProps<Props>(), {
  pawnItem: undefined
})

const { pawnItem } = toRefs(props)
</script>

<template>
  <a class="card flex flex-row gap-4 rounded-lg p-6 drop-shadow">
    <div class="flex w-24 flex-none">
      <x-icon icon="heroicons-ticket" class="m-auto h-14 w-14" />
    </div>
    <div class="flex-1">
      <div>
        <h2 class="mb-3">No. {{ pawnItem?.ticketNumber }}</h2>
        <div class="flex gap-4">
          <div class="flex flex-col gap-1">
            <div>Type:</div>
            <div>Items:</div>
            <div>Principal:</div>
            <div>Expiry:</div>
            <div>Pawner:</div>
          </div>
          <div class="flex flex-col gap-1">
            <div>{{ pawnItem?.pawnType }}</div>
            <div>{{ pawnItem?.items }}</div>
            <div>{{ pawnItem?.principalAmount }}</div>
            <div>{{ pawnItem?.expiryDate }}</div>
            <div>{{ pawnItem?.pawner }}</div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>
