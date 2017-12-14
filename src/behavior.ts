import { Observable } from './observable.js'
import { IObservable, IObserver } from './types.js'
import { Emitter } from './emitter.js'

export class Behavior<T>
  extends Observable<T>
  implements IObservable<T>, IObserver<T>
{

  private _emitters: Array<Emitter<T>> = []
  started: boolean
  value: T

  constructor() {
    super(emit => {
      if (this.started) emit.next(this.value)
      this._emitters.push(emit)
      return () => {
        const i = this._emitters.indexOf(emit)
        if (i >= 0) this._emitters.splice(i, 1)
      }
    })
  }

  next(val: T) {
    this.started = true
    this.value = val
    this._emitters.forEach(emit => emit.next(val))
  }

  error(err: Error) { this._emitters.forEach(emit => emit.error(err)) }
  complete(val: any) { this._emitters.forEach(emit => emit.complete(val)) }

}
