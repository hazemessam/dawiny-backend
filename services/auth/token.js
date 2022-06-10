const jwt = require('jsonwebtoken');


function genAccessToken(payload, exp = '1h') {
    const options = { expiresIn: exp };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, options);
    return access;
}


function genRefreshToken(payload) {
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET);
    /*
    TODO: Create redis server
    TODO: Save the refresh token to the white list in the redis server
    {
        role: {
            id: [refreshTokens...]
        }
    }
    */
    return refresh;
}


module.exports = {
    genAccessToken,
    genRefreshToken
}
