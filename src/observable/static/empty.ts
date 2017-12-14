import { Observable } from '../../observable.js'

export function static$empty(): Observable<never> {
  return new Observable<never>(emit => {
    emit.complete()
  })
}

Observable.empty = static$empty

declare module '../../observable.js' {
  namespace Observable {
    export let empty: typeof static$empty
  }
}

// TODO test
