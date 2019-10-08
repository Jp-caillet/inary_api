const UserCreate = require('./user/create.js')
const UserShows = require('./user/shows.js')
const UserShow = require('./user/show.js')
module.exports = {
    user: {
        UserCreate,
        UserShows,
        UserShow
    }
}