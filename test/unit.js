const {Observable} = require('../dist/index.js')
const assert = require('assert')

const TESTS = {

  'destructured emitter': async () => {
    const $ = new Observable(({next, complete}) => {
      next('hello')
      next('world')
      complete()
    })
    const result = await $.toArray()
    assert.equal(result.join(' '), 'hello world')
  },

  'operator map': () =>
    Observable.of(1, 2, 3)
      .map(x => x + 1)
      .toArray()
      .then(arr =>
        assert.deepEqual(arr, [2, 3, 4])
      ),

  'operator filter': () =>
    Observable.of(1, 2, 3)
      .filter(x => x % 2 == 0)
      .toArray()
      .then(arr =>
        assert.deepEqual(arr, [2])
      ),

}

async function run() {
  for (const [test, fn] of Object.entries(TESTS)) {
    console.log('Testing', test, '...')
    await fn()
  }
  console.log('All tests passed!')
}

run().catch(err => {
  console.error(err.message)
  process.exit(1)
})
