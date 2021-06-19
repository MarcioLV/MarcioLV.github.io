const config = require('../config')
const express = require('express')
const errors = require("../network/error")
const user = require("./components/user/network")

const app = express();
app.use(express.json())


app.use("/user", user)



app.use(errors)

const db = require('../store/mongoDB')
db(config.store.dbUrl)

app.listen(config.api.port, (err) => {
  if (err) {
    console.error("Error", err);
  } else {
    console.log("Servidor escuchando en el puerto " + config.api.port);
  }
});


