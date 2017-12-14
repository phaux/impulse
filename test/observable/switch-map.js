const {Observable} = require('../../dist/index')
const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'emits everything when used synchronously': () => {
    const res = []
    Observable.of(40, 90)
      .switchMap(x => Observable.of(x + 2, x + 7))
      .subscribe(val => res.push(val))
    assert.deepStrictEqual(res, [42, 47, 92, 97])
  },

  'proxies latest observable by default': async () => {
    const res = await $('xx---xx-x').switchMap(() => $('a--z')).toArray()
    assert.deepStrictEqual(res, 'aazaaaz'.split(''))
  },

  'allows specifying concurrency': async () => {
    const res = await $('xx---xx-x').switchMap(() => $('a--z'), 2).toArray()
    assert.deepStrictEqual(res, 'aazzaaazz'.split(''))
  },

}
