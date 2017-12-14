const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'emits initial value': async () => {
    const res = await $('-').scan(0, (a, b) => a + +b).toArray()
    assert.deepStrictEqual(res, [0])
  },

  'works': async () => {
    const res = await $('12-3').scan(0, (a, b) => a + +b).toArray()
    assert.deepStrictEqual(res, [0, 1, 3, 6])
  },

}
