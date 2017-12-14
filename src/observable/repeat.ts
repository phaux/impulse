import { Observable } from '../observable.js'
import { IntoObservable } from '../types'
import { Subject } from '../subject'
import { Subscription } from '../subscription'

export function repeat<T>(
  this: Observable<T>,
  fn: (complete$: Observable<any>) => IntoObservable<any>,
): Observable<T>
{
  return new Observable(({next, error, complete}) => {

    const complete$ = new Subject<any>()

    const resub = () => this.subscribe({
      next, error,
      complete: val => complete$.next(val),
    })

    const repeat$ = Observable.from(fn(Observable.from(complete$)))

    let sub: Subscription | undefined
    repeat$.subscribe({
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

Observable.prototype.repeat = repeat

declare module '../observable.js' {
  export interface Observable<T> {
    repeat: typeof repeat
  }
}
