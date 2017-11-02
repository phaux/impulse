import { Subscriber, IObservable, IObserver, IntoObservable } from './types.js'
import { Subscription } from './subscription.js'
import { Emitter } from './emitter.js'

export class Observable<T> implements IObservable<T> {

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

  static of<T>(...xs: T[]): Observable<T> {
    return new Observable(observer => {
      for (const item of xs) observer.next(item)
      observer.complete()
    })
  }

  static from<T>($: IntoObservable<T>): Observable<T> {
    if ($ instanceof Observable) {
      return $
    }
    if ($ && typeof ($ as IObservable<T>).subscribe == 'function') {
      return new Observable(emit =>
        ($ as IObservable<T>).subscribe(emit)
      )
    }
    else if ($ && typeof ($ as Iterable<T>)[Symbol.iterator] == 'function') {
      return new Observable(emit => {
        for (const item of $ as Iterable<T>) emit.next(item)
        emit.complete()
      })
    }
    else if ($ && typeof ($ as Promise<T>).then == 'function') {
      return new Observable(emit => {
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

  // Non-standard methods

  static empty(): Observable<never> {
    return new Observable(emit => { emit.complete() })
  }

  static never(): Observable<never> {
    return new Observable(() => {})
  }

  static interval(ms: number): Observable<number> {
    return new Observable(emit => {
      let i = 0
      const interval = setInterval(() => emit.next(i++), ms)
      return () => clearInterval(interval)
    })
  }

  static combine<T>(...$s: Array<IntoObservable<T>>): Observable<T[]>
  static combine<T1, T2>(
    $1: IntoObservable<T1>, $2: IntoObservable<T2>,
  ): Observable<[T1, T2]>
  static combine<T1, T2, T3>(
    $1: IntoObservable<T1>, $2: IntoObservable<T2>, $3: IntoObservable<T3>,
  ): Observable<[T1, T2, T3]>
  static combine<T1, T2, T3, T4>(
    $1: IntoObservable<T1>, $2: IntoObservable<T2>,
    $3: IntoObservable<T3>, $4: IntoObservable<T4>,
  ): Observable<[T1, T2, T3, T4]>
  static combine<T1, T2, T3, T4, T5>(
    $1: IntoObservable<T1>, $2: IntoObservable<T2>, $3: IntoObservable<T3>,
    $4: IntoObservable<T4>, $5: IntoObservable<T5>,
  ): Observable<[T1, T2, T3, T4, T5]>
  static combine(...$s: Array<IntoObservable<any>>): Observable<any[]>
  {
    const EMPTY = Symbol('empty')
    const state: any[] = $s.map(() => EMPTY)
    return new Observable(emit => {
      const subs = $s.map(($, i) =>
        Observable.from($).subscribe({
          next: val => {
            state[i] = val
            if (state.some(val => val === EMPTY)) return
            return emit.next(state)
          },
          error: err => emit.error(err),
          complete: val => emit.complete(val),
        }),
      )
      return () => subs.forEach(sub => sub.unsubscribe())
    })
  }

  static merge<T>(...$s: Array<IntoObservable<T>>): Observable<T> {
    return new Observable(emit => {
      const subs: Subscription[] = []
      for (const $ of $s) {
        let sub: Subscription | undefined
        sub = Observable.from($).subscribe({
          next: val => emit.next(val),
          error: err => emit.error(err),
          complete: val => {
            if (!sub) return
            if (!subs.every(s => s.closed || s === sub)) return
            emit.complete(val)
          },
        })
        subs.push(sub)
      }
      if (subs.every(s => !!s.closed)) emit.complete()
      return () => subs.forEach(s => s.unsubscribe())
    })
  }

  log(...args: any[]): Observable<T> {
    return new Observable(emit => {
      const sub = this.subscribe({
        start: () => {
          console.log(...args, 'start')
        },
        next: val => {
          console.log(...args, 'next', val)
          return emit.next(val)
        },
        error: err => {
          console.log(...args, 'error', err)
          return emit.error(err)
        },
        complete: val => {
          console.log(...args, 'complete', val)
          return emit.complete(val)
        },
      })
      return () => {
        console.log(...args, 'unsubscribe')
        sub.unsubscribe()
      }
    })
  }

  // share(): Observable<T> {
  //   const emitters: Emitter<T>[] = []
  //   let n = 0
  //   let sub: Subscription | undefined
  //   return new Observable(emit => {
  //     const $sub = $.subscribe(emit)
  //     if (n++ == 0) sub = this.subscribe($)
  //     return () => {
  //       if (--n == 0) sub!.unsubscribe()
  //       $sub.unsubscribe()
  //     }
  //   })
  // }

  map<U>(fn: (val: T) => U): Observable<U> {
    return new Observable<U>(emit => this.subscribe({
      next: val => emit.next(fn(val)),
      error: err => emit.error(err),
      complete: val => emit.complete(val),
    }))
  }

  filter(fn: (val: T) => boolean): Observable<T> {
    return new Observable(emit => this.subscribe({
      next: val => { if (fn(val)) return emit.next(val) },
      error: err => emit.error(err),
      complete: val => emit.complete(val),
    }))
  }

  scan<U>(init: U, fn: (prev: U, next: T) => U): Observable<U> {
    return new Observable(emit => {
      let state = init
      emit.next(state)
      return this.subscribe({
        next: (val: T) => {
          state = fn(state, val)
          return emit.next(state)
        },
        error: err => emit.error(err),
        complete: val => emit.complete(val),
      })
    })
  }

  take(n: number): Observable<T> {
    return new Observable(emit => this.subscribe({
      next: val => {
        if (--n < 0) emit.complete()
        else emit.next(val)
      },
      error: err => emit.error(err),
      complete: val => emit.complete(val),
    }))
  }
  skip(n: number): Observable<T> {
    return new Observable(emit => this.subscribe({
      next: val => { if (--n < 0) emit.next(val) },
      error: err => emit.error(err),
      complete: val => emit.complete(val),
    }))
  }

  startWith(value: T): Observable<T> {
    return new Observable(emit => {
      emit.next(value)
      return this.subscribe(emit)
    })
  }
  endWith(value: T): Observable<T> {
    return new Observable(emit =>
      this.subscribe({
        next: val => emit.next(val),
        error: err => emit.error(err),
        complete: val => {
          emit.next(value)
          return emit.complete(val)
        },
      }))
  }

  takeUntil(end$: Observable<any>): Observable<T> {
    return new Observable(emit => {
      const thisSub = this.subscribe(emit)
      const endSub = end$.subscribe({
        next: () => emit.complete(),
        error: err => emit.error(err),
        complete: val => emit.complete(val),
      })
      return () => {
        thisSub.unsubscribe()
        endSub.unsubscribe()
      }
    })
  }
  skipUntil(start$: Observable<any>): Observable<T> {
    return new Observable(emit => {
      let started = false
      const thisSub = this.subscribe({
        next: val => { if (started) return emit.next(val) },
        error: err => emit.error(err),
        complete: val => emit.complete(val),
      })
      let startSub: Subscription
      startSub = start$.subscribe({
        next: () => {
          started = true
          if (startSub) startSub.unsubscribe()
        },
        error: err => emit.error(err),
        complete: () => { started = true },
      })
      return () => {
        thisSub.unsubscribe()
        startSub.unsubscribe()
      }
    })
  }

  // repeat(fn: (complete$: Observable<any>) => IntoObservable<any>): Observable<T> {
  //   return new Observable(emit => {
  //     const complete$ = new Subject
  //     const resub = () => this.subscribe({
  //       next: val => emit.next(val),
  //       error: err => emit.error(err),
  //       complete: val => complete$.next(val),
  //     })
  //     const repeat$ = Observable.from(fn(complete$))
  //     let sub: Subscription | null = null
  //     repeat$.subscribe({
  //       next: () => {
  //         if (sub) sub.unsubscribe()
  //         sub = resub()
  //       },
  //       error: err => emit.error(err),
  //       complete: val => emit.complete(val),
  //     })
  //     if (!sub) sub = resub()
  //     return () => {
  //       if (sub) sub.unsubscribe()
  //     }
  //   })
  // }

  switchMap<U>(fn: (val: T) => IntoObservable<U>, max = 1): Observable<U> {
    return new Observable(emit => {

      let outerSub: Subscription | undefined
      const innerSubs: Subscription[] = []

      outerSub = this.subscribe({
        next: val => {
          const activeSubs = innerSubs.filter(sub => !sub.closed)
          if (activeSubs.length >= max) activeSubs[0].unsubscribe()
          const inner$ = Observable.from(fn(val))
          let innerSub: Subscription | undefined
          innerSub = inner$.subscribe({
            next: val => emit.next(val),
            error: err => emit.error(err),
            complete: val => {
              if (!outerSub || !outerSub.closed) return
              if (!innerSubs.every(s => s.closed || s === innerSub)) return
              emit.complete(val)
            },
          })
          innerSubs.push(innerSub)
        },
        error: err => emit.error(err),
        complete: val => {
          if (!outerSub) return
          if (!innerSubs.every(s => s.closed)) return
          emit.complete(val)
        },
      })

      if (outerSub.closed && innerSubs.every(s => !!s.closed)) emit.complete()

      return () => {
        innerSubs.forEach(s => s.unsubscribe())
        outerSub!.unsubscribe()
      }

    })
  }

}
