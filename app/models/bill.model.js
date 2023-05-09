/**
 * Todo implement the sql to get the bills of all housemates.
 * @type {{connect?: function(): Promise<void>, getPool?: function(): null}}
 */
const db = require('../../config/db');
const moment = require('moment');


/**
 * Inserts the new bill, assigning them to the selected flatmates.
 * @returns {Promise<void>}
 */
exports.recordBill = async function(){


    //dynamic transaction sql to declare multiple queries.
    let query = 'START TRANSACTION ';
    query += 'INSERT INTO flatting.bills';

    console.log("not implemented bills yet");

    //billId, roommate, home, original_amount, amount_due, bill_type
    //date added is done by the code it will record the current date.
    let date = moment();
    let currentDate = date.format('D/MM/YYYY');
    console.log(currentDate);

    res.status(500)
        .send("went to recordBill");

};

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
