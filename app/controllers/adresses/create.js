// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()
    .withRequired('voie', validator.isString())
    .withRequired('ville', validator.isString())
    .withRequired('CP', validator.isString())

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
        this.app.post('/adresses/create', validator.express(check), async(req, res) => {
            try {
                
                const addrCreate = `INSERT INTO adresses (voie, ville, code_postal)` +
                    `VALUES (` +
                    `'${req.body.voie}', '${req.body.ville}', '${req.body.CP}')`
                let result = await db.promise().query(addrCreate)
                const addr = `select * from adresses where id = ${result[0].insertId} `
                result = await db.promise().query(addr)
                const toto = {
                        id: result[0][0].id,
                        voie: result[0][0].voie,
                        ville: result[0][0].ville,
                        code_postal: result[0][0].code_postal
                    }
                res.status(200).json(toto)
                


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