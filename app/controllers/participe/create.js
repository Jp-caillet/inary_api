// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../db.js")
const dotenv = require('dotenv')
const jwtDecode = require('jwt-decode')
const crypto = require('crypto')


// Core
const check = validator.isObject()
    .withRequired('idConcour', validator.isString())
    .withRequired('isEntreprise', validator.isBoolean())
    .withRequired('src', validator.isString())




module.exports = class ParticipeCreate {
    constructor(app) {
        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.post('/participe/create', validator.express(check), async(req, res) => {
             try {
                 const token = req.headers['x-access-token']
                if (!token) return res.status(200).send({
                    create: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => {
                    if (err) return res.status(200).send({
                        create: false,
                        message: 'Failed to authenticate token.'
                    })
                    try {
                    	 // On définit notre algorithme de cryptage
                        let algorithm = 'aes256'

                        // Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
                        let password = process.env.KEY_TOKEN
                        
                        // On décrypte notre texte
                        
                        let decipher = crypto.createDecipher(algorithm,password)
                        let dec = decipher.update(req.body.idConcour,'hex','utf8')
                        dec += decipher.final('utf8')

                        const decoded = jwtDecode(token)
                    	if(req.body.isEntreprise){
                    		res.status(200).json({
                        		code: 200,
                        		message: 'Failed created',
                        		participe: false
                    		})
                    	}
                        const exempleCreate = `INSERT INTO participations (id_concour, id_etudiant,  final, src)` +
                        `VALUES (${dec}, ${decoded._id}, 0, '${req.body.src}' )`

                        let result = await db.promise().query(exempleCreate)
                        const toto = {
                            id: result[0].insertId,
                            participe: true

                        }
                        res.status(200).json(toto)
                    } catch (e) {
                        console.log('create participe')
                        console.error(`[ERROR] participe/create -> ${e}`)
                        res.status(200).json({
                            code: 200,
                            message: 'Bad request',
                            participe: false
                        })
                    }
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