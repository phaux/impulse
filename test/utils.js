const {Observable} = require('../dist/index')

const delay = t => new Promise(cb => setTimeout(cb, t))

const $ = steps => new Observable(emit => {
  let closed = false
  const run = async () => {
    for (const step of steps) {
      if (closed) break
      else if (step == '-') await delay(100)
      else if (step.match(/^\w/)) emit.next(step)
      else if (step == '!') emit.error(new Error('!'))
    }
  }
  run()
    .then(() => { if (!closed) emit.complete() })
    .catch(err => { if (!closed) emit.error(err) })
  return () => { closed = true }
})

module.exports = {delay, $}
