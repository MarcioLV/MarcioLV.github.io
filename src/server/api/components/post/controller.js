const { nanoid } = require("nanoid");
const store = require("./store");
const error = require("../../../utils/error");

async function list(post_id) {
  const postId = {};
  if (post_id) {
    postId._id = post_id;
  }
  const list = await store.list(postId);

  return list;
}

function get(post_id) {
  return store.getActivity(post_id);
}

async function addPost(body) {
  if (!body.user) {
    throw error("No viene user", 401);
  }
  const post = {
    _id: nanoid(),
    user: body.user,
    text: body.text,
    activity: [],
    date: new Date(),
  };

  return store.add(post);
}

async function addLike(post, user) {
  const like = {
    user: user,
    like: "like",
    date: new Date(),
  };
  return store.addLike(post, like);
}

async function addComment(post, data) {
  const comment = {
    user: data.user,
    comment: data.comment,
    date: new Date(),
  };
  return store.addComment(post, comment);
}

module.exports = {
  list,
  get,
  addPost,
  addLike,
  addComment,
};
