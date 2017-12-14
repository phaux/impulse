import { Observable } from '../../observable.js'
import { IntoObservable } from '../../types'
import { Subscription } from '../../subscription'

export function static$merge<T>(...$s: Array<Observable<T>>): Observable<T>
export function static$merge<T>(...$s: Array<Promise<T>>): Observable<T>
export function static$merge<T>(...$s: Array<T[]>): Observable<T>
export function static$merge<T>(...$s: Array<IntoObservable<T>>): Observable<T> {
  return new Observable(({next, error, complete}) => {
    const subs: Subscription[] = []
    for (const $ of $s) {
      let sub: Subscription | undefined
      sub = Observable.from($).subscribe({
        next, error, complete: val => {
          if (!sub) return
          if (!subs.every(s => s.closed || s === sub)) return
          complete(val)
        },
      })
      subs.push(sub)
    }
    if (subs.every(s => !!s.closed)) complete()
    return () => subs.forEach(s => s.unsubscribe())
  })
}

Observable.merge = static$merge

declare module '../../observable.js' {
  namespace Observable {
    export let merge: typeof static$merge
  }
}
