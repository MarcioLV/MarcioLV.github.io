const express = require("express")
const response = require("../../../network/response")
const controller = require("./controller")

const router = express.Router()

router.get("/", list)
router.post("/", upsert)

function list(req, res, next){
  controller.list()
    .then((lista)=>{
      response.success(req, res, lista, 200)
    })
    .catch(next)
}

function upsert(req, res, next){
  controller.addUser(req.body)
    .then((data)=>{
      response.success(req, res, data, 201)
    })
    .catch(next)
}

module.exports = router