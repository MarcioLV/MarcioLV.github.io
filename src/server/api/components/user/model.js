const mongoose = require("mongoose")

const {Schema} = mongoose

const myUserSchema = new Schema({
  _id: String,
  username: {type: String, unique: true , require: true},
  avatar: String,
  posts: [{type: Schema.ObjectId, ref: "post"}],
})

const User = mongoose.model("user", myUserSchema)

module.exports = User