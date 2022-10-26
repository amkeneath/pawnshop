import { WorkerNavigator } from '~/shims'

import { getAddOrRemove } from './string'

const _navigator: WorkerNavigator = navigator

// REFERENCES
const isOverlayVisible = ref(false)
const controlsOnRight = ref(false)

// METHODS
function updateOverlay(): void {
  isOverlayVisible.value = !!_navigator.windowControlsOverlay?.visible
  const onRight = (controlsOnRight.value = _navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.x === 0)
  document.querySelector('#title-bar')?.classList[getAddOrRemove(onRight)]('controls-on-right')
}

// INITIALIZE
updateOverlay()

// EXPORT
const _isOverlayVisible = readonly(isOverlayVisible)
export { controlsOnRight, _isOverlayVisible as isOverlayVisible, updateOverlay }
