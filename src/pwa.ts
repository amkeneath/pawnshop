import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    // Do something
  },
  onOfflineReady() {
    // Do something
  }
})
