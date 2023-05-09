/**
 * Remember that controllers exist to get the requested information from the models and return it to the user in the browser.
 * Prompts the bill.model to retrieve information relating to the user's flat's bills.
 * It can also request for bills to be created or deleted.
 */

const bill = require('../models/bill.model');


/**
 * Handles recording the new bills and assigning them to the chosen flatemates so they will be notified.
 * @param req
 * @param res 400 status code if invalid res.body data.
 * @returns {Promise<void>}
 */
exports.addBills = async function(req, res){
    try{

        let recipientsList = req.body["recipients"];

        if(!(recipientsList)){
            res.status(400)
                .send();
        }

        //send the Recipients list through!




    }catch(err){
        res.status(500)
            .send(err);
    }

}

exports.viewBills = async function(req, res){
    let userId = req.params.userId;

    try{
        const result = await bill.getHouseBills(userId);
        res.status(200)
            .send(result);

    }catch(error){
        res.status(500)
            .send(`error requesting ${error}`);
    }
}