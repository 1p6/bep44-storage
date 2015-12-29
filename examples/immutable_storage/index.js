var db = require('level')('./db')
var store = require('../..')(db)

store.putIm(Buffer(process.argv[2]), function(err, key){
  console.log(err ? err : key)
})
