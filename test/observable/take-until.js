const {$} = require('../utils')
const assert = require('assert')

module.exports = {

  'stops on observable next': async () => {
    const a = $('-a-b- -d')
    const b = $('- - -x  ')
    const res = await a.takeUntil(b).toArray()
    assert.deepStrictEqual(res, ['a', 'b'])
  },

  'stops on observable complete': async () => {
    const a = $('-a- -c')
    const b = $('- -')
    const res = await a.takeUntil(b).toArray()
    assert.deepStrictEqual(res, ['a'])
  },

}
