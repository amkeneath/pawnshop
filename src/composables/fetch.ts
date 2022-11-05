import { createFetch } from '@vueuse/core'

const fetchOptions: RequestInit = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
}

const METHOD = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE'
}

const baseUrl: string = import.meta.env.VITE_FETCH_URL

const useMyFetch = createFetch({
  baseUrl,
  options: {
    async beforeFetch({ options }) {
      await console.log('Do something before fetch')
      return { options }
    }
  },
  fetchOptions
})

class MyFetch {
  #url: string

  constructor(url = '/') {
    this.#url = `${baseUrl}${`/${url}`.replaceAll('//', '/')}`
  }

  async #fetch(method = METHOD.post, params = {} as Record<string, string>, body = undefined as unknown): Promise<Response> {
    const _params = new URLSearchParams(params).toString()
    const url = `${this.#url}${_params ? `?${_params}` : ''}`

    return await fetch(url, {
      ...fetchOptions,
      method,
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async get(params?: Record<string, string>): Promise<Response> {
    return await this.#fetch(METHOD.get, params)
  }

  async post(body?: unknown): Promise<Response> {
    return await this.#fetch(METHOD.post, undefined, body)
  }

  async put(body?: unknown): Promise<Response> {
    return await this.#fetch(METHOD.put, undefined, body)
  }

  async patch(body?: unknown): Promise<Response> {
    return await this.#fetch(METHOD.patch, undefined, body)
  }

  async delete(body?: unknown): Promise<Response> {
    return await this.#fetch(METHOD.delete, undefined, body)
  }
}

function myFetch(url: string): MyFetch {
  return new MyFetch(url)
}

export { myFetch, useMyFetch }
