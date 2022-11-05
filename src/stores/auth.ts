import { acceptHMRUpdate, defineStore } from 'pinia'

import { AuthData } from '~/shims'

export const useAuthStore = defineStore('auth', () => {
  const AUTH_URL = { login: '/login', logout: '/logout' }
  const userStorage = useLocalStorage('user', '')
  const auth = reactive<AuthData>({ username: '', password: '' })
  const url = ref('')

  const user = ref(userStorage.value)
  const loggedIn = ref(!!userStorage.value)
  const superUser = ref(false)

  // FETCH
  const { abort, canAbort, data, error, execute, isFetching, onFetchError, onFetchResponse } = useMyFetch(url, { immediate: false }).post(auth).text()

  // METHODS
  function _fetch(fetchURL: string, username = '', password = ''): void {
    if (canAbort.value) abort()
    url.value = fetchURL
    auth.username = username
    auth.password = password
    execute()
  }
  function login({ username, password }: AuthData): void {
    _fetch(AUTH_URL.login, username, password)
  }
  function logout(): void {
    _fetch(AUTH_URL.logout)
  }

  // LISTENERS
  watch(loggedIn, (newLoggedIn) => {
    user.value = newLoggedIn ? auth.username : ''
    userStorage.value = user.value
    location.reload() // FORCE PAGE TO RELOAD WHEN LOGGED IN STATUS CHANGED
  })

  onFetchResponse((response) => {
    const path = new URL(response.url).pathname
    console.log('RESPONSE:onFetch', response)
    loggedIn.value = path === AUTH_URL.login && data.value === 'success'
  })
  onFetchError((error) => {
    console.log('ERROR:onFetch', error)
  })

  return {
    loggedIn,
    user,
    login,
    logout,
    canAbort,
    data,
    error,
    isFetching,
    superUser
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
