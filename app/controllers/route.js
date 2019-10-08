const UserCreate = require('./user/create.js')
const UserShows = require('./user/shows.js')
module.exports = {
    user: {
        UserCreate,
        UserShows
    }
}