import { RouterMiddlewareContext } from '~/middleware/router'

export default function auth({ next, auth }: RouterMiddlewareContext): void {
  if (!auth.loggedIn) {
    return next({
      name: 'login'
    })
  }

  return next()
}
