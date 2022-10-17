import { type UserModule } from '~/types'

export const install: UserModule = ({ router }) => {
  if (typeof window === 'undefined') return

  router.isReady().then(async () => {
    // eslint-disable-next-line import/no-unresolved
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({
      immediate: true,
      onNeedRefresh() {
        // Do something
      },
      onOfflineReady() {
        // Do something
      }
    })
  })
}
