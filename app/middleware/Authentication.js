/**
 * Retrieves the userID after first checking if the provided token is  in db.
 * status codes : 501 = server error 401 = unauthorized.
 */
const user = require('../models/userinfo');
exports.checkUserLoggedIn= async function(req, res, next){





    try{

        const sessionToken = req.headers["x-authorization"]
        //if there is no x-Authorization in header.
        if(!(sessionToken)){
            res.status(401)
                .send("No token provided ");

        } else {

            const userId = await user.getUserByIdToken(sessionToken);


            if(userId) {
                //add the userId to the req and move to next function in user/flatmates route.
                //user id may be used when retrieving user's information for MENU screen
                req.body["userId"] = userId;
                next();

            } else {
                res.status(401)
                    .send("no user found with that token");
            }

        }

    } catch(err){
        res.status(501)
            .send();
    }

}