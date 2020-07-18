// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


module.exports = class Select {
    constructor(app) {
        dotenv.config()

        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/select/:id', async(req, res) => {
            try {
            	
                 const token = req.headers['x-access-token']
                if (!token) return res.status(401).send({
                    create: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => {
                    if (err) return res.status(500).send({
                        shows: false,
                        message: 'Failed to authenticate token.'
                    })
        			let algorithm = 'aes256'
                    let password = process.env.KEY_TOKEN
                    
                    
                    let decipher = crypto.createDecipher(algorithm,password)
                    let dec = decipher.update(req.params.id,'hex','utf8')
                    dec += decipher.final('utf8')
                    const participe = `select * from participations where id_concour = '${dec}'`
                	let result = await db.promise().query(participe)
                	let send = []
                	for (let i = result[0].length - 1; i >= 0; i--) {

                		let cipher = crypto.createCipher(algorithm,password)
                        let crypted = cipher.update(result[0][i].id.toString(),'utf8','hex')
                        crypted += cipher.final('hex')
                		send.push({
                			id: crypted,
                			src: result[0][i].src
                		})
                	}
                    res.status(200).json(send)
                })


            } catch (e) {

                console.log('create user')
                console.error(`[ERROR] participe/show -> ${e}`)
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