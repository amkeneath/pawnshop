// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    // Do something
  },
  onOfflineReady() {
    // Do something
  }
})
