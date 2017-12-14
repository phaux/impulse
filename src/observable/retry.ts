import { Observable } from '../observable.js'
import { IntoObservable } from '../types'
import { Subject } from '../subject'
import { Subscription } from '../subscription'

export function retry<T>(
  this: Observable<T>,
  fn: (error$: Observable<Error>) => IntoObservable<any>,
): Observable<T>
{
  return new Observable(({next, error, complete}) => {

    const error$ = new Subject<any>()

    const resub = () => this.subscribe({
      next, complete,
      error: err => error$.next(err),
    })

    const retry$ = Observable.from(fn(Observable.from(error$)))

    let sub: Subscription | undefined
    retry$.subscribe({
      next: () => {
        if (sub) sub.unsubscribe()
        sub = resub()
      },
      error, complete,
    })
    if (!sub) sub = resub()

    return () => { if (sub) sub.unsubscribe() }

  })
}

Observable.prototype.retry = retry

declare module '../observable.js' {
  export interface Observable<T> {
    retry: typeof retry
  }
}
