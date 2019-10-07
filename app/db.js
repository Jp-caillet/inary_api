 const mysql = require('mysql')
 const dotenv = require('dotenv')
 dotenv.config()

 const mySqlClient = mysql.createConnection({
     host: process.env.BDD_HOST,
     user: process.env.BDD_USER,
     password: process.env.BDD_MDP,
     database: process.env.BDD_NAME
 })
 this.db = mySqlClient.connect(function(err) {
     if (err) throw err
     console.log("Connected!")
     if (err) throw err;

 })
 module.exports = mySqlClient