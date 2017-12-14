import { Observable } from '../observable.js'
import { Emitter } from '../emitter'
import { Subscription } from '../subscription'
import { Behavior } from '../behavior'

export function remember<T>(this: Observable<T>): Observable<T> {
  const emitters: Array<Emitter<T>> = []
  let n = 0
  let sub: Subscription | undefined
  const $ = new Behavior<T>()
  return new Observable(emit => {
    const $sub = $.subscribe(emit)
    if (n++ == 0) sub = this.subscribe($)
    return () => {
      if (--n == 0) sub!.unsubscribe()
      $sub.unsubscribe()
    }
  })
}

Observable.prototype.remember = remember

declare module '../observable.js' {
  export interface Observable<T> {
    remember: typeof remember
  }
}
