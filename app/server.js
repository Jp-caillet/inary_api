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

        new routes.company.CompanyCreate(this.app)
        new routes.company.CompanyAuth(this.app)

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