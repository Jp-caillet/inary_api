// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')


// Core
const check = validator.isObject()

module.exports = class Show {
    constructor(app) {
        dotenv.config()

        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/company/show', async(req, res) => {
         try {
                 const token = req.headers['x-access-token']
                if (!token) return res.status(200).send({
                    final: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => { 
                const decoded = jwtDecode(token)

                const userCheck = `select * from entreprises where id=${decoded._id}`
                let result = await db.promise().query(userCheck)
                if (result[0].length == 0) {
                    return res.status(401).json({
                        code: 401,
                        message: 'user dont exist'
                    })
                }
                let toto = []
               const adresse = `select * from adresses where id=${result[0][0].id_adresse}`
                let resultA = await db.promise().query(adresse)
                let user = {
                    nom: result[0][0].nom,
                    siren: result[0][0].siren,
                    adresse: {
                    	voie: resultA[0][0].voie,
                    	ville: resultA[0][0].ville,
                    	codePostal: resultA[0][0].code_postal,
                    },
                    telephone: result[0][0].telephone,
                    email: result[0][0].email
                }
                res.status(200).json(user)
                    if (err) return res.status(200).send({
                        final: false,
                        message: 'Failed to authenticate token.'
                    })
                   
                })
            } catch (e) {
                console.log('create participe')
                console.error(`[ERROR] participe/create -> ${e}`)
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