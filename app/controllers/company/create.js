// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const axios = require('axios')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()
    .withRequired('nom', validator.isString())
    .withRequired('siren', validator.isString())
    .withRequired('telephone', validator.isString())
    .withRequired('email', validator.isString())
    .withRequired('mdp', validator.isString())
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
        this.app.post('/company/create', validator.express(check), async(req, res) => {
            try {
                const userCheck = `select * from entreprises where email = '${req.body.email}'`
                let result = await db.promise().query(userCheck)
                if (result[0].length !== 0) {
                    res.status(200).json({
                        code: 200,
                        message: 'user already exist'
                    })
                } else {
                    const tutu = await axios.post('http://localhost:4000/adresses/create', {
                      voie: req.body.voie,
                      ville: req.body.ville,
                      CP: req.body.CP
                    })
                    
                    const userCreate = `INSERT INTO entreprises (email, mdp, nom, siren, telephone,id_adresse)` +
                        `VALUES (` +
                        `'${req.body.email}', '${bcrypt.hashSync(req.body.mdp, saltRounds)}', '${req.body.nom}', '${req.body.siren}' , '${req.body.telephone}',${tutu.data.id}  )`

                    result = await db.promise().query(userCreate)

                    const user = `select * from entreprises where email = '${req.body.email}' `
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