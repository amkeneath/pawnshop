import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  /**
   * Current named of the user.
   */
  const savedName = ref('')
  const previousNames = ref(new Set<string>())

  const usedNames = computed(() => Array.from(previousNames.value))
  const otherNames = computed(() => usedNames.value.filter((name) => name !== savedName.value))

  function setNewName(name: string): void {
    if (savedName.value) previousNames.value.add(savedName.value)
    savedName.value = name
  }

  return {
    setNewName,
    otherNames,
    savedName
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
