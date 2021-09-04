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

async function addPost(body) {
  if (!body.user) {
    throw error("No viene user", 401);
  }
  const post = {
    user: body.user,
    text: body.text,
    like: [],
    comment: [],
    date: new Date(),
  };

  return store.add(post);
}

async function deletePost(postId){
  return store.removePost(postId)
}

async function getComment(comment_id){
  const commentId = {
    _id: comment_id
  }
  const comment = await store.getComment(commentId)
  return comment
}

async function addLike(post, user) {
  const like = {
    post: post,
    user: user,
    date: new Date(),
  };
  return store.addLike(like);
}
async function removeLike(post, user){
  const like = {
    post: post,
    user: user
  }
  return store.removeLike(like)
}

async function addComment(post, data) {
  const comment = {
    post: post,
    user: data.user,
    text: data.comment,
    date: new Date(),
  };
  return store.addComment(comment);
}

async function removeComment(commentId){
  const comment = {
    _id: commentId
  }
  return store.removeComment(comment)
}

module.exports = {
  list,
  addPost,
  deletePost,
  addLike,
  removeLike,
  getComment,
  addComment,
  removeComment,
};
