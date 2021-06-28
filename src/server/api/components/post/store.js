const error = require("../../../utils/error");

const { Post, Like, Comment } = require("./model");

async function veryfyPostExist(post_id){
  const verifyPost = await getPost((postId = { _id: post_id }));
  if (verifyPost.length === 0) {
    throw error("No Existe Post");
  }
}

async function getPost(postId) {
  const listPost = await Post.find(postId)

  return listPost;
}

async function addPost(post) {
  const myPost = await new Post(post);
  return myPost.save();
}

// async function getActivity(post_id) {
//   await veryfyPostExist(post_id)
//   const listActivity = await ActivityModel.find();
//   return listActivity;
// }

async function addLike(post_id, like) {
  await veryfyPostExist(post_id)
  const myLike = await new Like(like);
  return myLike.save();
}

async function addComment(post_id, comment) {
  await veryfyPostExist(post_id)
  const myComment = await new Comment(comment);
  return myComment.save();
}

module.exports = {
  list: getPost,
  add: addPost,
  // getActivity,
  addLike,
  addComment,
};
