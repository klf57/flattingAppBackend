
/**
 * Gets the model social.model to get all information of the flatmates from the
 * todo: Should confirm user's token to make sure they are allowed to access flatmate information.
 */

const social_model = require('../models/social.model.js');


/**
 *
 * @param req has the houseID
 * @param res Should return only the users who have the same HouseId as the user.
 * @returns {Promise<void>}
 */
exports.view_flatmate_info =  async function(req, res){

    //note that it is params, not param.
    var userId = req.params.userId;


    try{
        const  result = await social_model.getFlatmates(userId);
        res.status( 200 )
            .send( result );

    }catch(err){
        res.status( 500 )
            .send( `ERROR getting users ${ err }` );
    }
}