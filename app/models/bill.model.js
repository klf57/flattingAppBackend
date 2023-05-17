/**
 * Todo implement the sql to get the bills of all housemates.
 * @type {{connect?: function(): Promise<void>, getPool?: function(): null}}
 */
const db = require('../../config/db');
const {dbQuery} = require("./QueryHandler");
const moment = require('moment');
const dynamicQuery = require('../models/DynamicQuery');

/**
 * Inserts the new bill, assigning them to the selected flatmates.
 * @returns {Promise<void>}
 */
exports.recordBill = async function(recipientsList){


    //current date is retrieved and saved in database so users know when the bill was added.
    let date = moment();
    let currentDate = date.format('YYYY-MM-D');


    //records to the db but first writes the query.
    let queryTemp = dynamicQuery.writeBills(recipientsList, currentDate);

    let result = await dbQuery(queryTemp[0], queryTemp[1]);

    return;

};

/**
 * Gets all the bills for the household.
 * @param userId
 * @returns {Promise<*>}
 */
exports.getHouseBills = async function(userId){

    console.log(`Request to get the house's bills from the database`);

    const conn = await db.getPool().getConnection();

    // USES JOIN TO MAKE ONE QUERY.
    const query = 'select * from personal_bill where houseid = (select home from user where userid = ?)';

    //houseId value will replace the questionmark from the query above.
    const [result] = await conn.query(query,[userId]);
    conn.release;
    return result;


}

