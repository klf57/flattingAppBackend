/**
 * Sends queries to the database and returns the results from the dbs reaction.
 */

const {dbQuery} = require('./QueryHandler');
const moment = require("moment");
const dynamicQuery = require("./DynamicQuery");


/**
 * Requests the list of chores. It can request to filter for only user's chores or view all chores for housemates
 * @param userId
 * @param onlyUser
 * @returns {Promise<*>}
 */
exports.getChores = async function(userToken, onlyUser){

    let query = '';
    console.log('getting chores from db');

    //Checks if the user only requested to see their own chores.
    if(onlyUser){
        query = 'SELECT * FROM `chores` WHERE `assigned_to` = ?';


    } else {
        query = 'SELECT * FROM `chores` INNER JOIN `user` ON user.userid = chores.assigned_to ' +
        'WHERE user.home = (SELECT u.home FROM user AS u WHERE userid = ?)';


    }

    let result = await dbQuery(query, userToken);

    return result;
}


/**
 * Prepares query  and sends to db, instructing it to add new chores.
 * @param recipientsList
 * @returns {Promise<void>}
 */
exports.addChores = async function(recipientsList){
    //current date is retrieved and saved in database so users know when the bill was added.
    let date = moment();
    let currentDate = date.format('YYYY-MM-D');


    //records to the db but first writes the query.
    let queryTemp = dynamicQuery.writeChores(recipientsList, currentDate);

    let result = await dbQuery(queryTemp[0], queryTemp[1]);

    return;
}
