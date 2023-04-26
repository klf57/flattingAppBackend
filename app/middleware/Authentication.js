/**
 * Retrieves the userID after first checking if the provided token is  in db.
 * status codes : 501 = server error 401 = unauthorized.
 */
const user = require('../models/userinfo.model');
exports.checkUserLoggedIn= async function(req, res, next){

    try{

        const sessionToken = req.headers["x-authorization"]
        //if there is no x-Authorization in header.
        if(!(sessionToken)){
            res.status(401)
                .send("No token provided ");

        } else {

            const userId = await user.getUserByIdToken(sessionToken);


            if(userId) {
                //add the userId to the req and move to next function in user/flatmates route.
                //user id may be used when retrieving user's information for MENU screen
                req.body["userId"] = userId;
                next();

            } else {
                res.status(401)
                    .send("no user found with that token");
            }

        }

    } catch(err){
        res.status(501)
            .send();
    }

}

/**
 * Check that the login information is not empty / invalid. Return 401 unauthorised if it does not pass test.
 * This is so that backend does not try to send an Undefined property to the database causing wrong status code 500 to be returned.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.isLoginFormValid = async function(req, res, next){

    //checks if either email or password is empty.
    if( !( req.body['email'] || req.body['password']) ){


        res.status(401)
            .send("email or password is empty");

    } else {
        next();
    }





};


/**
 * Checks whether the all compulsory data is filled.
 * Req.params must have, email, names and password.
 * todo; prevent user trying to send in values that are just whitespace.
 */
exports.isUsersFormValid =  async function(req, res, next){

};

/**
 * Altering data is optionable, so it also handles if a req.param call turns up undefined.
 * User might only want to change one data value.
 */
exports.isUpdateFormValid  = async function(req, res, next){

};