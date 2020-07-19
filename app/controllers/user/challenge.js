// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../db.js")
const axios = require('axios')
const dotenv = require('dotenv')
const crypto = require('crypto')
const jwtDecode = require('jwt-decode')


module.exports = class Login {
    constructor(app) {
        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/candidat/projets', async(req, res) => {
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
                    	jwt.verify(token, process.env.KEY_TOKEN, async(err) => { 

                		const decoded = jwtDecode(token)

                        let text = "1"

                        // On définit notre algorithme de cryptage
                        let algorithm = 'aes256'

                        // Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
                        let password = process.env.KEY_TOKEN


                        const test = `select * from participations where id_etudiant = ${decoded._id}`
                        console.log(decoded._id)
                        let result1 = await db.promise().query(test)
                        // On crypte notre texte
                        
                        // On décrypte notre texte
                        /*
                        let decipher = crypto.createDecipher(algorithm,password);
                        let dec = decipher.update(crypted,'hex','utf8');
                        dec += decipher.final('utf8');
                        */

                        let tutu = []

                        for (let i = result1[0].length - 1; i >= 0; i--) {
                        	 const ChallengeShow = `select * from concours where id = ${result1[0][i].id_concour}`

	                        let result = await db.promise().query(ChallengeShow)
	                        let titi
	                        
	                          let fofo = await axios.get(`http://localhost:4000/company/show/${result[0][0].id_entreprise}`, {
	                            headers: {
	                                'x-access-token': req.headers['x-access-token']
	                            }})
	                          let nb = await axios.get(`http://localhost:4000/participe/nb/${result[0][0].id}`, {
	                            headers: {
	                                'x-access-token': req.headers['x-access-token']
	                            }})
	                          const dates = result[0][i].date_fin.split('/')
	                          let cipher = crypto.createCipher(algorithm,password)
	                          let crypted = cipher.update(result[0][i].id.toString(),'utf8','hex')
	                          crypted += cipher.final('hex')

	                           const toto = {
	                              id: crypted,
	                              title: result[0][i].nom,
	                              type: result[0][i].id_categorie,
	                              company: fofo.data.nom,
	                              finChallenge: {
	                                month: dates[1],
	                                day: dates[0], 
	                                year: dates[2]
	                              },
	                              interest: 0,
	                              participants: nb.data.nb
	                          }
	                          tutu.push(toto)
	                        
                        }
                       
                        
                        res.status(200).json(tutu)
                    })} catch (e) {
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

