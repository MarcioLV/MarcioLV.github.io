const dotenv = require('dotenv').config()

module.exports = {
  api: {
    url: process.env.API_URL || "http://localhost:3000/",
    port: process.env.API_PORT || 3000
  },
  store: {
    dbUrl: process.env.DB_URL,
  },
  jwt:{
    secret: process.env.JWT_SECRET || "noSecret"
  }
}