// Application modules
const { CustomError } = require("../utils/errors");
const { permissions } = require('../permissions');
const { verifyToken } = require('../services/auth/token');


function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return next(new CustomError('Missing access token', 401));

    const payload = verifyToken(token, process.env.ACCESS_SECRET);
    req.user = { id: payload.userId, role: payload.role };

    return next();
}


function authorize(action) {
    return (req, res, next) => {
        if (!action) return next(new CustomError('Missing action', 500));

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
