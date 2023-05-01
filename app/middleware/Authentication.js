/**
 * Module needs to do white space checks for data input, especially for creating new user accounts to prevent db being filled with "empty" values.
 **/
const user = require('../models/userinfo.model');



/**
 * Retrieves the userID after first checking if the provided token is  in db.
 * status codes : 501 = server error 401 = unauthorized.
 */
exports.checkUserLoggedIn= async function(req, res, next){

    try{

        const sessionToken = req.headers["x-authorization"]
        //if there is no x-Authorization in header.
        if(!(sessionToken)){
            res.status(401)
                .send("No token provided ");

        } else {

            const userId = await user.getUserByIdToken(sessionToken);

            //todo test what happens if no matching token is found. Check what happens if no userId body is returned with query.
            if(userId) {
                //add the userId to the req and move to next function in user/flatmates route.
                //user id may be  needed when retrieving user's information for MENU screen
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
 * Check that the login information is not empty / invalid. Return 401 unauthorised if it does not pass checks.
 * This is so that backend does not try to send an Undefined property to the database causing  status code 500 to be returned.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.isLoginFormValid = async function(req, res, next){

    //checks if either email or password is empty. todo: check for whitespace in given info
    if( !( req.body['email'] || req.body['password'])  ){


        res.status(401)
            .send("email or password is empty");

    } else {
        next();
    }

};


/**
 * todo:
 * Checks whether  all the compulsory data is filled.
 * Req.params must have, email, names and password.
 *
 */
exports.isUsersFormValid =  async function(req, res, next){

};

/**
 * Makes sure any information user wants to change is a valid change. It also handles if a req.param call turns up undefined.
 * User might only want to change one data value.
 */
exports.isUpdateFormValid  = async function(req, res, next){

};