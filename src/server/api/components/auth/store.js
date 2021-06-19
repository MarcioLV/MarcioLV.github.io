const Model = require("./model")

function addAuth(authUser){
  const myAuth = new Model(authUser)
  return myAuth.save()
}

module.exports = {
  add: addAuth,
}