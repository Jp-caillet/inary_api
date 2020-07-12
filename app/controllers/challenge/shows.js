// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../db.js")
const axios = require('axios')
const dotenv = require('dotenv')

module.exports = class Login {
    constructor(app) {
        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/projets', async(req, res) => {
             try {
                 const token = req.headers['x-access-token']
                if (!token) return res.status(200).send({
                    show: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => {
                    if (err) return res.status(200).send({
                        show: false,
                        message: 'Failed to authenticate token.'
                    })
                    try {
                        const ChallengeShow = `select * from concours`

                        let result = await db.promise().query(ChallengeShow)
                        let tutu = []
                        let titi
                        console.log(result[0][0].id)
                        for (let i = result[0].length - 1; i >= 0; i--) {

                          let fofo = await axios.get(`http://localhost:4000/company/show/${result[0][0].id_entreprise}`, {
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                          console.log(fofo[0][0])
                         
                        }
                        const toto = {
                            id: result[0].insertId
                        }
                        res.status(200).json(toto)
                    } catch (e) {
                        console.log('show challenge')
                        console.error(`[ERROR] colo/show -> ${e}`)
                        res.status(200).json({
                            code: 200,
                            message: 'Bad request'
                        })
                    }
                })
            } catch (e) {
                console.log('show challenge')
                console.error(`[ERROR] challenge/show -> ${e}`)
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

