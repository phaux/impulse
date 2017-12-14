const {Observable} = require('../../../dist/index')
const assert = require('assert')

module.exports = {

  'emits sequential numbers': async () => {
    const res = []
    await new Promise((complete, error) => {
      /* eslint prefer-const: off */
      let sub
      sub = Observable.interval(100).subscribe({
        next: val => {
          res.push(val)
          if (res.length < 5) return
          sub.unsubscribe()
          complete()
        },
        error,
        complete,
      })
    })
    assert.deepStrictEqual(res, [0, 1, 2, 3, 4])
  },

}
