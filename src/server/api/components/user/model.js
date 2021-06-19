const mongoose = require("mongoose")

const {Schema} = mongoose

const myUserSchema = new Schema({
  _id: String,
  name: String,
  username: String
})

const model = mongoose.model("user", myUserSchema)

module.exports = model