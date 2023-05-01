/**
 * contains the shared code of all models to connect to database, sending its query.
 * valuesList must input data in the order that they appear in the query statement.
 */

const db = require('../../config/db');

exports.handleDbQuery = async function(query, valuesList){

    const conn = await db.getPool().getConnection();

    const result = await conn.query( query );

    if(! (valuesList.isEmpty() )){
        const [ result ] = await conn.query( query, valuesList);

    } else{
        const [ result ] = await conn.query( query);
    }
    conn.release();


    return result;
}