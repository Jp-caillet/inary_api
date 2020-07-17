// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../../db.js")
const dotenv = require('dotenv')


// Core
const check = validator.isObject()
    .withRequired('id_tags', validator.isNumber())
    .withRequired('id_concour', validator.isNumber())


module.exports = class Login {
    constructor(app) {
        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.post('/transition/tag/create', validator.express(check), async(req, res) => {
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
                        const transicolorCreate = `INSERT INTO tags_concours (id_tags, id_concour)` +
                        `VALUES ('${req.body.id_tags}','${req.body.id_concour}')`

                        let result = await db.promise().query(transicolorCreate)
                        const toto = {
                            id: result[0].insertId
                        }
                        res.status(200).json(toto)
                    } catch (e) {
                        console.log('create transition/tag')
                        console.error(`[ERROR] transition/tag/create -> ${e}`)
                        res.status(200).json({
                            code: 200,
                            message: 'Bad request'
                        })
                    }
                })
            } catch (e) {
                console.log('create transition/tag')
                console.error(`[ERROR] transition/tag/create -> ${e}`)
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