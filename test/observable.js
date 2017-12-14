const {$} = require('./utils')
const {Observable} = require('../dist/index')
const assert = require('assert')

module.exports = {

  'emits synchronously': () => {
    const res = []
    $('abc').subscribe(val => res.push(val))
    assert.deepStrictEqual(res, ['a', 'b', 'c'])
  },

  'emits asynchronously': async () => {
    const res = []
    await new Promise((resolve, reject) => {
      $('a-b-c').subscribe({
        next: val => res.push(val),
        error: err => reject(err),
        complete: () => resolve(),
      })
    })
    assert.deepStrictEqual(res, ['a', 'b', 'c'])
  },

  'ignores value after complete': () => {
    const res = []
    new Observable(emit => {
      emit.next(42)
      emit.complete()
      emit.next(24)
    }).subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [42])
  },

}
