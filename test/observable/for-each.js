const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'works': async () => {
    const res = []
    await $('a-b').forEach(val => res.push(val))
    assert.deepStrictEqual(res, ['a', 'b'])
  },

  'rejects on error': async () => {
    let err
    await $('a-!').forEach(() => {}).catch(e => { err = e })
    assert.strictEqual(err.message, '!')
  },

}
