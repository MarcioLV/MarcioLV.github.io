const { nanoid } = require("nanoid");
const auth = require("../auth/controller");
const store = require("./store");

function list() {
  return store.list();
}

async function addUser(body) {
  const user = {
    _id: nanoid(),
    name: body.name,
    username: body.username,
  };

  await auth.upsert({
    _id: user._id,
    username: user.username,
    password: body.password
  })

  return store.add(user);
}

module.exports = {
  list,
  addUser,
};
