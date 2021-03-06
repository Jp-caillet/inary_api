// Dependencie
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const server = require('http')



// Core
const routes = require('./controllers/route.js')

/**
 * Server
 */
module.exports = class Server {
    constructor() {
        this.app = express()
        this.server = server.createServer(this.app)
        this.run()
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.use(compression())
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({
            'extended': true
        }))
        this.app.use(bodyParser.json())
    }

    /**
     * Routes
     */
    routes() {

        new routes.user.UserCreate(this.app)
        new routes.user.UserShows(this.app)
        new routes.user.UserShow(this.app)
        new routes.user.UserMe(this.app)
        new routes.user.UserChall(this.app)

        new routes.company.CompanyCreate(this.app)
        new routes.company.CompanyShow(this.app)
        new routes.company.CompanyAuth(this.app)
        new routes.company.CompanyMe(this.app)
        new routes.company.CompanyChall(this.app)

        new routes.adresse.AdressCreate(this.app)
        new routes.adresse.AdressShow(this.app)

        new routes.exemple.exempleCreate(this.app)

        new routes.color.colorCreate(this.app)
        
        new routes.transition.transiColorCreate(this.app)
        new routes.transition.transiTagCreate(this.app)
        new routes.transition.transiExempleCreate(this.app)

        new routes.participant.ParticipantNB(this.app)
        new routes.participant.ParticipantCreate(this.app)


        new routes.tag.tagCreate(this.app)

        new routes.challenge.ChallengeCreate(this.app)
        new routes.challenge.ChallengeShows(this.app)
        new routes.challenge.ChallengeShow(this.app)

        new routes.selection.SelectionShows(this.app)
        new routes.selection.SelectionFinal(this.app)
        new routes.selection.SelectionWinner(this.app)

        new routes.auth.Login(this.app)


        // If route not exist
        this.app.use((req, res) => {
            res.status(404).json({
                'code': 404,
                'message': 'Not Found'
            })
        })
    }

    /**
     * Security
     */
    security() {
        this.app.use(helmet())
        this.app.disable('x-powered-by')
    }

    /**
     * Run
     */
    run() {
        this.security()
        this.middleware()
        this.routes()
        this.server.listen(4000)
        console.log('connected port 4000')
    } catch (e) {
        console.error(`[ERROR] Server -> ${e}`)
    }
}