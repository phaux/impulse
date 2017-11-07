const {Observable} = require('../dist/index.js')
const assert = require('assert')

const delay = t => new Promise(cb => setTimeout(cb, t))

const TESTS = {

  'shared observable works': async () => {
    const $ = Observable.interval(100).take(4).share()
    const sub = $.subscribe({})
    await delay(150)
    const arr = $.toArray()
    await delay(100)
    sub.unsubscribe()
    assert.deepEqual(await arr, [1, 2, 3])
  },

  'emitter methods are bound': async () => {
    const $ = new Observable(({next, complete}) => {
      next('hello')
      next('world')
      complete()
    })
    const result = await $.toArray()
    assert.equal(result.join(' '), 'hello world')
  },

  'operator map works': () =>
    Observable.of(1, 2, 3)
      .map(x => x + 1)
      .toArray()
      .then(arr =>
        assert.deepEqual(arr, [2, 3, 4])
      ),

  'operator filter works': () =>
    Observable.of(1, 2, 3)
      .filter(x => x % 2 == 0)
      .toArray()
      .then(arr =>
        assert.deepEqual(arr, [2])
      ),

  'operator repeat works': () =>
    Observable.of(1)
      .repeat(end$ => end$.take(3))
      .scan(0, (a, b) => a + b)
      .toPromise()
      .then(x => assert.equal(x, 4)),

}

async function run() {
  for (const [test, fn] of Object.entries(TESTS)) {
    console.log('Testing if', test, '...')
    await fn()
  }
  console.log('All tests passed!')
}

run().catch(err => {
  console.error(err.message)
  process.exit(1)
})
