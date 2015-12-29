# bep44-storage
Bittorrent DHT style content-addressable storage for other databases. Basically a generalized version of BEP44.

## Example
``` javascript
var db = require('level')('./db')
var storage = require('bep44-storage')
var store = storage(db)

store.putIm(Buffer('hello there', function(err, key){
  if(err){
    throw err
  }
  console.log(key)
})

```

## API
#### `storage(db)`
Creates a store using the database provided.  `db` must contain the functions `put`, `get`, `del`, and `createReadStream`. See [Level DB](https://www.npmjs.com/package/level).

#### `store.putIm(data, cb)`
Stores the buffer `data` as an immutable object.  It then calls the function `cb` with any errors and the key used in `store.get`.

#### `store.putM(data, keyPair, cb)`
Stores the buffer `data` as a mutable object using the `keyPair`.  It then calls the function `cb` with any errors and the key used in `store.get`.

#### `store.get(key, cb)`
Gets the data, whether it be mutable or immutable, at the `key`.  It then calls the function `cb` with any errors and the data.

#### `store.cleanup()`
Goes through every key-value pair and removes the ones that aren't valid.

#### `storage.keyPair()`
Creates a keyPair for use with `store.putM`.

#### `storage.valid(key, value)`
Returns whether the key-value pair is valid.
