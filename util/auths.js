let jwt = require("jsonwebtoken");

let checkJWT = (req, res, next) => {

    let headerValue = req.get("Authorization")
    let signedToken;

    if(headerValue){
        let parts = headerValue.split(" ");
        signedToken = parts[1];
    }

    if(!signedToken) {
        console.log("Missing signed token");
        res.sendStatus(403);
        return;
    }
    // if i get to this line, verify the secret

    try {
        
        let unsigned = jwt.verify(signedToken, process.env.JWT_SECRET)

        console.log(unsigned, 'this is the token decoded')

        req.userInfo = unsigned;

        console.log(req, 'this is the request')

    } catch(err) {
        console.log("Failed to verify token ", err)
        res.sendStatus(403)
        return;
    }

    // if we get here, its a valid token, so go to the next tesk in the chain

    next();

}

module.exports = checkJWT