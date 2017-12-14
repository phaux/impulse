import { Observable } from '../observable.js'

export function endWith<T>(this: Observable<T>, value: T): Observable<T> {
  return new Observable(({next, error, complete}) =>
    this.subscribe({
      next, error,
      complete: val => {
        next(value)
        return complete(val)
      },
    })
  )
}

Observable.prototype.endWith = endWith

declare module '../observable.js' {
  export interface Observable<T> {
    endWith: typeof endWith
  }
}
