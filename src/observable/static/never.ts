import { Observable } from '../../observable.js'

export function static$never(): Observable<never> {
  return new Observable<never>(() => {})
}

Observable.never = static$never

declare module '../../observable.js' {
  namespace Observable {
    export let never: typeof static$never
  }
}

// TODO test
