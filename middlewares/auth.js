// Third party modules
const jwt = require('jsonwebtoken');

// Application modules
const { CustomError } = require("../utils/errors");
const { permissions } = require('../permissions');


function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return next(new CustomError('Missing access token', 401));

    let payload;
    try {
        payload = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError)
            return next(new CustomError('Expired access token', 401));    
        return next(new CustomError('Invalid access token', 401));
    }

    req.user = { id: payload.userId, role: payload.role };
    return next();
}


function authorize(action) {
    return (req, res, next) => {
        const permission = (req.user.id == req.params.id)? `${action}:self` : action;
        if (!hasPermission(req.user.role, permission))
            return next(new CustomError('Access denied!', 403));

        return next();
    }
}


function hasPermission(role, permission) {
    return permissions[role].includes(permission);
}


module.exports = {
    authenticate,
    authorize
}
