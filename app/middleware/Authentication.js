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
 * Check that the login information is not empty / invalid. Return 401 unauthorised if it does not pass checks. or 400 if invalid data given.
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
 * Checks whether  all the compulsory data is filled and the data is not just whitespace. Email ends are also trimmed.
 * @req  body must have, email, first and last names and password provided.
 * passwords must be at least 8 letters long.
 * responses : 400 for invalid data given in requests or missing data.
 *
 **/
exports.isSignUpFormValid =  async function(req, res, next){

    //Checking these variables.
    const firstName =  req.body[`firstName`];
    const lastName =  req.body[`lastName`];
    const email =  req.body[`email`];
    const password =  req.body['password'];



    //checks if any of the fields are undefined.
    if(!(firstName || lastName || email || password )){
        res.status(400)
            .send("invalid form sent. one of them is undefined");


    } else if(hasWhiteSpaces([firstName,lastName,email,password])) {
        //checks if anything is just a whitespace. OR if the length is one

        res.status(400)
            .send("invalid data sent, can't have only whitespace");

    }
    else if(!(isEmailValid(email))) {

        res.status(400)
            .send("email is not a valid format")

    } else if(password.length < 8){
            res.status(400)
                .send("password length too short");
        } else{

        //needs to trim any trailing whitespace from email.
        next(); //moves to next function called on the route.

    }


};

/**
 * Makes sure any information user wants to change is a valid change. It also handles if a req.param call turns up undefined.
 * For updates, user doesn't have to input all their informatio again. Just the new data they want to change.
 * @req
 * @res
 * @next
 */
exports.isUpdateFormValid  = async function(req, res, next){

};





/**
 * Checks if the given email is in the correct Format. THe regular expression isn't 100% accurate but should be able to detect common formats used for valid emails
 * https://www.regular-expressions.info/email.html
 * Note this function is used only as a helper for other functions in this file currently.
 * @param email the email received in req.body
 * @returns  True if it fits the regular expression. Strongly indicates that the given email is in a valid format.
 */
function isEmailValid(email){

    let validEmailExpression = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[A-Za-z]{2,}$/;


    return validEmailExpression.test(email);


};


/**
 *Helper function to check if a variable was only inputted with whitespaces.
 * @param valuesToCheck
 * @returns {boolean} true if it is only just white spaces. otherwise false.
 */
function hasWhiteSpaces(valuesToCheck){

    //Regular expression. ^ means at start of string. \s symbol for space * for as many repeats of \s or none at all. $ is end of pattern.
    let whiteSpaceExpression = /^\s*$/;

    for(let i = 0; i < valuesToCheck.length; i++){


        if( whiteSpaceExpression.test(valuesToCheck.at(i) )){

            return true;
        }

    }

    return false;

}