const mongoose = require("mongoose")

const {Schema} = mongoose

const myPostSchema = new Schema({
  _id: String,
  user: String,
  text: String,
  activity: Array,
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

function setLikeModel(collection){
  return mongoose.model(collection, myLikeSchema)
}

function setCommentModel(collection){
  return mongoose.model(collection, myCommentSchema)
}

const Model = mongoose.model('post', myPostSchema)

module.exports = {
  Model,
  setLikeModel,
  setCommentModel
}