// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../db.js")
const dotenv = require('dotenv')


// Core
const check = validator.isObject()
    .withRequired('email', validator.isString())
    .withRequired('mdp', validator.isString())

module.exports = class Login {
    constructor(app) {
        this.app = app
        this.run()
    }



    /**
     * Middleware
     */
    middleware() {
        this.app.post('/company/login', validator.express(check), async(req, res) => {
            try {

                const userCheck = `select * from entreprises where email = '${req.body.email}'`
                const result = await db.promise().query(userCheck)
                const user = result[0][0]

                if (result[0].length === 0) {
                    return res.status(200).json({
                        code: 200,
                        message: 'Authentication failed. User not found.',
                        auth: false
                    })
                }
                if (!bcrypt.compareSync(req.body.mdp, user.mdp)) {
                    return res.status(200).json({
                        code: 200,
                        message: 'Authentication failed. Wrong password.',
                        auth: false
                    })
                }
                return res.status(200).json({
                    token: jwt.sign({
                        nom: result[0][0].nom,
                        email: result[0][0].email,
                        entreprise: true,
                        _id: result[0][0].id
                    }, process.env.KEY_TOKEN),
                    auth: true
                })
            } catch (e) {
                console.log('login user')
                console.error(`[ERROR] user/login -> ${e}`)
                return res.status(400).json({
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