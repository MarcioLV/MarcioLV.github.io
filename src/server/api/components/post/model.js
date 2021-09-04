const mongoose = require("mongoose")

const {Schema} = mongoose

const postSchema = new Schema({
  user: { type: String, ref: 'User'},
  text: String,
  likes: [{ type: Schema.ObjectId, ref: 'Like' }],
  comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
  date: Date,
})

const likeSchema = new Schema({
  post: Object,
  user: String,
  date: Date
})

const commentSchema = new Schema({
  post: Object,
  user: String,
  text: String,
  date: Date
})

const Post = mongoose.model('Post', postSchema)
const Like = mongoose.model("Like", likeSchema)
const Comment = mongoose.model("Comment", commentSchema)

module.exports = {
  Post,
  Like,
  Comment
}