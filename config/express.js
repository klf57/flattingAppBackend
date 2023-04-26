/**
 * Contains all the details for configuring express.
 * boilerplate code learnt from UC tutorial.
 *
 */

const express = require( 'express'),
    bodyParser = require( 'body-parser');



module.exports = function() {

    const app = express();
    app.use( bodyParser.json() );

    //to allow for  cross origin resource sharing. using an * in Origin field means it will accept all requests.

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Authorization, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    });

    //imports all the routes that will be used, passing the app object too.
    require('../app/routes/userinfo.routes')(app);




    return app;
};