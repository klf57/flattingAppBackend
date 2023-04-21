/**imports db and express code
 * type node app.js to make connection with db.
 * **/

const db = require('./config/db'),
    express = require('./config/express');

const app = express();

//Connect to MYSQL on start
async function main() {
    try {
        await db.connect();
        app.listen(process.env.PORT, function() { //make sure the port var matches the .env
            console.log('Listening on port: ' + process.env.PORT);
        });
    } catch (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    }
}
main().catch(err => console.log(err));
