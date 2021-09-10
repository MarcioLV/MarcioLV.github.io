const error = require("../../../utils/error");

const fs = require("fs").promises

const { Post, Like, Comment } = require("./model");
const User = require("../user/model")

async function veryfyPostExist(post_id){
  const verifyPost = await getPost((postId = { _id: post_id }));
  if (verifyPost.length === 0) {
    throw error("No Existe Post");
  }
}
async function getPost(postId) {
  let listPost = await Post.find(postId)
  listPost = await User.populate(listPost, {path: "user"})
  listPost = await Comment.populate(listPost, {path: "comments"})
  listPost = await Like.populate(listPost, {path: "likes"})
  return listPost;
}

async function addPost(post) {
  const myPost = await new Post(post);
  const myUser = await User.findOne({_id: post.user})
  await myUser.posts.push(myPost._id)
  await myUser.save()
  return myPost.save();
}

async function removePost(postId){
  const myPost = await Post.findOne({_id: postId})
  const myUser = await User.findOne({_id: myPost.user})
  const myLike = await Like.find({post: postId})
  const myComment = await Comment.find({post: postId})

  const postIndex = myUser.posts.indexOf(postId)
  myUser.posts.splice(postIndex, 1)

  await myLike.forEach(element => element.delete())
  await myComment.forEach(element=> element.delete())
  await myUser.save()

  if(myPost.picture && myPost.picture !== ''){
    const oldFileUrl = myPost.picture.split("/")
    const oldFileName = oldFileUrl[oldFileUrl.length - 1]
    fs.unlink("./src/server/public/pictures/" + oldFileName)
      .then(() => {
        console.log("File removed");
      })
      .catch((err) => {
        console.error("error", err);
      });
  }
  return myPost.delete()
}

async function addLike(like) {
  await veryfyPostExist(like.post)
  const myLike = await new Like(like);
  const post = await Post.findOne({_id: like.post})
  post.likes.push(myLike._id)
  await post.save()
  return myLike.save();
}
async function removeLike(data){
  await veryfyPostExist(data.post)
  const like = await Like.findOne({post: data.post, user: data.user})
  const post = await Post.findOne({_id: data.post})
  const likeIndex = post.likes.indexOf(like._id)
  post.likes.splice(likeIndex, 1)
  await post.save()
  return like.delete()
}
async function getComment(commentId){
  const comment = await Comment.findOne(commentId)
  return comment
}
async function addComment(comment) {
  await veryfyPostExist(comment.post)
  const myComment = await new Comment(comment);
  const post = await Post.findOne({_id: comment.post})
  post.comments = post.comments.concat(myComment._id)
  await post.save()
  return myComment.save();
}
async function removeComment(commentId){
  const comment = await Comment.findOne(commentId)
  const post = await Post.findOne({_id: comment.post})
  const commentIndex = post.comments.indexOf(comment._id)
  post.comments.splice(commentIndex, 1)
  await post.save()
  return comment.delete()
}

module.exports = {
  list: getPost,
  add: addPost,
  removePost,
  addLike,
  removeLike,
  getComment,
  addComment,
  removeComment,
};
