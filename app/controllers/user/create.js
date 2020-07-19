// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()
    .withRequired('mail', validator.isString())
    .withRequired('mdp', validator.isString())
    .withRequired('nom', validator.isString())
    .withRequired('prenom', validator.isString())
    .withRequired('pseudo', validator.isString())
    .withRequired('birthday', validator.isDate())

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
        this.app.post('/user/create', validator.express(check), async(req, res) => {
            try {
                const entCheck = `select * from entreprises where email = '${req.body.mail}'`
                let result = await db.promise().query(entCheck)
                if (result[0].length !== 0) {
                    res.status(200).json({
                        code: 200,
                        message: 'Failed created'
                    })
                }
                const userCheck = `select * from etudiants where mail = '${req.body.mail}'`
                result = await db.promise().query(userCheck)
                if (result[0].length !== 0) {
                    res.status(200).json({
                        code: 200,
                        message: 'Failed created'
                    })
                } else {
                    console.log(new Date(req.body.birthday).getTime())
                    const userCreate = `INSERT INTO etudiants (mail, mdp, nom, prenom, login, naissance)` +
                        `VALUES (` +
                        `'${req.body.mail}', '${bcrypt.hashSync(req.body.mdp, saltRounds)}', '${req.body.nom}','${req.body.prenom}','${req.body.pseudo}','${req.body.birthday}')`

                    result = await db.promise().query(userCreate)

                    const user = `select * from etudiants where mail = '${req.body.mail}' `
                    result = await db.promise().query(user)
                    const toto = {
                        token: jwt.sign({
                                mail: result[0][0].mail,
                                mdp: result[0][0].mdp,
                                entreprise: false,
                                _id: result[0][0].id
                            },
                            process.env.KEY_TOKEN),
                    entreprise: false,
                    auth: true,
                    name: result[0][0].login
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