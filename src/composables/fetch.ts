import { createFetch } from '@vueuse/core'

const useMyFetch = createFetch({
  baseUrl: import.meta.env.VITE_FETCH_URL,
  options: {
    async beforeFetch({ options }) {
      await console.log('Before fetch')
      return { options }
    }
  },
  fetchOptions: {
    mode: 'cors'
  }
})

export { useMyFetch }
