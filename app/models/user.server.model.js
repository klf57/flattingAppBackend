/**
 * Imports the db config file and has these functions
 *in the model, queries for db go here.
 */

const db = require('../../config/db');
exports.getAll = async function(){
    console.log( 'Request to get all users from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select * from lab2_users';
    const [ rows ] = await conn.query( query );
    conn.release();
    return rows;
};
exports.getOne = async function(){
    return null;
};


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