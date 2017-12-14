import { Observable } from '../observable.js'

export function toArray<T>(this: Observable<T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const arr: T[] = []
    this.subscribe({
      next: val => arr.push(val),
      error: err => reject(err),
      complete: () => resolve(arr),
    })
  })
}

Observable.prototype.toArray = toArray

declare module '../observable.js' {
  export interface Observable<T> {
    toArray: typeof toArray
  }
}
