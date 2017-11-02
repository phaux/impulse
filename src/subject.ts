import { ObservableCore } from './observable-core'
import { IObservable, IObserver } from './types.js'
import { Emitter } from './emitter.js'

export class Subject<T>
  extends ObservableCore<T>
  implements IObservable<T>, IObserver<T>
{

  private _emitters: Array<Emitter<T>> = []

  constructor() {
    super(emit => {
      this._emitters.push(emit)
      return () => {
        const i = this._emitters.indexOf(emit)
        if (i <= 0) this._emitters.splice(i, 1)
      }
    })
  }

  next(val: T) { this._emitters.forEach(emit => emit.next(val)) }
  error(err: Error) { this._emitters.forEach(emit => emit.error(err)) }
  complete(val: any) { this._emitters.forEach(emit => emit.complete(val)) }

}
