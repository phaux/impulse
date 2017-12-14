import { Observable } from '../../observable.js'

export function static$interval(ms: number): Observable<number> {
  return new Observable(emit => {
    let i = 0
    const interval = setInterval(() => emit.next(i++), ms)
    return () => clearInterval(interval)
  })
}

Observable.interval = static$interval

declare module '../../observable.js' {
  namespace Observable {
    export let interval: typeof static$interval
  }
}

// TODO test
