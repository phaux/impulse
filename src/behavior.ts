import { Observable } from './observable.js'
import { IObservable, IObserver } from './types.js'
import { Emitter } from './emitter.js'

export class Behavior<T>
  extends Observable<T>
  implements IObservable<T>, IObserver<T>
{

  private _emitters: Array<Emitter<T>> = []
  value: T

  constructor(init: T) {
    super(emit => {
      emit.next(this.value)
      this._emitters.push(emit)
      return () => {
        const i = this._emitters.indexOf(emit)
        if (i <= 0) this._emitters.splice(i, 1)
      }
    })
    this.value = init
  }

  next(val: T) {
    this.value = val
    this._emitters.forEach(emit => emit.next(val))
  }

  error(err: Error) { this._emitters.forEach(emit => emit.error(err)) }
  complete(val: any) { this._emitters.forEach(emit => emit.complete(val)) }

}
