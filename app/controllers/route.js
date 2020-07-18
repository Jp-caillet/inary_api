const UserCreate = require('./user/create.js')
const UserShows = require('./user/shows.js')
const UserShow = require('./user/show.js')

const CompanyCreate = require('./company/create.js')
const CompanyShow = require('./company/show.js')
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
const ChallengeShows = require('./challenge/shows.js')
const ChallengeShow = require('./challenge/show.js')

const ParticipantNB = require('./participe/nbPaticipant.js')
const ParticipantCreate = require('./participe/create.js')

const SelectionShows = require('./selection/shows.js')
const SelectionFinal = require('./selection/final.js')

const Login = require('./auth/login.js')

module.exports = {
    user: {
        UserCreate,
        UserShows,
        UserShow
    },
    company: {
    	CompanyCreate,
        CompanyShow,
    	CompanyAuth
    },
    adresse: {
    	AdressCreate,
    	AdressShow
    },
    challenge: {
    	ChallengeCreate,
        ChallengeShows,
        ChallengeShow
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
    },
    participant: {
        ParticipantNB,
        ParticipantCreate
    },
    selection: {
        SelectionShows,
        SelectionFinal
    }
}