// Dependencies

const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../../db.js")
const axios = require('axios')
const dotenv = require('dotenv')
const crypto = require('crypto')
const jwtDecode = require('jwt-decode')


module.exports = class Show {
    constructor(app) {
        this.app = app
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.get('/projet/:id', async(req, res) => {
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
                        const decoded = jwtDecode(token)
                        // On définit notre algorithme de cryptage
                        let algorithm = 'aes256'

                        // Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
                        let password = process.env.KEY_TOKEN
                        
                        // On décrypte notre texte
                        
                        let decipher = crypto.createDecipher(algorithm,password)
                        let dec = decipher.update(req.params.id,'hex','utf8')
                        dec += decipher.final('utf8')
                        
                        const ChallengeShow = `select * from concours where id= ${dec}`

                        let result = await db.promise().query(ChallengeShow)
                      
                       
                          let nb = await axios.get(`http://localhost:4000/participe/nb/${result[0][0].id}`, {
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                          const dateF = result[0][0].date_fin.split('/')
                          const dateD = result[0][0].date_debut.split('/')

                         const colors = `select couleur from colors inner join color_concours on color_concours.id_color = colors.id where id_concour=${dec}`
                        let colorResult = await db.promise().query(colors)
                        
                        let color = []
                        for (let i = colorResult[0].length - 1; i >= 0; i--) {
                        	color.push(colorResult[0][i].couleur)
                        }

                        const exempleRequest = `select link from exemples inner join exemple_concours on exemple_concours.id_exemple = exemples.id where id_concour=${dec}`
                        let exemResult = await db.promise().query(exempleRequest)
                        let exem = []
                        for (let i = exemResult[0].length - 1; i >= 0; i--) {
                        	exem.push(exemResult[0][i].link)
                        }

                        const tagRequest = `select nom from tags inner join tags_concours on tags_concours.id_tags = tags.id where id_concour=${dec}`
                        let tagResult = await db.promise().query(tagRequest)
                        let tag = []
                        for (let i = tagResult[0].length - 1; i >= 0; i--) {
                        	tag.push(tagResult[0][i].nom)
                        }
                        let participe = false
                        const participeReq = `select * from participations where id_concour=${dec} and id_etudiant= ${decoded._id}`
                        let participeResult = await db.promise().query(participeReq)
                        if (participeResult[0].length !== 0) {
                        	participe = true
                        }
                        const nameReq = `select * from entreprises where id = '${result[0][0].id_entreprise}'`
                        let nameResult = await db.promise().query(nameReq)

                          let entretien = false
                          let option = false
                          if(result[0][0].entretien === 1){
                          	entretien = true
                          }
                          if(result[0][0].options === 1){
                          	option = true
                          }
                          const toto = {
                              brief: result[0][0].resume,
                              company: nameResult[0][0].nom,
                              cashPrize: result[0][0].cashPrize,
                              colors: color,
                              debutChallenge: {
                              	month: dateD[1],
                                day: dateD[0], 
                                year: dateD[2]
                              },
                              entretiens: entretien,
                              exemples: exem,
                              finChallenge: {
                                month: dateF[1],
                                day: dateF[0], 
                                year: dateF[2]
                              },
                              id_type: result[0][0].id_categorie,
                              option: option,
                              priceDuration: result[0][0].priceDuration,
                              tags: tag,
                              title: result[0][0].nom,
                              total: result[0][0].total,
                              maxInterested: 150,
                              interested: nb.data.nb,
                              isParticipating: participe
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


