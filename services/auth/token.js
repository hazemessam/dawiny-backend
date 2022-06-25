// Third party modules
const jwt = require('jsonwebtoken');

// Application modules
const { CustomError } = require('../../utils/errors');


function genAccessToken(payload, exp = '1h') {
    const options = { expiresIn: exp };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, options);
    return access;
}


function genRefreshToken(payload) {
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET);
    return refresh;
}


function verifyToken(token, key) {
    let payload;
    try {
        payload = jwt.verify(token, key);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError)
            throw new CustomError('Expired token', 401);
        throw new CustomError('Invalid token', 401);
    }

    return payload;
}


module.exports = {
    genAccessToken,
    genRefreshToken,
    verifyToken
}
