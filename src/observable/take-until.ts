import { Observable } from '../observable.js'

export function takeUntil<T>(
  this: Observable<T>,
  end$: Observable<any>
): Observable<T>
{
  return new Observable(emit => {
    const thisSub = this.subscribe(emit)
    const endSub = end$.subscribe({
      next: val => emit.complete(),
      error: err => emit.error(err),
      complete: val => emit.complete(val),
    })
    return () => {
      thisSub.unsubscribe()
      endSub.unsubscribe()
    }
  })
}

Observable.prototype.takeUntil = takeUntil

declare module '../observable.js' {
  export interface Observable<T> {
    takeUntil: typeof takeUntil
  }
}
