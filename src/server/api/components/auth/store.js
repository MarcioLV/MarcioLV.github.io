const Model = require("./model")

function addAuth(authUser){
  const myAuth = new Model(authUser)
  return myAuth.save()
}

async function editAuth(user){
  let myAuth = await Model.findOne({_id: user._id})
  myAuth.username = user.username
  if(user.password){
    myAuth.password = user.password
  }
  return myAuth.save()
}

async function getAuth(username){
  const listName = await Model.find({username: username})
  return listName[0]
}

module.exports = {
  add: addAuth,
  query: getAuth,
  edit: editAuth
}