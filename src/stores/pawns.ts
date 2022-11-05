import { acceptHMRUpdate, defineStore } from 'pinia'

import { Pawn, Pawns, PawnType, PawnTypes } from '~/shims'

const _URL = {
  pawns: 'pawns',
  pawnTypes: 'pawn-types'
}

export const usePawnStore = defineStore('pawns', () => {
  const pawnTypes = ref<PawnTypes>([])

  async function get(id?: number): Promise<Pawns> {
    const url = `${_URL.pawns}${id ? `/${id}` : ''}`
    return await (await myFetch(url).get()).json()
  }
  async function add(pawn: Pawn): Promise<Response> {
    const response = await myFetch(_URL.pawns).put(pawn)
    // get()
    return response
  }

  async function getTypes(): Promise<PawnTypes> {
    if (pawnTypes.value.length) return pawnTypes.value
    return (pawnTypes.value = await (await myFetch(_URL.pawnTypes).get()).json())
  }
  async function addType(pawnType: PawnType): Promise<Response> {
    const response = await myFetch(_URL.pawnTypes).put(pawnType)
    // getTypes()
    return response
  }

  // INITIALIZE
  getTypes()

  return {
    add,
    get,
    addType,
    getTypes,
    pawnTypes
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(usePawnStore, import.meta.hot))
