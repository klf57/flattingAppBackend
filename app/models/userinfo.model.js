/**
 * Imports the db config file and has these functions
 *in the model, queries for db go here.
 * for token generating: https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/
 */

const db = require('../../config/db');
const {dbQuery} = require("./QueryHandler");


/**
 * Inputs the new user into the db.
 * @param username
 * @returns {Promise<*>}
 */
exports.createNewUser = async function (firstName, lastName, email, hashedPassword){
    //adds a new user to the table.
    console.log(`Request to create a new account into the database`);

    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO user (first_name, last_name, password, email) VALUES(?,?,?,?)';
    const [ result ] = await conn.query( query, [ firstName, lastName, hashedPassword, email] ); //here the query fills in the missing values
    conn.release();

    return result;
};


/**
 * Retrieves the hashedPassword using the inputted Email.
 * @param email
 * @returns {Promise<void>}
 */
exports.getHashedPassword =  async function (email) {


    const query = 'SELECT `password`, `userid` FROM user WHERE `email` = ?';
    const  result  = await dbQuery( query, [email]);


    //the needed information is nested so in order to retrieve, use these indexes.
    return result[0][0];

};

/**
 * User has given the correct credentials and  session token is now being created upon them logging in.
 * @param userId
 * @returns {Promise<void>}
 */
exports.loginUser = async function(userId, sessionToken) {

    const query = 'UPDATE  `user` SET `session_token` = ? WHERE `userid` = ?';
    await dbQuery( query, [sessionToken, userId]);


    //does not need a result from db.
    return;
};


/**
 * Removes the current sessionToken from the user's db.
 * @param userId
 * @param sessionToken
 * @returns {Promise<boolean>}
 */
exports.removeToken = async function(sessionToken){

    const query = 'UPDATE `user` SET `session_token` = NULL WHERE `session_token` = ?';


    let result = await dbQuery(query, [sessionToken])


    //note that the affected row should only ever be 1 or 0.
    return result.at(0)["affectedRows"] >= 1;
}


/**
 * Retrieves the user id that matches the provided token
 * @param sessionToken
 * @returns {Promise<*>}
 */
exports.getUserByIdToken = async function(sessionToken){


    const query = 'SELECT `userid` FROM `user` WHERE `session_token` = ? ';
    const result = await dbQuery(query, [sessionToken]);

    //Checks if query returned a userId or not.
    if(result[0].length < 1 ){
        return null;
    } else {
        return result[0][0]["userid"];

    }


};

/** Needs to tailor the sql depending on the data the user has given. **/
exports.changeUserInfo = async function(newInfo){


    console.log("not implemented path yet");


};


exports.getFlatmatesInfo = async function(sessionToken){

    const query = 'SELECT `first_name`, `last_name`, `phone_number` FROM `user` ' +
        'INNER JOIN `houses` ON `user.home` = `houses.id`' +
        'WHERE `user.home` = (SELECT `user.home` FROM `user` AS `u1` WHERE `u1.session_token = ?)';

    const result = await dbQuery(query, [sessionToken]);

    return result;

}


exports.alter = async function(){
    return null;
};
exports.remove = async function(){
    return null;
};


//RE BILLS
exports.getMyBills = async function(userId) {

    console.log( 'Request to get all of users bills...' );
    const conn = await db.getPool().getConnection();
    const query = 'select * from personal_bill where user_id=?';
    const [ rows ] = await conn.query( query, [userId]);
    conn.release();
    return rows;
}