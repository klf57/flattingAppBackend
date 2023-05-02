/**
 * Imports a users controller and defines each of the routes that will be used
 * each route will call a function in our controller
 *
 * UPDATE only need to retrieve other users tht are this person's flatmate.
 *
 */

const user = require('../controllers/user.controller');
const auth = require('../middleware/Authentication');

/**
 * Routes for user related actions
 * @param app
 */

const baseUrl = '/user';

module.exports = function(app) {

    app.route(baseUrl + '/signUp')
        .post(auth.isSignUpFormValid, user.create);


    app.route(baseUrl + '/login')
        .post(auth.isLoginFormValid, user.login);

    app.route(baseUrl + '/logout')
        .post(user.logout);

    app.route(baseUrl + '/flatmates')
        .get(auth.checkUserLoggedIn, user.viewFlatmates);




}

//todo show house details?