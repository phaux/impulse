const {Observable} = require('../../../dist/index')
const assert = require('assert')

module.exports = {

  'emits synchronously': () => {
    const res = []
    Observable.of(42, 24).subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [42, 24])
  },

}
