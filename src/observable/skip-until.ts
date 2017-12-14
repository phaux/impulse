import { Observable } from '../observable.js'
import { Subscription } from '../subscription'

export function skipUntil<T>(
  this: Observable<T>,
  start$: Observable<any>
): Observable<T>
{
  return new Observable(({next, error, complete}) => {

    let started = false

    const thisSub = this.subscribe({
      next: val => { if (started) return next(val) },
      error, complete,
    })

    let startSub: Subscription
    startSub = start$.subscribe({
      next: () => {
        started = true
        if (startSub) startSub.unsubscribe()
      },
      error,
      complete: () => { started = true },
    })

    if (started) startSub.unsubscribe()

    return () => {
      thisSub.unsubscribe()
      startSub.unsubscribe()
    }

  })
}

Observable.prototype.skipUntil = skipUntil

declare module '../observable.js' {
  export interface Observable<T> {
    skipUntil: typeof skipUntil
  }
}
