
/**
 * Handles json sent from client and sends to model.
 * Followed this tutorial https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
 * to setup securing password
 *
 */

const jwt = require(`jsonwebtoken`);

const user = require('../models/userinfo.model');
const bcrypt = require('bcrypt');
const Process = require("process");


const saltRounds = 10;


/**
 * Handles creating a new user.
 * @param req User must provide email, name, and a password.
 * @param res a 201 status if successfully made otherswise 500 with the reason for the error. 409 if trying to enter an email already in db.
 * @returns {Promise<void>}
 */
exports.create = async function(req, res){
    console.log('\nRequest to create a new user..');

    const firstName = req.body[`firstName`];
    const lastName = req.body[`lastName`];
    const email = req.body[`email`];
    const password = req.body[`password`];



    //hash and salt the password being sent to database.
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    try {

        await user.createNewUser(firstName, lastName, email, hashedPassword);

        res.status(201)
            .send("USER CREATED"); //{user_id: result.insertId}

        //the user_id returned to the client to use in further requests
    } catch ( err ) {

        // checks if this is caused by user triyng to enter an email already in the system.
        if(err.errno == 1062){
            res.status(409)
                .send("email already exists");

        } else {
            res.status(500)
                .send(`ERROR creating account: ${err}`);
        }

    }
}


/**
 * Handles logging in the user to the flatting app.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.login = async function(req, res) {

    console.log('request to login');


    //user logs in with their email.
    let password = req.body['password'];
    let email = req.body['email'];

    try{


        const userDetails = await user.getHashedPassword(email);

        //compare the passwords
        if(bcrypt.compare(password, userDetails['password'])){


            //jwt.sign required 4 arguments. otherwise it threw an error.
            const sessionToken = jwt.sign(userDetails['userid'], Process.env.SECRET, undefined, undefined );

            await user.loginUser(userDetails['userid'],sessionToken);

            //returns the session code that is assigned to the logged in user.
            res.status(200)
                .json({sessionToken});

        } else {
            res.status(401)
                .send("password or email does not match");
        }


    } catch (err){
        res.status(500)
            .send(`error logging in ${err}`);
    }


}

/**
 * Handles commands needed to tell the db that user has logged out.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.logout = async function(req, res){

    console.log('request to logout');

    //x-authorization appears in all lowercase. if statement checks if no token was given.
    if(req.headers["x-authorization"] == null){
        res.status(401)
            .send();

    } else {


        let tokenWasRemoved = await user.removeToken(req.headers["x-authorization"]);

        try {
            //Makes sure that the db did actually update a row.


            if (tokenWasRemoved) {

                res.status(200)
                    .send("you have been logged out.");

            } else {

                res.status(401)
                    .send('invalid user session');

            }


        } catch (err) {
            res.status(500)
                .send(err);
        }
    }
};



exports.updateInfo = async function(req, res){

    console.log('requesting to replace user information');

    try{
        //lots of optional information to handle.
        //If user is replacing password.

        if(req.body["password"]){
            let newPassword = req.body["password"];
            //replace newPassword with hashedPassword.
            req.body["password"] = await bcrypt.hash(newPassword, saltRounds);
        }


        //send through req.body
        await user.replaceUserInfo(req.body["password"], req.body["email"], req.body["firstName"], req.body["lastName"], req.body["phoneNumber"],req.body["home"], req.headers["x-authorization"]);

        res.status(200)
            .send();//consider raising a 304 if no changes were done?.send("update done");


    }catch (error){
        res.status(500)
            .send(error);
    }
}



/**
 * Handles getting information of the flatemates that the user is currently living with.
 */
exports.viewFlatmates = async function(req, res){

    console.log("Request to retrieve flatmate's information");



    try{
        //need to check that the user is logged in first.
        const flatMatesList = await user.getFlatmatesInfo(req.headers["x-authorization"]);

        res.status(200)
            .json(flatMatesList);


    } catch(err){
        res.status(401)
            .send(err);
    }

}
exports.viewBills = async function(req, res) {

    let userid = req.params.userId;

    try {
        const  result = await user.getMyBills(userid);
        res.status( 200 )
            .send( result );
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting users ${ err }` );
    }
};
exports.read = async function(req, res){
    return null;
};
exports.update = async function(req, res){
    return null;
};
exports.delete = async function(req, res){
    return null;
};
