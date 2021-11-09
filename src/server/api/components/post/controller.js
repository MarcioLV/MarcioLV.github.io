const moment = require('moment-timezone')
const store = require("./store");
const error = require("../../../utils/error");

function createDate (){
  let date = new Date()
  date = moment(date)
  date = date.tz('America/Argentina/Buenos_Aires')
  date = date.toString()
  return date
}

async function list(post_id) {
  const postId = {};
  if (post_id) {
    postId._id = post_id;
  }
  const list = await store.list(postId);

  return list;
}

async function addPost(body, picture) {
  if (!body.user) {
    throw error("No viene user", 401);
  }

  const date = createDate()

  const post = {
    user: body.user,
    text: body.text,
    like: [],
    comment: [],
    date: date,
  };
  
  if(picture){
    post.picture = `/pictures/${picture.filename}`;
  }

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
    text: data.text,
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
