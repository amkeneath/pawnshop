import './styles/main.postcss'

// eslint-disable-next-line import/no-unresolved
import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-unresolved
import generatedRoutes from 'virtual:generated-pages'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

const app = createApp(App)

const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })
app.use(router)

Object.values(import.meta.glob<{ install: any }>('./modules/*.ts', { eager: true })).map((i) => i.install?.({ app, router, routes }))

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

if (typeof window !== 'undefined') {
  // import('~/pwa')
}
