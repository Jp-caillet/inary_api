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
    .withRequired('nom', validator.isString())
    .withRequired('id_categorie', validator.isNumber())
    .withRequired('resume', validator.isString())
    .withRequired('salaire', validator.isString())
    .withRequired('entretien', validator.isBoolean())
    .withRequired('nb_entretien', validator.isNumber())
    .withRequired('date_debut', validator.isDate())
    .withRequired('date_fin', validator.isDate())
    .withRequired('nb_participant', validator.isNumber())
    .withOptional('exemple_creation', validator.isString())

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
                 const token = req.headers['x-access-token']
                if (!token) return res.status(401).send({
                    create: false,
                    message: 'No token provided.'
                })
                jwt.verify(token, process.env.KEY_TOKEN, async(err) => {
                    if (err) return res.status(500).send({
                        shows: false,
                        message: 'Failed to authenticate token.'
                    })
                    const decoded = jwtDecode(token)
                    if (! req.body.exemple_creation) {

                    }
                    try {
                    const challCreate = `INSERT INTO concours (nom, id_categorie,resume, salaire,entretien, nb_entretien, date_crea, date_debut, date_fin, nb_participant, exemple_creation, id_entreprise )` +
                    `VALUES (` +
                    `'${req.body.nom}', ${req.body.id_categorie}, '${req.body.resume}',`+
                    `'${req.body.salaire}', ${req.body.entretien}, ${req.body.nb_entretien},`+
                    `'${new Date()}', '${req.body.date_debut}', '${req.body.date_fin}',`+
                    `${req.body.nb_participant}, '${req.body.exemple_creation}', ${decoded._id})`

                    let result = await db.promise().query(challCreate)
                    const chal = `select * from concours where id = ${result[0].insertId} `
                    result = await db.promise().query(chal)
                    const toto = {
                        nom: result[0][0].nom,
                        id_categorie: result[0][0].id_categorie,
                        resume: result[0][0].resume,
                        salaire: result[0][0].salaire,
                        entretien: result[0][0].entretien,
                        nb_entretien: result[0][0].nb_entretien,
                        date_debut: result[0][0].date_debut,
                        date_fin: result[0][0].date_fin,
                        nb_participant: result[0][0].nb_participant,
                        id_entreprise: result[0][0].id_entreprise
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