

const baseUrl ='/chores';
const auth = require('../middleware/Authentication');
const chores = require('../controllers/chores. controller')
const validity = require("../middleware/ValidityChecking");

module.exports = function(app){

    app.route(baseUrl +'/:userId')
        .get(auth.checkUserLoggedIn,chores.viewChores)
        .post(auth.checkUserLoggedIn, auth.checkTokenAndIdMatch, validity.isLivingWithUser, chores.makeChores) //making shores
        .patch(auth.checkUserLoggedIn, auth.checkTokenAndIdMatch, chores.changeChoreStatus);
}

