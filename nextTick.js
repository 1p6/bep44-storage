module.exports = function(cb){
  var args = [].slice.call(arguments, 1)
  process.nextTick(function(){
    cb.apply(null, args)
  })
}
