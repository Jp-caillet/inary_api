const UserCreate = require('./user/create.js')
const UserShows = require('./user/shows.js')
const UserShow = require('./user/show.js')

const CompanyCreate = require('./company/create.js')
const CompanyAuth = require('./company/login.js')

const AdressCreate = require('./adresses/create.js')
const AdressShow = require('./adresses/show.js')

const exempleCreate = require('./exemples/create.js')

const colorCreate = require('./couleurs/create.js')

const transiColorCreate = require('./transition/colors/create.js')
const transiTagCreate = require('./transition/tags/create.js')
const transiExempleCreate = require('./transition/exemple/create.js')

const tagCreate = require('./tags/create.js')

const ChallengeCreate = require('./challenge/create.js')

const Login = require('./auth/login.js')

module.exports = {
    user: {
        UserCreate,
        UserShows,
        UserShow
    },
    company: {
    	CompanyCreate,
    	CompanyAuth
    },
    adresse: {
    	AdressCreate,
    	AdressShow
    },
    challenge: {
    	ChallengeCreate
    },
    auth: {
        Login
    },
    exemple: {
        exempleCreate
    },
    color: {
        colorCreate
    },
    tag: {
        tagCreate
    },
    transition:{
        transiColorCreate,
        transiTagCreate,
        transiExempleCreate
    }
}