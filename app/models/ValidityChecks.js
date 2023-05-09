/**
 * @param requestToken the token found in request header.
 * @returns true if requestToken is found in database
 * @returns false if requestToken not found or is undefined.
 */
const {dbQuery} = require("./QueryHandler");
exports.tokenInDatabase = async function(sessionToken) {


    if ( !(sessionToken)) {

        return false;
    }
    else {

        const query = 'SELECT * FROM user where session_token = ?';
        const  matchFound  = await dbQuery(query, [sessionToken]);

        //had matchFound.length >= 1;
        console.log(`token in Database : ${matchFound != null}`);


        return matchFound != null;
    }
};


/**
 * @param email request's email
 * @return true  if email exists
 * @return false if email not found
 */
exports.emailInDatabase = async function(email) {

    if (email === null ) {

        return false;

    } else
    {
        const query = 'SELECT * FROM user WHERE email = ?';

        const [ matchFound ] = await dbQuery(query,[email] );

        console.log(`email in database: ${matchFound != null }`);

        return matchFound != null;
    }


};