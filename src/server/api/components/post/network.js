const express = require("express");
const response = require("../../../network/response");
const controller = require("./controller");
const multer = require("multer");
const auth = require("./secure");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/server/public/pictures");
  },
  filename: function (req, file, cb) {
    const [name, extension] = file.originalname.split(".");
    cb(null, `${name}-${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", /*auth("log"),*/ list);
router.get("/:id", /*auth("log"),*/ list);
router.post("/", /*auth("add"),*/ upload.single("picture"), upsert);
router.delete("/:id", /*auth("own_post"),*/ del);
router.post("/:id/like", /*auth("add"),*/ like);
router.delete("/:id/like", /*auth("log"),*/ dislike);
router.post("/:id/comment", /*auth("add"),*/ comment);
router.delete("/:id/comment", /*auth("own_comment"),*/ delComment);

function list(req, res, next) {
  controller
    .list(req.params.id)
    .then((lista) => {
      response.success(req, res, lista, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller
    .addPost(req.body, req.file)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch(next);
}

function del(req, res, next) {
  controller
    .deletePost(req.params.id)
    .then((post) => {
      response.success(req, res, post, 201);
    })
    .catch(next);
}

function like(req, res, next) {
  controller
    .addLike(req.params.id, req.body.user)
    .then((post) => {
      response.success(req, res, post, 201);
    })
    .catch(next);
}

function dislike(req, res, next) {
  controller
    .removeLike(req.params.id, req.body.user)
    .then((post) => {
      response.success(req, res, post, 200);
    })
    .catch(next);
}

function comment(req, res, next) {
  controller
    .addComment(req.params.id, req.body)
    .then((comment) => {
      response.success(req, res, comment, 201);
    })
    .catch(next);
}

function delComment(req, res, next) {
  controller
    .removeComment(req.body.id)
    .then((comment) => {
      response.success(req, res, comment, 201);
    })
    .catch(next);
}
module.exports = router;
