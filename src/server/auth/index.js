const jwt = require('jsonwebtoken')
const config = require('../../../config')
const secret = config.jwt.secret
const error = require('../utils/error')

function sign(data){
  return jwt.sign(data, secret)
}

function verify(token){
 return jwt.verify(token, secret)
}

const check = {
  own: function(req, owner){
    const decoded = decodedHeader(req)
    if(decoded._id !== owner._id){
      throw error("No puedes hacer esto[auth]", 401)
    }
  },
  logged: function(req){
    const decoded = decodedHeader(req)
    
  }
}

function getToken(auth){
  if(!auth){
    throw error("No viene token", 400)
  }
  if(auth.indexOf('Bearer ') === -1){
    throw error("Formato token invalido", 400)
  } 
  let token = auth.replace('Bearer ', '')
  return token
}

function decodedHeader(req){
  const authorization = req.headers.authorization || ''
  const token = getToken(authorization)
  const decoded = verify(token)

  req.user = decoded
  return decoded
}

module.exports = {
  sign,
  check
}