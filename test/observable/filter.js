const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'works': async () => {
    const res = await $('aA-X-Bb').filter(s => s.match(/^[A-Z]/)).toArray()
    assert.deepStrictEqual(res, ['A', 'X', 'B'])
  },

}
