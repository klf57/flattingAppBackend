/** Prompts the chores.model to retrieve data related to the chores in the user's house.**/

const reqChoreData = require('../models/chores.model');


/**
 * Option to view just the users or all chores currently in the household.
 * @returns {Promise<void>}
 */
exports.viewChores = async function(req, res){


    try{
        await reqChoreData.getChores(req['userId']);

    }catch(error){
        res.status(500)
        res.send();
    }

}

