module.exports = {
  api: {
    url: process.env.API_URL || "http://localhost",
    port: process.env.API_PORT || 3000
  },
  store: {
    dbUrl: process.env.DB_URL || "mongodb://user:9qGXXO2i93YtfBBi@cluster0-shard-00-00.pfolt.mongodb.net:27017,cluster0-shard-00-01.pfolt.mongodb.net:27017,cluster0-shard-00-02.pfolt.mongodb.net:27017/redsocial?ssl=true&replicaSet=atlas-ckgk9w-shard-0&authSource=admin&retryWrites=true&w=majority"
  },
  jwt:{
    secret: process.env.JWT_SECRET || "noSecret"
  }
}