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
                
                const addrCreate = `INSERT INTO entreprises (voie, ville, CP)` +
                    `VALUES (` +
                    `'${req.body.email}', '${bcrypt.hashSync(req.body.mdp, saltRounds)}', '${req.body.nom}', '${req.body.siren}' , '${req.body.telephone}'  )`
                let result = await db.promise().query(addrCreate)

                const addr = `select * from entreprises where email = '${req.body.email}' `
                result = await db.promise().query(user)
                const toto = {
                    token: jwt.sign({
                            nom: result[0][0].nom,
                            email: result[0][0].email,
                            entreprise: true,
                            _id: result[0][0].id
                        },
                            process.env.KEY_TOKEN)
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