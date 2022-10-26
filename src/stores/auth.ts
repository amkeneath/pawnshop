import { acceptHMRUpdate, defineStore } from 'pinia'

import { AuthData } from '~/shims'

export const useAuthStore = defineStore('auth', () => {
  const URL = {
    login: '/login',
    logout: '/logout'
  }

  const userStorage = useLocalStorage('user', '')

  const user = ref(userStorage.value)
  const loggedIn = ref(!!userStorage.value)
  const superUser = ref(false)

  const url = ref('')
  const auth = reactive<AuthData>({ username: '', password: '' })
  const { abort, canAbort, execute, error, data, isFetching, statusCode } = useMyFetch(url, { immediate: false }).post(auth).text()

  function _fetch(fetchURL: string, username = '', password = ''): void {
    if (canAbort.value) abort()
    url.value = fetchURL
    auth.username = username
    auth.password = password
    execute()
  }
  function login({ username, password }: AuthData): void {
    console.log('login')
    _fetch(URL.login, username, password)
    // const formData = new FormData()
    // Object.entries(loginData).forEach((entry) => {
    //   formData.append(...entry)
    // })
  }

  function logout(): void {
    console.log('logout')
    _fetch(URL.logout)
  }

  watch([data, url], ([newData, newUrl]) => {
    console.log('changes')
    loggedIn.value = newUrl === URL.login && newData === 'success' && statusCode.value === 200
  })
  watch(loggedIn, (newLoggedIn) => {
    user.value = newLoggedIn ? auth.username : ''
    userStorage.value = user.value
    location.reload()
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
    statusCode,
    superUser
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
