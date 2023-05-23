/** Prompts the chores.model to retrieve data related to the chores in the user's house.**/

const reqChores = require('../models/chores.model');


/**
 * Option to view just the users or all chores currently in the household.
 * @returns {Promise<void>}
 */
exports.viewChores = async function(req, res){
    console.log('request to view chores');
    try{

        console.log(req.query['onlyUser']);
        //check if it is not defined or if the value is not true/false
        if(!(req.query['onlyUser']) || req.query['onlyUser'] !== ('true' && 'false')){
            res.status(401)
                .send('missing query');

        } else {



            let result = await reqChores.getChores(req.params['userId'],req.query['onlyUser']);

            res.status(200)
                .send(result[0]); //only sends back the list of json objects

        }


    }catch(error){
        res.status(500)
        res.send(error);
    }

};

/**
 * Stores new chores in db. Returns 201 if db successful in storing new chores. otherwise returns status code 500.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.makeChores = async function(req, res){
    console.log('request to add a chore');

    try{

        let recipientsList = req.body["recipientsList"];

        await reqChores.addChores(recipientsList);
        res.status(201)
            .send();

    }catch(error){

        res.status(500)
        res.send(error);

    }
}