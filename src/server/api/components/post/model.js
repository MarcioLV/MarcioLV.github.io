const mongoose = require("mongoose")

const {Schema} = mongoose

const myPostSchema = new Schema({
  _id: String,
  user: String,
  text: String,
  date: Date,
})

const myLikeSchema = new Schema({
  user: String,
  like: String,
  date: Date
})

const myCommentSchema = new Schema({
  user: String,
  comment: String,
  date: Date
})

const Post = mongoose.model('post', myPostSchema)
const Like = mongoose.model("like", myLikeSchema)
const Comment = mongoose.model("comment", myCommentSchema)

module.exports = {
  Post,
  Like,
  Comment
}