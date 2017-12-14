const {Observable} = require('../../../dist/index')
const assert = require('assert')

module.exports = {

  'emits no items': () => {
    const res = []
    Observable.empty().subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [])
  },

  'completes synchronously': () => {
    let completed = false
    Observable.empty().subscribe({complete: () => { completed = true }})
    assert.strictEqual(completed, true)
  },

}
