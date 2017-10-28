import { Observer } from './types.js'
import { Subscription } from './subscription.js'

export class Emitter<T> {

  private _observer: Observer<T>
  private _closed: boolean
  _subscription?: Subscription

  constructor(observer: Observer<T>) {
    this._observer = observer
    this._closed = false
  }

  next(val: T) {
    if (this._closed) return
    try {
      const next = this._observer.next
      if (next) return next.call(this._observer, val)
    }
    catch (err) { this.error(err) }
  }

  error(err: Error) {
    if (this._closed) throw err
    this._closed = true
    try {
      const error = this._observer.error
      if (error) return error.call(this._observer, err)
      else throw error
    }
    finally { if (this._subscription) this._subscription.unsubscribe() }
  }

  complete(val?: any) {
    if (this._closed) return
    this._closed = true
    try {
      const complete = this._observer.complete
      if (complete) return complete.call(this._observer, val)
    }
    catch (err) { this.error(err) }
    finally { if (this._subscription) this._subscription.unsubscribe() }
  }

  get closed(): boolean {
    const subClosed = this._subscription && this._subscription.closed
    return this._closed || !!subClosed
  }

}
