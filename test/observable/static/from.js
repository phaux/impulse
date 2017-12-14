const {Observable} = require('../../../dist/index')
const assert = require('assert')

module.exports = {

  'converts array': () => {
    const res = []
    Observable.from([42, 24]).subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [42, 24])
  },

  'converts promise': async () => {
    const res = []
    await new Promise((resolve, reject) => {
      Observable.from(new Promise(cb => cb(42))).subscribe({
        next: val => res.push(val),
        error: err => reject(err),
        complete: () => resolve(),
      })
    })
    assert.deepStrictEqual(res, [42])
  },

  'converts generator': () => {
    const res = []
    Observable.from(function *() {
      const i = 2
      yield i * 2
      yield i * 4
    }()).subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [4, 8])
  },

  // 'converts async generator': async () => {
  //   const res = []
  //   await new Promise((resolve, reject) => {
  //     Observable.from(async function* () {
  //       yield 'hello'
  //       await delay(100)
  //       yield 'world'
  //     }).subscribe({
  //       next: val => res.push(val),
  //       error: err => reject(err),
  //       complete: () => resolve(),
  //     })
  //   })
  //   assert.deepStrictEqual(res, ['hello', 'world'])
  // }

}
