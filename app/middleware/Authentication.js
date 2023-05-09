/**
 * Contains functions that check received forms are valid.
 *  Although the frontend will also contain validity checks, adding another in the backend ensures that even if the user found a way to send an invalid form, a request will not be sent to the db.
 * Module needs to do white space checks for data input, especially for creating new user accounts to prevent db being filled with "empty" values.
 * todo: move functions re validity of data to a new file called validitychecking.
 **/
const user = require('../models/userinfo.model');
const {getUserByIdToken} = require("../models/userinfo.model");
const validityChecker = require("../models/ValidityChecks");



/**
 * Retrieves the userID after first checking if the provided token is  in db.
 * status codes : 501 = server error 401 = unauthorized.
 */
exports.checkUserLoggedIn= async function(req, res, next){
    console.log("checking if user has session token");

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
            .send(err);
    }

}

/**
 * Checks that the userId param matches the userId the token is assigned to.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.checkTokenAndIdMatch = async function(req, res, next){

    try{

        if(!(await validityChecker.tokenInDatabase(req.body['sessionToken']))){
            res.status(401)
                .send('unauthorised to make bills');
        }


        const  userId = req.params['userId'];
        const matchedId = await getUserByIdToken(req.body['sessionToken']);

        //if the users page they are on matches their session token, continue.
        if(matchedId.length != userId){
            res.status(401)
                .send('unauthorised to make changes');
        }

        next();


    }catch(err){
        res.status(501)
            .send(err);
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
    if( !( req.body['email'] || req.body['password']) || hasWhiteSpaces([req.body['email'], req.body['password']])  ){


        res.status(401)
            .send("email or password is empty");

    } else if(await validityChecker.emailInDatabase(req.body['email'])) {

        res.status(401)
            .send('email not in db');
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

        next(); //moves to next function called on the route.

    }


};

/**
 * Makes sure any information user wants to change is a valid change. It also handles if a req.param call turns up undefined.
 * For updates, user doesn't have to input all their information. Just the new data they want to change.
 * Update form only needs to check cases wherein, new password or email as well as full whitespace entries.
 * @req
 * @res 400 status for any invalid data detected.
 * @next continues to user.controller updateinfo
 */
exports.isUpdateFormValid  = async function(req, res, next) {


    let email = req.body["email"];
    let password = req.body["password"];

    //must check if email is valid.
    if (email) {
        if (!isEmailValid()) {
            res.status(400)
                .send("invalid email format");
        }

    }

    if (password) {
        if (password.length < 8 || hasWhiteSpaces(password)) {
            res.status(400)
                .send("new password too short or just whitespaces")



        }
    }

    //finally, need to check if the other entries were filled in with whitespaces
    if(hasWhiteSpaces([req.body["firstName"],req.body["lastName"],req.body["phoneNumber"], req.body["home"]])){
        res.status(400)
            .send("cant update with only spaces");
    } else {
        next();
    }


};





/**
 * Checks if the given email is in the correct Format. THe regular expression  should be able to detect common formats used for valid emails
 * https://www.regular-expressions.info/email.html
 * Note this function is used only as a helper for other functions in this file currently.
 * It will also return False if it detects any trailing whitespaces at the before and after the email.
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

        //only if it is not undefined. which happens in the case of checking update form validity.
        if(valuesToCheck.at(i)) {


            if (whiteSpaceExpression.test(valuesToCheck.at(i))) {

                return true;
            }
        }

    }

    return false;

}