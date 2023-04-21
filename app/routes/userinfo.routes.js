/**
 * Imports a users controller and defines each of the routes that will be used
 * each route will call a function in our controller
 *
 * UPDATE only need to retrieve other users tht are this person's flatmate.
 *
 */

const user = require('../controllers/user.server.controller');


/**
 * Routes for user related actions
 * @param app
 */

const baseUrl = '/user';

module.exports = function(app) {

    app.route(baseUrl + '/signUp')
        .post(user.create);


    app.route(baseUrl + '/login')
        .post(user.login);



    //Re bills for the person and the house they live in.
    //SHOULD ALSO BE GETTING THE PERSON'S ACCOUNT ID and a token? to verify.
    //app.route('/api/mybills/:userId')
      //  .get(users.viewBills);
}

//todo show house details?