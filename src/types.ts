import { Emitter } from './emitter.js'
import { Subscription } from './subscription.js'

export type Subscriber<T> =
  (emit: Emitter<T>) => ISubscription | void | (() => void)

export interface ISubscription {
  unsubscribe(): void
}

export interface Observer<T> {
  start?(sub: Subscription): any
  next?(val: T): any
  error?(err: Error): any
  complete?(val?: any): any
}

export interface IObservable<T> {
  subscribe(observer: Observer<T>): ISubscription
  subscribe(
    next: (val: T) => any,
    error?: (err: Error) => void,
    complete?: (val: any) => void,
  ): ISubscription
}

export type IntoObservable<T> =
  | IObservable<T>
  | Promise<T>
  | Iterable<T>
