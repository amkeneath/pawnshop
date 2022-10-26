import { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'

import { useAuthStore } from '~/stores/auth'

import auth from './auth'
import guest from './guest'
import superUser from './super-user'

export interface RouterMiddlewareContext {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  auth: any
}
export type RouterMiddlewareFunction = (context: RouterMiddlewareContext) => void
export interface RouterMiddlewareFunctions {
  auth: RouterMiddlewareFunction
  guest: RouterMiddlewareFunction
  superUser: RouterMiddlewareFunction
}
export type RouterMiddlewareKey = keyof RouterMiddlewareFunctions

const middlewareFunctions = { auth, guest, superUser } as RouterMiddlewareFunctions

function middlewarePipeline(context: RouterMiddlewareContext, middlewareKeys: Array<RouterMiddlewareKey>, index: number): NavigationGuardNext {
  const nextMiddleware = middlewareFunctions[middlewareKeys[index]]

  if (!nextMiddleware) {
    return context.next
  }

  return (): void => {
    const nextPipeline = middlewarePipeline(context, middlewareKeys, index + 1)
    nextMiddleware({ ...context, next: nextPipeline })
  }
}

function middleware(router: Router): void {
  router.beforeEach((to, from, next): void => {
    if (!to.meta.middleware) {
      return next()
    }
    const auth = useAuthStore()
    const context = { to, from, next, auth } as RouterMiddlewareContext
    const middlewareKeys = to.meta.middleware as Array<RouterMiddlewareKey>

    return middlewareFunctions[middlewareKeys[0]]?.({
      ...context,
      next: middlewarePipeline(context, middlewareKeys, 1)
    })
  })
}

export default middleware
