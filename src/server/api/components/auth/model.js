const mongoose = require("mongoose")

const {Schema} = mongoose

const myAuthSchema = new Schema({
  _id: String,
  username: {type: String, unique: true , require: true},
  password: String
})

const model = mongoose.model("auth", myAuthSchema)

module.exports = model
