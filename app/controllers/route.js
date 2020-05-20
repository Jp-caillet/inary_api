const UserCreate = require('./user/create.js')
const UserShows = require('./user/shows.js')
const UserShow = require('./user/show.js')

const CompanyCreate = require('./company/create.js')
const CompanyAuth = require('./company/login.js')

const AdressCreate = require('./adresses/create.js')


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
    	AdressCreate
    }
}