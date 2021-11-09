const User = require("./model");

const { Post, Comment, Like } = require("../post/model");

const fs = require("fs").promises;

async function getUserList(q) {
  const find1 = new RegExp(`${q.username}.`, "i")
  const find2 = new RegExp(`${q.username}`, "i")

  const listName = await User.find({username: {$in: [find1, find2] }}, { username: 1, avatar: 1 })
  return listName;
}

async function verifyUser(user) {
  return User.findOne({ username: user.username });
}

async function getUser(user) {
  let listUser = await User.findOne(user);
  listUser = await Post.populate(listUser, { path: "posts" });
  listUser = await Comment.populate(listUser, { path: "posts.comments" });
  listUser = await Like.populate(listUser, { path: "posts.likes" });
  listUser.posts.forEach((element) => (element.user = listUser.username));
  return listUser;
}

async function addUser(user) {
  const myUser = await new User(user);
  return myUser.save();
}

async function editUser(user) {
  let myUser = await User.findOne({ _id: user._id });
  myUser.username = user.username;
  return myUser.save();
}

async function addAvatar(user, avatar) {
  const usuario = await User.findOne({ _id: user });
  if (usuario.avatar && usuario.avatar !== "") {
    const oldFileUrl = usuario.avatar.split("/");
    const oldFileName = oldFileUrl[oldFileUrl.length - 1];
    fs.unlink("./src/server/public/files/" + oldFileName)
      .then(() => {
        console.log("File removed");
      })
      .catch((err) => {
        console.error("error", err);
      });
  }

  usuario.avatar = avatar;
  return usuario.save();
}

module.exports = {
  list: getUserList,
  get: getUser,
  add: addUser,
  edit: editUser,
  addAvatar,
  verifyUser,
};
