/**
 * Remember that controllers exist to get the requested information from the models and return it to the user in the browser.
 * Prompts the bill.model to retrieve information relating to the user's flat's bills.
 * It can also request for bills to be created or deleted.
 */

const bill = require('../models/bill.model');

exports.viewBills = async function(req, res){
    var userId = req.params.userId;

    try{
        const result = await bill.getHouseBills(userId);
        res.status(200)
            .send(result);

    }catch(error){
        res.status(500)
            .send(`error requesting ${error}`);
    }
}