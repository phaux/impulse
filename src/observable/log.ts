import { Observable } from '../observable.js'

export function log<T>(this: Observable<T>, ...args: any[]): Observable<T>
{
  return new Observable(({next, error, complete}) => {
    const sub = this.subscribe({
      start: () => {
        console.log(...args, 'start')
      },
      next: val => {
        console.log(...args, 'next', val)
        return next(val)
      },
      error: err => {
        console.log(...args, 'error', err)
        return error(err)
      },
      complete: val => {
        if (val === undefined) console.log(...args, 'complete')
        else console.log(...args, 'complete', val)
        return complete(val)
      },
    })
    return () => {
      console.log(...args, 'unsubscribe')
      sub.unsubscribe()
    }
  })
}

Observable.prototype.log = log

declare module '../observable.js' {
  export interface Observable<T> {
    log: typeof log
  }
}
