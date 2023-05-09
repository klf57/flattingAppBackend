
const bill = require('../controllers/bills.controller');
const auth = require('../middleware/Authentication')

module.exports = function (app){

    app.route('/bill/:userId')
        .get(auth.checkTokenAndIdMatch, bill.viewBills)
        .post(auth.checkTokenAndIdMatch, bill.addBills);
}