import { Emitter } from './emitter.js'

export type Subscriber<T> =
  (emit: Emitter<T>) => Unsubscriber

export type Unsubscriber =
  | { unsubscribe(): void }
  | (() => any)
  | void

export interface ISubscription {
  unsubscribe(): void
  readonly closed: boolean
}

export interface IObserver<T> {
  start?(sub: ISubscription): any
  next?(val: T): any
  error?(err: Error): any
  complete?(val?: any): any
}

export interface IObservable<T> {
  subscribe(observer: IObserver<T>): ISubscription
  subscribe(
    next: (val: T) => any,
    error?: (err: Error) => void,
    complete?: (val: any) => void,
  ): ISubscription
}

export type IntoObservable<T> =
  | IObservable<T>
  | Promise<T>
  | AsyncIterable<T>
  | Iterable<T>
