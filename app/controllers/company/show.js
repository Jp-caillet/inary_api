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
        this.app.get('/company/show/:id', async(req, res) => {
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
                    const company = `select * from entreprises where id = '${req.params.id}'`

                    
                	let result = await db.promise().query(company)
                    if (result[0].length == 0) {
                    return  res.status(200).json({
                        code: 200,
                        message: 'company not found'
                        })
                    } 
                	const toto = {
                        id: result[0][0].id,
                        nom:  result[0][0].nom,
                        siren: result[0][0].siren,
                        id_adresse: result[0][0].id_adresse,
                        telephone: result[0][0].telephone
                    }
                    res.status(200).json(toto)
                })


            } catch (e) {

                console.log('create user')
                console.error(`[ERROR] company/show -> ${e}`)
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