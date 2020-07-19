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
        this.app.post('/login', validator.express(check), async(req, res) => {
            try {
            	let boolEntreprise = true
                let entrepriseCheck = `select * from entreprises where email = '${req.body.email}'`
                let result = await db.promise().query(entrepriseCheck)
                let user = result[0][0]
                let name
                if(result[0].length === 0){
                	 entrepriseCheck = `select * from etudiants where mail = '${req.body.email}'`
                	 result = await db.promise().query(entrepriseCheck)
                	 user = result[0][0]
                	 boolEntreprise = false
                     name = result[0][0].login

                }else{
                    name = result[0][0].nom
                }

                if (result[0].length === 0) {
                    return res.status(200).json({
                        code: 200,
                        message: 'Authentication failed.',
                        auth: false
                    })
                }
                if (!bcrypt.compareSync(req.body.mdp, user.mdp)) {
                    return res.status(200).json({
                        code: 200,
                        message: 'Authentication failed.',
                        auth: false
                    })
                }
                return res.status(200).json({
                    token: jwt.sign({
                        nom: result[0][0].nom,
                        email: result[0][0].email,
                        entreprise: boolEntreprise,
                        _id: result[0][0].id
                    }, process.env.KEY_TOKEN),
                    entreprise: boolEntreprise,
                    name: name,
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