// db.delete_me.insert({ item: 'some item'})

use 'lshop'

db.createUser({
  user: 'someusername',
  pwd: 'SoM3s3cur3paSS',
  roles: [
    { role: 'readWrite', db: 'lshop' }
  ]
})

console.log(' ----------------------------- Initate lshop database -------------------')
