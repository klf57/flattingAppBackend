/**
 * File for queries that may be written differently depending on the data provided.
 *
 */

exports.writeBills =  function(recipients){

    //dynamic transaction sql to declare multiple queries.
    let query = 'START TRANSACTION ';
    let queryParams = [];

    query += 'INSERT INTO flatting.bills';

    

    return  [query, queryParams];
}