// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const axios = require('axios')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


// Core
const check = validator.isArray()

    

module.exports = class Final {
    constructor(app) {
        dotenv.config()

        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.post('/selection/final/:id', validator.express(check), async(req, res) => {
            try {
                 const token = req.headers['x-access-token']
                if (!token) return res.status(200).send({
                    final: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => {
                    if (err) return res.status(200).send({
                        final: false,
                        message: 'Failed to authenticate token.'
                    })
                    
                    let algorithm = 'aes256'
                    let password = process.env.KEY_TOKEN
                    
                    for (let i = req.body.length - 1; i >= 0; i--) {

                    let decipher = crypto.createDecipher(algorithm,password)
                    let dec = decipher.update(req.body[i].id,'hex','utf8')
                    dec += decipher.final('utf8')
                    let update = `update participations set final = 1 where id = ${dec}`

                    let result = await db.promise().query(update)
                    	
                    }
                    let deciphers = crypto.createDecipher(algorithm,password)
                    let decs = deciphers.update(req.params.id,'hex','utf8')
                    decs += deciphers.final('utf8')
                    let updates = `update concours set end = 1 where id = ${decs}`

                    let results = await db.promise().query(updates)

                    return res.status(200).send({
                        final: true
                    })
                })
            } catch (e) {
                console.log('create participe')
                console.error(`[ERROR] participe/create -> ${e}`)
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                })
            }
        })
    }

    /**
     * Run
     */
    run() {
        this.middleware()
    }
}