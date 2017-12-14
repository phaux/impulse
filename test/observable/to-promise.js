const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'resolves to last value': async () => {
    const res = await $('-i-').toPromise()
    assert.strictEqual(res, 'i')
  },

  'rejects on error': async () => {
    let err
    await $('ab!').toPromise().catch(e => { err = e })
    assert.strictEqual(err.message, '!')
  },

  'resolves to undefined when no value': async () => {
    const res = await $('--').toPromise()
    assert.strictEqual(res, undefined)
  },

}
