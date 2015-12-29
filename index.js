var createHash = require('sha.js')
var sigs = require('sodium-signatures')
var nextTick = require('./nextTick.js')

var verify = function(key, val){
  try{
    val = JSON.parse(val)
    if(!val.data){
      return false
    }
    if(val.sign){
      return sigs.verify(Buffer(val.data, 'hex'), Buffer(val.sign, 'hex'), Buffer(key, 'hex'))
    } else {
      return key === createHash('sha256').update(val.data, 'hex').digest('hex')
    }
  } catch(e){
    return false
  }
}

module.exports = function(db){
  return {
    putIm: function(data, cb){
      var key = createHash('sha256').update(data).digest('hex')
      var val = JSON.stringify({
        data: data.toString('hex')
      })
      db.put(key, val, function(err){
        if(err){
          nextTick(cb, err)
          return
        }
        nextTick(cb, null, key)
      })
    },
    putM: function(data, keyPair, cb){
      var key = keyPair.publicKey.toString('hex')
      var val = JSON.stringify({
        data: data.toString('hex'),
        sign: sigs.sign(data, keyPair.secretKey).toString('hex')
      })
      db.put(key, val, function(err){
        if(err){
          nextTick(cb, err)
          return
        }
        nextTick(cb, null, key)
      })
    },
    cleanup: function(){
      db.createReadStream().on('data', function(pair){
        if(!verify(pair.key, pair.value)){
          db.del(pair.key)
        }
      })
    },
    get: function(key, cb){
      db.get(key, function(err, val){
        if(err){
          nextTick(cb, err)
          return
        }
        if(!verify(key, val)){
          nextTick(cb, new Error('Format not valid!'))
          return
        }
        val = JSON.parse(val)
        nextTick(cb, null, Buffer(val.data, 'hex'))
      })
    }
  }
}

exports.keyPair = function(){
  return sigs.keyPair()
}

exports.verify = verify
