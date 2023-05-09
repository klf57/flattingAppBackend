
const bill = require('../controllers/bills.controller');
const auth = require('../middleware/Authentication')
const validity = require('../middleware/ValidityChecking')

module.exports = function (app){

    app.route('/bill/:userId')
        .get(auth.checkTokenAndIdMatch, bill.viewBills)
        .post(auth.checkTokenAndIdMatch, validity.isLivingWithUser, bill.addBills);
}