import { Observable } from '../observable.js'

export function filter<T, U extends T>(
  this: Observable<T>,
  fn: (val: T) => val is U
): Observable<U>
export function filter<T>(
  this: Observable<T>,
  fn: (val: T) => boolean,
): Observable<T>
{
  return new Observable(({next, error, complete}) =>
    this.subscribe({
      next: val => { if (fn(val)) return next(val) },
      error, complete,
    })
  )
}

Observable.prototype.filter = filter

declare module '../observable.js' {
  export interface Observable<T> {
    filter: typeof filter
  }
}
