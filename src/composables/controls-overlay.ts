import { XWorkerNavigator } from '~/shims'

const setOverlay = (): void => {
  const xNavigator: XWorkerNavigator = navigator
  if (xNavigator?.windowControlsOverlay?.visible) {
    document.querySelector('#title-bar')?.classList.remove('hidden')
    document.querySelectorAll('.h-titlebar')?.forEach((element) => {
      element.classList.remove('hidden')
    })
  } else {
    document.querySelector('#title-bar')?.classList.add('hidden')
    document.querySelectorAll('.h-titlebar')?.forEach((element) => {
      element.classList.add('hidden')
    })
  }
  if (xNavigator?.windowControlsOverlay?.getTitlebarAreaRect) {
    const { x } = xNavigator.windowControlsOverlay.getTitlebarAreaRect()
    if (x !== 0) {
      document.querySelector('#title-bar')?.classList.add('controls-left')
    }
  }
}

export { setOverlay }
