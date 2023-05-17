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
 * Gets either all the households bills to provide an overview or just the user's bills.
 * @param userId
 * @returns {Promise<*>}
 */
exports.getHouseBills = async function(userId, viewAll){

    console.log(`Request to get the house's bills from the database`);


    let query = '';



    // either uses a query to get all house's bills or retrieves just the user's bills.
    if(viewAll){
        query = 'select * from bills where `home` = (select home from user where userid = ?)';


    } else {
        query = 'select * from bills where `roommate` = ?';
    }

    const result = await dbQuery(query, userId);


    return result;


}

