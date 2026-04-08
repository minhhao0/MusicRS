const mysql = require('mysql2/promise')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
}

const connection = mysql.createPool(config)
console.log("Connect to mysql server successfully")

module.exports = { mysql, connection }