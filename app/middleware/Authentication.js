/**
 * Contains functions that check received forms are valid.
 *  Although the frontend will also contain validity checks, adding another in the backend ensures that even if the user found a way to send an invalid form, a request will not be sent to the db.
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
 * passwords must be at least 8 letters long.
 * responses : 400 for bad requests.
 **/
exports.isSignUpFormValid =  async function(req, res, next){

    //Checking these variables.
    const firstName =  req.body[`firstName`];
    const lastName =  req.body[`lastName`];
    const email =  req.body[`email`];
    const password =  req.body['password'];


    //Regular expression. ^ means at start of string. \s symbol for space * for as many repeats of \s or none at all. $ is end of pattern.
    let whiteSpaceExpression = /^\s*$/;


    //checks if any of the fields are undefined.
    if((firstName || lastName || email || password) == undefined){
        res.status(400)
            .send("invalid form sent. one of them is undefined");

    } else if(whiteSpaceExpression.test(email) || whiteSpaceExpression.test(firstName) || whiteSpaceExpression.test(lastName)) {
        //checks if anything is just a whitespace. OR if the length is one

        res.status(400)
            .send("invalid data sent, can't' haveo nly whitespace");

    }
    else {

        res.status(200)
            .send("nothing wrong found");

        //next(); //moves to next function called on the route.

    }


    //remove any trailing whitespace from the email.
    return;

};

/**
 * Makes sure any information user wants to change is a valid change. It also handles if a req.param call turns up undefined.
 * For updates, user doesn't have to input all their informatio again. Just the new data they want to change.
 */
exports.isUpdateFormValid  = async function(req, res, next){

};