
const bill = require('../controllers/bills.controller');


module.exports = function (app){

    app.route('/bill/:userId')
        .get(bill.viewBills);
}