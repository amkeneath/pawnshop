import { acceptHMRUpdate, defineStore } from 'pinia'

const versionString = import.meta.env.MODE === 'development' ? import.meta.env.VITE_APP_VERSION + '-dev' : import.meta.env.VITE_APP_VERSION

export const useStore = defineStore('main', () => {
  const appVersion = versionString

  return {
    appVersion
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
