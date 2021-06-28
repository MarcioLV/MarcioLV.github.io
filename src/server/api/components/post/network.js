const express = require("express");
const response = require("../../../network/response");
const controller = require("./controller");
const auth = require("./secure");

const router = express.Router();

router.get("/", auth("log"), list);
router.get("/:id", auth("log"), list);
router.post("/", auth("add"), upsert);
router.get("/:id/activity", auth("log"), get);
router.post("/:id/like", auth("log"), like);
router.post("/:id/comment", auth("log"), comment);

function list(req, res, next) {
  controller
    .list(req.params.id)
    .then((lista) => {
      response.success(req, res, lista, 200);
    })
    .catch(next);
}
function get(req, res, next) {
  controller
    .get(req.params.id)
    .then((activity) => {
      response.success(req, res, activity, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller
    .addPost(req.body)
    .then((data) => {
      response.success(req, res, data, 201);
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

function comment(req, res, next) {
  controller
    .addComment(req.params.id, req.body)
    .then((post) => {
      response.success(req, res, post, 201);
    })
    .catch(next);
}

module.exports = router;
