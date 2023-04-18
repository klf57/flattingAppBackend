/**
 * Functions re establishing db connection and sending requests to  the db.
 *
 *todo: update the sql auery for 'get Flatmates', should not need to get the houseId. Should be able to just use the userId and retrieve the hosueId via that.
 *
 */

const db = require('../../config/db');
//RE getting flatmate information

/**
 * Asks the db to send info re the people the user is living with.
 * @param userId the id of the house user is living in.
 * @returns {Promise<*>}
 */
exports.getFlatmates = async function(userId){

    console.log(`Request to get user's flatemates into the database`);

    const conn = await db.getPool().getConnection();

    // USES JOIN TO MAKE ONE QUERY.
    const query = 'select * from user where home = (select home from user where userid=?);';

    //houseId value will replace the questionmark from the query above.
    const [result] = await conn.query(query,[userId]);
    conn.release;
    return result;

}
