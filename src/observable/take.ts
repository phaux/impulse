import { Observable } from '../observable.js'

export function take<T>(this: Observable<T>, n: number): Observable<T> {
  return new Observable(({next, error, complete}) => {
    let i = n
    return this.subscribe({
      next: val => {
        if (--i < 0) complete()
        else next(val)
      },
      error, complete,
    })
  })
}

Observable.prototype.take = take

declare module '../observable.js' {
  export interface Observable<T> {
    take: typeof take
  }
}
