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


//Waits for and returns the result from the function model, handling any errors that arise.
exports.list = async function(req, res){
    console.log( '\nRequest to list users...' );
    try {
        const result = await user.getAll();
        res.status( 200 )
            .send( result );
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting users ${ err }` );
    }
};


/**
 * Handles creating a new user.
 * @param req User must provide email, name, and a password.
 * @param res a 201 status if successfully made otherswise 500 with the reason for the error.
 * @returns {Promise<void>}
 */
exports.create = async function(req, res){
    console.log('\nRequest to create a new user..');

    const firstName = req.body[`firstName`];
    const lastName = req.body[`lastName`];
    const email = req.body[`email`];
    const password = req.body['password'];

    //hash and salt the password being sent to database.
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    try {

        await user.createNewUser(firstName, lastName, email, hashedPassword);
        res.status(201)
            .send("USER CREATED"); //{user_id: result.insertId}

        //the user_id returned to the client to use in further requests
    } catch ( err ) {
        res.status(500)
            .send(`ERROR creating account: ${err}`);

    }
}




exports.login = async function(req, res) {

    console.log('request to login');

    //when is token generated? could be in the model
    //user logs in with their email.
    let password = req.body['password'];
    let email = req.body['email'];

    try{


        const userDetails = await user.getHashedPassword(email);

        //compare the passwords
        if(bcrypt.compare(password, userDetails['password'])){


            const sessionToken = jwt.sign(userDetails['iduser'], Process.env.TOKENSIGN );

            await user.loginUser(userDetails['iduser'],sessionToken);


            //just do await user.startNewSession();
            //Have token generated here.
            // use .json([iduser, token]
            res.status(200)
                .json(sessionToken);

        } else {
            res.statusMessage = "password or email does not match";
            res.status(401)
                .send();
        }


    } catch (err){
        res.status(500)
            .send(`error logging in ${err}`);
    }


}

/**
 * Handles model calls to updates user's status to be logged out.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.logout = async function(req, res){

    console.log('request to logout');

    let sessionToken = req.headers['X-Authorization'];
    let tokenWasRemoved = await user.removeToken(sessionToken);

    try{
        //Makes sure that the db did actually update a row.
        if(tokenWasRemoved){

            res.status(200)
                .send();

        } else{
            console.log('the provided token was not found in db');
            res.status(401)
                .send();

        }


    } catch(err){
        res.status(500)
            .send(${err});
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
