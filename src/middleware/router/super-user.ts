import { RouterMiddlewareContext } from '~/middleware/router'

export default function superUser({ next, auth }: RouterMiddlewareContext): void {
  if (!auth.superUser) {
    return next({
      name: 'home'
    })
  }

  return next()
}
