// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()

module.exports = class Shows {
    constructor(app) {
        dotenv.config()

        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/user/shows', async(req, res) => {
            try {
                const userCheck = `select * from etudiants`
                let result = await db.promise().query(userCheck)

                for (var i = 0; i <= result[0].length - 1; i++) {
                    let user = {
                        id: result[0][i].id,
                        nom: result[0][i].nom,
                        prenom: result[0][i].prenom,
                        naissance: result[0][i].naissance,
                        login: result[0][i].login,
                        mail: result[0][i].mail,
                        telephone: result[0][i].telephone
                    }
                    toto[i] = user
                }
                res.status(200).json(toto)
            } catch (e) {

                console.log('Shows user')
                console.error(`[ERROR] user/Shows -> ${e}`)
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