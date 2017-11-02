import { Subscriber, IObserver, IntoObservable, IObservable } from "./types"
import { Subscription } from "./subscription"
import { Emitter } from "./emitter"

export class ObservableCore<T> implements IObservable<T> {

  private _subscriber: Subscriber<T>

  constructor(subscriber: Subscriber<T>) {
    if (typeof subscriber != 'function')
      throw new TypeError(`Subscriber must be a function`)
    this._subscriber = subscriber
  }

  subscribe(observer: IObserver<T>): Subscription
  subscribe(
    next: (val: T) => any,
    error?: (err: Error) => void,
    complete?: (val: any) => void,
  ): Subscription
  subscribe(
    next: ((val: T) => any) | IObserver<T>,
    error?: (err: Error) => any,
    complete?: (val: any) => any,
  ): Subscription {

    let observer
    if (typeof next == 'function') observer = {next, error, complete}
    else if (next && typeof next == 'object') observer = next
    else throw new TypeError(`Invalid observer type`)

    const subscription = new Subscription()
    const emitter = new Emitter(observer)
    emitter.next = emitter.next.bind(emitter)
    emitter.error = emitter.error.bind(emitter)
    emitter.complete = emitter.complete.bind(emitter)

    try {
      if (observer.start) observer.start(subscription)
      if (!subscription.closed) {
        const unsubscriber = this._subscriber(emitter)
        subscription._setUnsubscriber(unsubscriber)
        emitter._subscription = subscription
        if (emitter.closed) subscription.unsubscribe()
      }
    }
    catch (err) { emitter.error(err) }

    return subscription

  }

  static of<T>(...xs: T[]): ObservableCore<T> {
    const Ctor = typeof this == 'function' ? this : ObservableCore
    return new Ctor(observer => {
      for (const item of xs) observer.next(item)
      observer.complete()
    })
  }

  static from<T>($: IntoObservable<T>): ObservableCore<T> {
    const Ctor = typeof this == 'function' ? this : ObservableCore
    if ($ instanceof Ctor) {
      return $
    }
    if ($ && typeof ($ as IObservable<T>).subscribe == 'function') {
      return new Ctor(emit =>
        ($ as IObservable<T>).subscribe(emit)
      )
    }
    else if ($ && typeof ($ as Iterable<T>)[Symbol.iterator] == 'function') {
      return new Ctor(emit => {
        for (const item of $ as Iterable<T>) emit.next(item)
        emit.complete()
      })
    }
    else if ($ && typeof ($ as Promise<T>).then == 'function') {
      return new Ctor(emit => {
        ($ as Promise<T>)
          .then(val => {
            emit.next(val)
            emit.complete()
          })
          .catch(err => {
            emit.error(err)
          })
      })
    }
    else throw new TypeError(`Invalid argument`)
  }

}
