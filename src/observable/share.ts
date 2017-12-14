import { Observable } from '../observable.js'
import { Emitter } from '../emitter'
import { Subscription } from '../subscription'
import { Subject } from '../subject'

export function share<T>(this: Observable<T>): Observable<T> {
  const emitters: Array<Emitter<T>> = []
  let n = 0
  let sub: Subscription | undefined
  const $ = new Subject<T>()
  return new Observable(emit => {
    const $sub = $.subscribe(emit)
    if (n++ == 0) sub = this.subscribe($)
    return () => {
      if (--n == 0) sub!.unsubscribe()
      $sub.unsubscribe()
    }
  })
}

Observable.prototype.share = share

declare module '../observable.js' {
  export interface Observable<T> {
    share: typeof share
  }
}
