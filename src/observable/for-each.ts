import { Observable } from '../observable.js'

export function forEach<T>(
  this: Observable<T>,
  next: (value: T) => any,
): Promise<any>
{
  return new Promise((complete, error) => {
    this.subscribe({next, error, complete})
  })
}

Observable.prototype.forEach = forEach

declare module '../observable.js' {
  export interface Observable<T> {
    forEach: typeof forEach
  }
}
