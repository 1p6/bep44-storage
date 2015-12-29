var db = require('level')('./db')
var store = require('../..')(db)

store.get(process.argv[2], function(err, val){
  console.log(err ? err : val.toString())
})
