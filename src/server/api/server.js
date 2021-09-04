const config = require('../config')
const path = require('path')
const express = require('express')
const errors = require("../network/error")
const user = require("./components/user/network")
const auth = require("./components/auth/network")
const post = require("./components/post/network")
const cors = require('cors')
// const bodyParser = require("body-parser")
const app = express();

app.use(express.json())
app.use(cors())
// app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

app.use("/user", user)
app.use("/auth", auth)
app.use("/post", post)



app.use(errors)

const db = require('../store/mongoDB')
db(config.store.dbUrl)

app.use(express.static(path.join(__dirname, "../public")))

app.listen(config.api.port, (err) => {
  if (err) {
    console.error("Error", err);
  } else {
    console.log("Servidor escuchando en el puerto " + config.api.port);
  }
});


