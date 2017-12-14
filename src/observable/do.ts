import { Observable } from '../observable.js'

export function do_<T>(
  this: Observable<T>,
  cb: (val: T) => any,
): Observable<T>
{
  return new Observable(({next, error, complete}) => {
    return this.subscribe({
      next: val => {
        cb(val)
        return next(val)
      },
      error,
      complete,
    })
  })
}

Observable.prototype.do = do_

declare module '../observable.js' {
  export interface Observable<T> {
    do: typeof do_
  }
}
