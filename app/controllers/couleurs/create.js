// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../db.js")
const dotenv = require('dotenv')


// Core
const check = validator.isObject()
    .withRequired('couleur', validator.isString())


module.exports = class Login {
    constructor(app) {
        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.post('/couleur/create', validator.express(check), async(req, res) => {
             try {
                 const token = req.headers['x-access-token']
                if (!token) return res.status(200).send({
                    create: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => {
                    if (err) return res.status(200).send({
                        create: false,
                        message: 'Failed to authenticate token.'
                    })
                    try {
                        const exempleCreate = `INSERT INTO colors (couleur)` +
                        `VALUES ('${req.body.couleur}')`

                        let result = await db.promise().query(exempleCreate)
                        const toto = {
                            id: result[0].insertId
                        }
                        res.status(200).json(toto)
                    } catch (e) {
                        console.log('create color')
                        console.error(`[ERROR] colo/create -> ${e}`)
                        res.status(200).json({
                            code: 200,
                            message: 'Bad request'
                        })
                    }
                })
            } catch (e) {
                console.log('create color')
                console.error(`[ERROR] color/create -> ${e}`)
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