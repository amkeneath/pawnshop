<script setup lang="ts">
import { LayoutCardSize, LayoutCardState } from '~/shims'

interface Props {
  cardState?: LayoutCardState
  cardSize?: LayoutCardSize
  cardFocus?: boolean
}

// PROPS
const props = withDefaults(defineProps<Props>(), {
  cardState: undefined,
  cardSize: undefined,
  cardFocus: false
})
const { cardState, cardSize } = toRefs(props)

//CONSTANTS
const CARD_STATE = {
  hidden: 'hidden',
  show: 'show'
}
const CARD_SIZE = {
  full: 'full',
  box: 'box'
}

// REFERENCES
const cardElement = ref<HTMLDivElement>()

const { height, width } = useElementSize(cardElement)

watch(
  [height, width, cardState, cardSize],
  ([newHeight, newWidth, newCardState, newCardSize], [oldHeight, oldWidth, oldCardState, oldCardSize]) => {
    if (cardElement.value) {
      if (newWidth !== oldWidth || newCardState !== oldCardState) {
        if (newCardState === CARD_STATE.hidden) cardElement.value.style.right = `-${newWidth}px`
        else cardElement.value.style.right = ''
      }

      if (newHeight !== oldHeight || newCardSize !== oldCardSize) {
        if (newCardSize === CARD_SIZE.box) cardElement.value.style.width = `${newHeight}px`
        else if (newCardSize === CARD_SIZE.full) cardElement.value.style.width = '100%'
        else cardElement.value.style.width = ''
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <section ref="section" class="x-split-section">
    <div class="content">
      <slot />
    </div>
    <div ref="cardElement" class="card" :class="{ focus: cardFocus }">
      <slot name="card" />
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.x-split-section {
  @apply h-full w-full overflow-hidden relative;

  & .content {
    @apply h-full w-1/2;
  }

  & .card {
    @apply w-1/2 h-full bg-neutral text-neutral-content absolute right-0 top-0 rounded-none rounded-tl-[3rem] duration-300 max-w-full;

    &.focus {
      @apply focus-element;
    }
  }
}
</style>
