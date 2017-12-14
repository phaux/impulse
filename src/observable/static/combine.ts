import { Observable } from '../../observable.js'
import { IntoObservable } from '../../types'

export function static$combine<T>(...$s: Array<IntoObservable<T>>): Observable<T[]>
export function static$combine<T1, T2>(
  $1: IntoObservable<T1>, $2: IntoObservable<T2>,
): Observable<[T1, T2]>
export function static$combine<T1, T2, T3>(
  $1: IntoObservable<T1>, $2: IntoObservable<T2>, $3: IntoObservable<T3>,
): Observable<[T1, T2, T3]>
export function static$combine<T1, T2, T3, T4>(
  $1: IntoObservable<T1>, $2: IntoObservable<T2>,
  $3: IntoObservable<T3>, $4: IntoObservable<T4>,
): Observable<[T1, T2, T3, T4]>
export function static$combine<T1, T2, T3, T4, T5>(
  $1: IntoObservable<T1>, $2: IntoObservable<T2>, $3: IntoObservable<T3>,
  $4: IntoObservable<T4>, $5: IntoObservable<T5>,
): Observable<[T1, T2, T3, T4, T5]>
export function static$combine(...$s: Array<IntoObservable<any>>): Observable<any[]>
{
  const EMPTY = Symbol('empty')
  const state: any[] = $s.map(() => EMPTY)
  return new Observable(({next, error, complete}) => {
    const subs = $s.map(($, i) =>
      Observable.from($).subscribe({
        next: val => {
          state[i] = val
          if (state.some(val => val === EMPTY)) return
          return next(state)
        },
        error, complete,
      }),
    )
    return () => subs.forEach(sub => sub.unsubscribe())
  })
}
Observable.combine = static$combine

declare module '../../observable.js' {
  namespace Observable {
    export let combine: typeof static$combine
  }
}
