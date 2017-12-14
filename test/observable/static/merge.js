const {Observable} = require('../../../dist/index')
const {$, delay} = require('../../utils')
const assert = require('assert')

module.exports = {

  'merges arrays': () => {
    const res = []
    Observable.merge([42, 24], [1, 2]).subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [42, 24, 1, 2])
  },

  'merges promises': async () => {
    const res = await Observable.merge(
      delay(300).then(() => 1),
      delay(100).then(() => 2),
      delay(200).then(() => 3),
    ).toArray()
    assert.deepStrictEqual(res, [2, 3, 1])
  },

  'merges observables': async () => {
    const res = await Observable.merge(
      $('a- -bc- -'),
      $(' -1      '),
      $(' - -  -X '),
    ).toArray()
    assert.deepStrictEqual(res, 'a1bcX'.split(''))
  },

}
