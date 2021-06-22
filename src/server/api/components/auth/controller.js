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
        return auth.sign(datos)
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

module.exports = {
  upsert,
  login
}