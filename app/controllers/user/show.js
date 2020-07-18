// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

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
        this.app.get('/user/show/:id', async(req, res) => {
         try {
                 const token = req.headers['x-access-token']
                if (!token) return res.status(200).send({
                    final: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => { 

                const userCheck = `select * from etudiants where id=${req.params.id}`
                let result = await db.promise().query(userCheck)
                if (result[0].length == 0) {
                    return res.status(401).json({
                        code: 401,
                        message: 'user dont exist'
                    })
                }
                let toto = []
               
                let user = {
                    nom: result[0][0].nom,
                    prenom: result[0][0].prenom,
                    naissance: result[0][0].naissance,
                    login: result[0][0].login,
                    mail: result[0][0].mail,
                    telephone: result[0][0].telephone
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