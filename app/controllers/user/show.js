// Dependencies

const validator = require('node-validator')
const db = require("../../db.js")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()

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
        this.app.get('/user/show', async(req, res) => {
            try {
                if (!req.query.id) {
                    return res.status(404).json({
                        code: 404,
                        message: 'missing params'
                    })
                }
                const userCheck = `select * from etudiants where id=${req.query.id}`
                let result = await db.promise().query(userCheck)
                if (result[0].length == 0) {
                    return res.status(401).json({
                        code: 401,
                        message: 'user dont exist'
                    })
                }
                let toto = []
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