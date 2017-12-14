const batches = {

  'Observable': require('./observable'),

  'Observable.of': require('./observable/static/of'),
  'Observable.from': require('./observable/static/from'),
  'Observable.empty': require('./observable/static/empty'),
  'Observable.interval': require('./observable/static/interval'),
  'Observable.merge': require('./observable/static/merge'),

  'Observable.prototype.forEach': require('./observable/for-each'),
  'Observable.prototype.toPromise': require('./observable/to-promise'),
  'Observable.prototype.toArray': require('./observable/to-array'),

  'Observable.prototype.map': require('./observable/map'),
  'Observable.prototype.filter': require('./observable/filter'),
  'Observable.prototype.scan': require('./observable/scan'),
  'Observable.prototype.takeUntil': require('./observable/take-until'),
  'Observable.prototype.switchMap': require('./observable/switch-map'),

  'Observable.prototype.share': require('./observable/share'),
  'Observable.prototype.remember': require('./observable/remember'),

}

async function run() {
  for (const [batch, tests] of Object.entries(batches)) {
    for (const [test, fn] of Object.entries(tests)) {
      console.log(batch, test, '...')
      await fn()
    }
  }
  console.log('All tests passed!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
