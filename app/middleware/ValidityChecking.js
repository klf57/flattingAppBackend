/**
 * Checks if provided data is valid before proceeding with tasks.
 *
 */


const {dbQuery} = require("../models/QueryHandler");
/**
 * Checks if the selected recipients for the bills are all currently living with the user.
 * chosen flatmates will only receive the bill, if they are currently living in the same Flat as the user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.isLivingWithUser = async function(req, res, next){

    let recipientsList = req.body["recipientsList"];


    if(!(recipientsList) || recipientsList.length < 1){
        res.status(400)
            .send("no recipient given");
    } else {

        try {

            //sends one query to check recipient's housing status
            //nested query used to retrieve the active user's houseid to compare in the conditional IF check.
            let query = 'SELECT IF( ' +
                '(SELECT s.home '+
                'FROM flatting.user AS s ' +
                'WHERE session_token = ? ) = a.home, True, False) ' +
                'AS isLivingWith ' +
                'from flatting.user AS a ' +
                'WHERE a.userid in (?);';

            let queryParams = [];

            queryParams.push(req.headers["x-authorization"]);

            //retrieves ids from list of json objects.
            let roommateIds = getRoommateIds(recipientsList);
            queryParams.push(roommateIds);


            let result =  await dbQuery(query, queryParams);


            //if the list returned is shorter than the idList sent to the query, then a given user id was not located.
            if(roommateIds.length != result[0].length ) {

                res.status(400)
                    .send("A flatmate's information was not found in db");

            }

            //checks if any user returned with False re 'if they are living with user'
            if(result[0].some(item => item.isLivingWith == 0)){

                res.status(400)
                    .send("one of the recipients doesnt currently live with you");
            } else {
                //otherwise continue to bill.controller addBills.
                next();
            }

        }catch(err){
            res.status(500)
                .send(err);
        }


    }

}

/**
 * Supporting function for creating bills. It extracts the roommates' id from provided recipientList
 * @param recipientList
 * @returns {*[]}
 */
getRoommateIds = function(recipientList){

    let idList = [];

    //adds each recipient's id.
    for(let i = 0; i < recipientList.length; i++){

        idList.push(parseInt(recipientList[i].roommate));

    }

    return idList;
}
