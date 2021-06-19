const Model = require("./model")

async function getUser(){
  const listName = await Model.find()
  return listName
}

async function addUser(user){
  const myUser = await new Model(user)
  return myUser.save()
}

module.exports = {
  list: getUser,
  add: addUser
}