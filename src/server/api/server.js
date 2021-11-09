const path = require("path");
const express = require("express");

const config = require("../../../config");
const errors = require("../network/error");
const user = require("./components/user/network");
const auth = require("./components/auth/network");
const post = require("./components/post/network");
const cors = require("cors");
require("dotenv").config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/post", post);

app.use(errors);

const db = require("../store/mongoDB");
db(config.store.dbUrl);

app.use(express.static(path.join(__dirname, "../public/dist")));
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || config.api.port

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dist/index.html"), (err) => {
    if (err) res.status(500).send(err);
  });
});

app.listen(config.api.port, (err) => {
  if (err) {
    console.error("Error", err);
  } else {
    console.log("Servidor escuchando en el puerto " + config.api.port);
  }
});



