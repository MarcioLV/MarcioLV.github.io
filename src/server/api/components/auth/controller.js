const bcrypt = require("bcrypt")
const store = require("./store")
const auth = require("../../../auth")

async function login(username, password){
  const data = await store.query(username)
  if(!data){
    throw new Error("Informacion Invalida")
  }
  const datos = await data.toJSON()
  return bcrypt.compare(password, datos.password)
    .then((sonIguales)=>{
      if(sonIguales){
        const token = auth.sign(datos)
        const user = {
          _id: data._id,
          token: token,
        }
        return user
      }else {
        throw new Error("Informacion Invalida")
      }
    })
}

async function verify(username, password){
  const data = await store.query(username)
  if(!data){
    throw new Error("Informacion Invalida")
  }
  const datos = await data.toJSON()
  return bcrypt.compare(password, datos.password)
    .then((sonIguales)=>{
      if(sonIguales){
        return true
      }else {
        throw new Error("Informacion Invalida")
      }
    })
}

async function upsert(data){
  const authData = {
    _id: data._id,
    username: data.username
  }
  authData.password = await bcrypt.hash(data.password, 5)
  return store.add(authData)
}

async function edit(data){
  const authData = {
    _id: data._id,
    username: data.username
  }
  if(data.password){
    authData.password = await bcrypt.hash(data.password, 5)
  }
  return store.edit(authData)
}

module.exports = {
  upsert,
  login,
  edit,
  verify
}