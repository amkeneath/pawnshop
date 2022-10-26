import { RouterMiddlewareContext } from '~/middleware/router'

export default function guest({ next, auth }: RouterMiddlewareContext): void {
  console.log('guest')
  if (auth.loggedIn) {
    return next({
      name: 'home'
    })
  }

  return next()
}
