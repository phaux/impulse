const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'works': async () => {
    const res = await $('23-7').map(x => +x * 10).toArray()
    assert.deepStrictEqual(res, [20, 30, 70])
  },

}
