const User = require("./model")

const {Post, Comment, Like} = require('../post/model')

async function getUserList(){
  const listName = await User.find()
  return listName
}

async function getUser(user){
  let listUser = await User.findOne(user)
  listUser = await Post.populate(listUser, {path:'posts'}) 
  listUser = await Comment.populate(listUser, {path:'posts.comments'}) 
  listUser = await Like.populate(listUser, {path:'posts.likes'})
  listUser.posts.forEach(element => element.user = listUser.username)
  return listUser
}

async function addUser(user){
  const myUser = await new User(user)
  return myUser.save()
}

async function editUser(user){
  let myUser = await User.findOne({_id: user._id})
  myUser.username = user.username
  return myUser.save()
}

async function addAvatar(user, avatar){
  const usuario = await User.findOne({username: user})
  usuario.avatar = avatar
  return usuario.save()
}

module.exports = {
  list: getUserList,
  get: getUser,
  add: addUser,
  edit: editUser,
  addAvatar,
}