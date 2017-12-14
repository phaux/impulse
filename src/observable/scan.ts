import { Observable } from '../observable.js'

export function scan<T, U>(
  this: Observable<T>,
  init: U,
  fn: (prev: U, next: T) => U,
): Observable<U>
{
  return new Observable(({next, error, complete}) => {
    let state = init
    next(state)
    return this.subscribe({
      next: (val: T) => {
        state = fn(state, val)
        return next(state)
      },
      error, complete,
    })
  })
}

Observable.prototype.scan = scan

declare module '../observable.js' {
  export interface Observable<T> {
    scan: typeof scan
  }
}
