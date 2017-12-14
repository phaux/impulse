import { Observable } from '../observable.js'

export function map<T, U>(
  this: Observable<T>,
  fn: (val: T) => U,
): Observable<U>
{
  return new Observable<U>(({next, error, complete}) =>
    this.subscribe({
      next: val => next(fn(val)),
      error, complete,
    })
  )
}

Observable.prototype.map = map

declare module '../observable.js' {
  export interface Observable<T> {
    map: typeof map
  }
}
