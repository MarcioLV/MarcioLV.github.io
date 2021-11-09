const express = require("express");
const response = require("../../../network/response");
const controller = require("./controller");
const multer = require("multer");
const config = require("../../../../../config");
const auth = require("./secure");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/server/public/files");
  },
  filename: function (req, file, cb) {
    const [name, extension] = file.originalname.split(".");
    cb(null, `${name}-${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", auth("log"), list);
router.get("/:user", auth("log"), get);
router.post("/", upsert);
router.put("/:user", auth("log"), edit);
router.post("/:user", auth("log"), upload.single("avatar"), addAvatar);

function list(req, res, next) {
  controller
    .list(req.query)
    .then((lista) => {
      response.success(req, res, lista, 200);
    })
    .catch(next);
}

function get(req, res, next) {
  controller
    .get(req.params.user)
    .then((lista) => {
      response.success(req, res, lista, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller
    .addUser(req.body)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch(next);
}

function edit(req, res, next) {
  controller
    .editUser(req.params.user, req.body)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch(next);
}

function addAvatar(req, res, next) {
  controller
    .addAvatar(req.params.user, req.file)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch(next);
}

module.exports = router;
