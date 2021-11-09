const { nanoid } = require("nanoid");
const auth = require("../auth/controller");
const config = require("../../../../../config");
const store = require("./store");

function list(query) {
  const q = {
    username: query.user
  }
  return store.list(q);
}

function get(data) {
  let user = {};
  if (data) {
    user._id = data;
  }
  return store.get(user);
}

async function addUser(body) {
  const user = {
    _id: nanoid(),
    username: body.username,
  };

  const taken = await store.verifyUser(user)
  if(taken){
    return "taken"
  }

  await auth.upsert({
    _id: user._id,
    username: user.username,
    password: body.password,
  });

  return store.add(user);
}

async function editUser(userId, body) {
  const user = {
    _id: userId,
    username: body.username,
  };

  if (body.password !== "") {
    const userData = await store.get({ _id: userId });
    const login = await auth.verify(userData.username, body.password);
    if (login) {
      await auth.edit({
        _id: user._id,
        username: user.username,
        password: body.newPassword,
      });

      return store.edit(user);
    }
  } else {
    await auth.edit({
      _id: user._id,
      username: user.username
    })
    return store.edit(user);
  }
}

function addAvatar(user, avatar) {
  let fileUrl = "";
  if (avatar) {
    fileUrl = `/files/${avatar.filename}`;
  }

  return store.addAvatar(user, fileUrl);


}

module.exports = {
  list,
  get,
  addUser,
  editUser,
  addAvatar,
};
