var db = require('level')('./db')
var storage = require('../..')
var store = storage(db)

var keys = storage.keyPair()

store.putM(Buffer(process.argv[2]), keys, function(err, location){
  console.log(err ? err : location)
})
