import { Observable } from '../observable.js'

export function toPromise<T>(this: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    let value: T
    this.subscribe({
      next: val => value = val,
      error: err => reject(err),
      complete: () => resolve(value),
    })
  })
}

Observable.prototype.toPromise = toPromise

declare module '../observable.js' {
  export interface Observable<T> {
    toPromise: typeof toPromise
  }
}
