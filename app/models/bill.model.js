/**
 * Todo implement the sql to get the bills of all housemates.
 * @type {{connect?: function(): Promise<void>, getPool?: function(): null}}
 */
const db = require('../../config/db');


exports.getHouseBills = async function(userId){

    console.log(`Request to get all bills from the database`);

    const conn = await db.getPool().getConnection();

    // USES JOIN TO MAKE ONE QUERY.
    const query = 'select * from personal_bill where houseid = (select home from user where userid = ?)';

    //houseId value will replace the questionmark from the query above.
    const [result] = await conn.query(query,[userId]);
    conn.release;
    return result;


}