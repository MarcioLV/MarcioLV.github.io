const bcrypt = require("bcrypt")
const store = require("./store")

async function upsert(data){
  const authData = {
    _id: data._id,
    username: data.username
  }
  authData.password = await bcrypt.hash(data.password, 5)
  return store.add(authData)
}

module.exports = {
  upsert,
}