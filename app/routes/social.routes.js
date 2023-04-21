/**
 * Handles all routes related to flatmates communicating with each other.
 * todo:get flatmate information
 * todo: move from params to sending the values inside the json itself.
 *
 * todo: get list of house chores
 * todo: The grocery list.
 *
 */

const social = require('../controllers/social.controller');
//it will need the functions from the controller section.


module.exports = function (app) {

    app.route('/social/flatmates/:userId')
        .get(social.view_flatmate_info);
    
}