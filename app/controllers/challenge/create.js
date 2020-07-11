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
    .withRequired('brief', validator.isString())
    .withRequired('cashPrize', validator.isNumber())
    .withRequired('colors', validator.isArray())
    .withRequired('debutChallenge', validator.isString())
    .withRequired('entretiens', validator.isBoolean())
    .withRequired('exemples', validator.isArray())
    .withRequired('finChallenge', validator.isString())
    .withRequired('id_type', validator.isNumber())
    .withRequired('option', validator.isBoolean())
    .withRequired('priceDuration', validator.isNumber())
    .withRequired('tags', validator.isArray())
    .withRequired('title', validator.isString())
    .withRequired('total', validator.isNumber())


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
        this.app.post('/challenge/create', validator.express(check), async(req, res) => {
            try {
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

                        let date_crea = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
                        //let date_debut = `${req.body.debutChallenge.day}/${req.body.debutChallenge.month}/${req.body.debutChallenge.year}`
                        //let date_fin = `${req.body.finChallenge.day}/${req.body.finChallenge.month}/${req.body.finChallenge.year}`
                        
                        const challenge = `INSERT INTO concours (nom, id_categorie, resume, entretien, date_crea, date_debut, date_fin, nb_participant, id_entreprise, options, cashprize, priceduration, total)` +
                        `VALUES ('${req.body.title}', '${req.body.id_type}', '${req.body.brief}', '${req.body.entretiens}', '${date_crea}', '${req.body.debutChallenge}','${req.body.finChallenge}', 0, '${req.body.id_entreprise}', '${req.body.options}', ${req.body.cashPrize}, ${req.body.priceDuration}, ${req.body.total})`
                        let result = await db.promise().query(challenge)
                        let id_challenge = result[0].insertId
                        for (let i = req.body.colors.length - 1; i >= 0; i--) {
                            let tutu = await axios.post('http://localhost:4000/couleur/create', {
                                couleur: req.body.colors[i]
                            },{
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                            let toto = await axios.post('http://localhost:4000/transition/color/create', {
                                id_color: tutu.data.id,
                                id_concour: id_challenge
                            },{
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                            
                        }

                        for (let i = req.body.tags.length - 1; i >= 0; i--) {
                            let cucu = await axios.post('http://localhost:4000/tag/create', {
                                tag: req.body.tags[i]
                            },{
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                            let coco = await axios.post('http://localhost:4000/transition/tag/create', {
                                id_tags: cucu.data.id,
                                id_concour: id_challenge
                            },{
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                        }


                        for (let i = req.body.exemples.length - 1; i >= 0; i--) {
                            let lulu = await axios.post('http://localhost:4000/exemple/create', {
                                exemple: req.body.exemples[i]
                            },{
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                            let lolo = await axios.post('http://localhost:4000/transition/exemple/create', {
                                id_exemple: lulu.data.id,
                                id_concour: id_challenge
                            },{
                            headers: {
                                'x-access-token': req.headers['x-access-token']
                            }})
                        }


                        const toto = {
                            id: result[0].insertId
                        }
                        res.status(200).json(toto)

                    } catch (e) {
                        console.log('create tag')
                        console.error(`[ERROR] tag/create -> ${e}`)
                        res.status(200).json({
                            code: 200,
                            message: 'Bad request'
                        })
                    }
                })
            } catch (e) {
                console.log('create tag')
                console.error(`[ERROR] tag/create -> ${e}`)
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                })
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