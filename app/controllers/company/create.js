// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()
    .withRequired('nom', validator.isString())
    .withRequired('siren', validator.isString())
    .withRequired('email', validator.isString())
    .withRequired('email', validator.isString())
    .withRequired('mdp', validator.isString())

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
        this.app.post('/company/create', validator.express(check), async(req, res) => {
            try {
                const userCheck = `select * from entreprise where email = '${req.body.email}'`
                let result = await db.promise().query(userCheck)
                if (result[0].length !== 0) {
                    res.status(401).json({
                        code: 401,
                        message: 'user already exist'
                    })
                } else {
                    const userCreate = `INSERT INTO entreprise (email, mdp)` +
                        `VALUES (` +
                        `'${req.body.email}', '${bcrypt.hashSync(req.body.mdp, saltRounds)}')`

                    result = await db.promise().query(userCreate)

                    const user = `select * from entreprise where email = '${req.body.email}' `
                    result = await db.promise().query(user)
                    const toto = {
                        token: jwt.sign({
                                email: result[0][0].email,
                                mdp: result[0][0].mdp,
                                entreprise: true,
                                _id: result[0][0].id
                            },
                            process.env.KEY_TOKEN)
                    }
                    res.status(200).json(toto)
                }


            } catch (e) {

                console.log('create user')
                console.error(`[ERROR] user/create -> ${e}`)
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