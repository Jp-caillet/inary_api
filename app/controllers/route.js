const UserCreate = require('./user/create.js')
const UserShows = require('./user/shows.js')
const UserShow = require('./user/show.js')

const CompanyCreate = require('./company/create.js')

module.exports = {
    user: {
        UserCreate,
        UserShows,
        UserShow
    },
    company: {
    	CompanyCreate
    }
}