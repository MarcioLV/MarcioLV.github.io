const auth = require('../../../auth')
const controller = require('./controller')
module.exports = function checkAuth(action){
  function middleware(req, res, next){
    switch(action){
      case "log":
      case "add":
        auth.check.logged(req)
        next()
        break
      case "own_post":
        controller.list(req.params.id)
          .then((post)=>{
            auth.check.own(req, post[0].user)
            next()
          })
          .catch(next)
        break
      case "own_comment":
        controller.getComment(req.body.id)
          .then((comment) => {
            auth.check.own(req, comment.user)
            next()
          })
          .catch(next)
        break
      default:
        next()
    }
  }
  return middleware
}