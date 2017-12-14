import { Observable } from '../observable.js'

export function startWith<T>(this: Observable<T>, value: T): Observable<T> {
  return new Observable(emit => {
    emit.next(value)
    return this.subscribe(emit)
  })
}

Observable.prototype.startWith = startWith

declare module '../observable.js' {
  export interface Observable<T> {
    startWith: typeof startWith
  }
}
