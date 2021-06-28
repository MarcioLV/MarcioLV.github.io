const error = require("../../../utils/error");

const { Model, setLikeModel, setCommentModel } = require("./model");

async function veryfyPostExist(post_id){
  const verifyPost = await getPost((postId = { _id: post_id }));
  if (verifyPost.length === 0) {
    throw error("No Existe Post");
  }
}

async function getPost(postId) {
  const listPost = await Model.find(postId)

  return listPost;
}

async function addPost(post) {
  const myPost = await new Model(post);
  return myPost.save();
}

async function getActivity(post_id) {
  await veryfyPostExist(post_id)
  const ActivityModel = await setLikeModel("post_" + post_id);
  const listActivity = await ActivityModel.find();
  return listActivity;
}

async function addLike(post_id, like) {
  await veryfyPostExist(post_id)
  const LikeModel = await setLikeModel("post_" + post_id);
  const myLike = await new LikeModel(like);
  return myLike.save();
}

async function addComment(post_id, comment) {
  await veryfyPostExist(post_id)
  const CommentModel = await setCommentModel("post_" + post_id);
  const myComment = await new CommentModel(comment);
  return myComment.save();
}

module.exports = {
  list: getPost,
  add: addPost,
  getActivity,
  addLike,
  addComment,
};
