const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'resolves to array': async () => {
    const res = await $('-i-j-').toArray()
    assert.deepStrictEqual(res, ['i', 'j'])
  },

  'rejects on error': async () => {
    let err
    await $('abc!').toArray().catch(e => { err = e })
    assert.strictEqual(err.message, '!')
  },

}
