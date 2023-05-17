/**
 * File for queries that may be written differently depending on the data provided.
 *the validity of each recipient has already been checked by this stage.
 * recipients is a list of json objects.
 *
 * original_amount = the total bill cost prior to it being split among the recipients
 * amount_due = the amount the user has left to pay.
 */

exports.writeBills =  function(recipients, dateAdded){

    console.log('creating query to add bills');
    //dynamic transaction sql to declare multiple queries.
    let query = 'INSERT INTO `bills`(roommate, home, original_amount, amount_due, bill_type, date_added, due_date) ' +
        'VALUES ';
    let queryParams = [];


    //Begin to add the recipients to the query.
    for(let i = 0; i < recipients.length ; i++){

        //If this is the last recipient, no ',' is needed in string. Otherwise sql throws an error.
        if(i == recipients.length-1){

            query += '(?,?,?,?,?,?,?)';
        }else {
            query += '(?,?,?,?,?,?,?), ';

        }


        //add to the queryParams the values for the current recipient being written
        queryParams.push(recipients[i]["roommate"]);
        queryParams.push( recipients[i]["home"]);
        queryParams.push(recipients[i]["original_amount"]);
        queryParams.push(recipients[i]["amount_due"]);
        queryParams.push(recipients[i]["bill_type"]);
        queryParams.push(dateAdded);
        queryParams.push(recipients[i]["due_date"]);



    }
    query += ';';

    return  [query, queryParams];
}
