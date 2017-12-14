import { Observable } from '../observable.js'

export function skip<T>(this: Observable<T>, n: number): Observable<T> {
  return new Observable(({next, error, complete}) => {
    let i = n
    return this.subscribe({
      next: val => { if (--i < 0) next(val) },
      error, complete,
    })
  })
}

Observable.prototype.skip = skip

declare module '../observable.js' {
  export interface Observable<T> {
    skip: typeof skip
  }
}
