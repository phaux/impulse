import { Observable } from '../observable.js'
import { IntoObservable } from '../types'
import { Subscription } from '../subscription'

export function switchMap<T, U>(
  this: Observable<T>,
  fn: (val: T) => Observable<U>,
  max?: number,
): Observable<U>
export function switchMap<T, U>(
  this: Observable<T>,
  fn: (val: T) => Promise<U>,
  max?: number,
): Observable<U>
export function switchMap<T, U>(
  this: Observable<T>,
  fn: (val: T) => U[],
  max?: number,
): Observable<U>
export function switchMap<T, U>(
  this: Observable<T>,
  fn: (val: T) => IntoObservable<U>,
  max = 1,
): Observable<U>
{
  return new Observable(({next, error, complete}) => {

    let outerSub: Subscription | undefined
    const innerSubs: Subscription[] = []

    outerSub = this.subscribe({
      next: val => {
        const activeSubs = innerSubs.filter(sub => !sub.closed)
        if (activeSubs.length >= max) activeSubs[0].unsubscribe()
        const inner$ = Observable.from(fn(val))
        let innerSub: Subscription | undefined
        innerSub = inner$.subscribe({
          next, error,
          complete: val => {
            if (!outerSub || !outerSub.closed) return
            if (!innerSubs.every(s => s.closed || s === innerSub)) return
            complete(val)
          },
        })
        innerSubs.push(innerSub)
      },
      error,
      complete: val => {
        if (!outerSub) return
        if (!innerSubs.every(s => s.closed)) return
        complete(val)
      },
    })

    if (outerSub.closed && innerSubs.every(s => !!s.closed)) complete()

    return () => {
      innerSubs.forEach(s => s.unsubscribe())
      outerSub!.unsubscribe()
    }

  })
}

Observable.prototype.switchMap = switchMap

declare module '../observable.js' {
  export interface Observable<T> {
    switchMap: typeof switchMap
  }
}
