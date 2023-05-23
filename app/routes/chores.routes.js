

const baseUrl ='/chores';
const auth = require('../middleware/Authentication');
const chores = require('../controllers/chores. controller')

module.exports = function(app){

    app.route(baseUrl)
        .get(auth.checkUserLoggedIn,chores.viewChores);
}