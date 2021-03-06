// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')


module.exports = class Create {
    constructor(app) {
        dotenv.config()

        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/participe/nb/:id', async(req, res) => {
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
                    if (!req.params || !req.params.id.length || isNaN(req.params.id)) {
          			return res.status(404).json({
            			code: 404,
            			message: 'Not Found'
          				})
        			}
                    const participe = `select * from participations where id_concour = '${req.params.id}'`

                    
                	let result = await db.promise().query(participe)
                	const toto = {
                        nb: result[0].length
                    }
                    res.status(200).json(toto)
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