import { Unsubscriber } from './types.js'

export class Subscription {

  private _closed: boolean

  private _unsubscriber: (() => void) | void

  constructor() {
    this._closed = false
  }

  _setUnsubscriber(unsub: Unsubscriber) {
    if (unsub === null || unsub === undefined) return
    else if (typeof unsub == "function") this._unsubscriber = unsub
    else if (typeof unsub == "object" && typeof unsub.unsubscribe == "function")
      this._unsubscriber = () => unsub.unsubscribe()
    else throw new TypeError(`Invalid subscriber return type`)
  }

  unsubscribe() {
    if (this._unsubscriber && !this._closed) this._unsubscriber()
    this._closed = true
  }

  get closed(): boolean {
    return this._closed
  }

}
