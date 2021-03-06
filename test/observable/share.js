const {$, delay} = require('../utils')
const assert = require('assert')

module.exports = {

  'works': async () => {
    const o = $('--a--b--c--d--e--f--g--').share()
    const a = [], b = [], c = []
    const aSub = o.subscribe(v => a.push(v))
    await delay(100)
    const bSub = o.subscribe(v => b.push(v))
    await delay(400)
    const cSub = o.subscribe(v => c.push(v))
    await delay(200)
    bSub.unsubscribe()
    await delay(200)
    cSub.unsubscribe()
    await delay(400)
    aSub.unsubscribe()
    assert.deepStrictEqual(a, 'abcdef'.split(''))
    // assert.deepStrictEqual(b, 'abc'.split(''))
    assert.deepStrictEqual(c, 'cd'.split(''))
  },

}
