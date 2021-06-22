const Model = require("./model")

function addAuth(authUser){
  const myAuth = new Model(authUser)
  return myAuth.save()
}

async function getAuth(username){
  const listName = await Model.find({username: username})
  return listName[0]
}

module.exports = {
  add: addAuth,
  query: getAuth,
}