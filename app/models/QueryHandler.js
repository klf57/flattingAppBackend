/**
 * contains the shared code of all models to connect to database, sending its query.
 * valuesList must input data in the order that they appear in the query statement.
 */

const db = require('../../config/db');

exports.dbQuery = async function(query, valuesList){

    const conn = await db.getPool().getConnection();


    let result;
    //Different structure depending on if the query needs values.
    if( valuesList.length >= 1 ){

        result  = await conn.query( query, valuesList);

    } else{
        result  = await conn.query(query);
    }
    conn.release();


    return result;
}