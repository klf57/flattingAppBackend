const mysql = require('mysql2/promise');
require('dotenv').config();

let state = {
    pool: null
};

exports.connect = async function () {

    state.pool = await mysql.createPool({

        host:process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,

    });
    await state.pool.getConnection(); //this checks connection
    console.log('Successfully connected to the database');

};

/** from a youtube tutorial
module.exports = mysql.createConnection({

    host:process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});
**/
exports.getPool = function(){
    return state.pool;
};