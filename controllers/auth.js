// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const { Patient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
const { Nurse } = require('../models/nurse');
const { asyncWrapper, CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken, verifyToken } = require('../services/auth/token');


const login = asyncWrapper(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password)
        throw new CustomError('Email and password are required', 400);

    const role = req.body.role;
    if (!role) throw new CustomError('Role is required', 400);

    let user;

    switch (role) {
        case 'patient':
            user = await Patient.findOne({ email });
            break;

        case 'doctor':
            user = await Doctor.findOne({ email });
            break;

        case 'nurse':
            user = await Nurse.findOne({ email });
            break;

        default:
            throw new CustomError('Invalid role', 400);
    }

    if (!user)
        throw new CustomError(`No ${role} with this email ${email}`, 404);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new CustomError('Invalid credentials', 401);

    const payload = { userId: user._id, role };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);

    return res.json({ access, refresh });
});


/*
TODO: Create redis server
TODO: Save the refresh token to the white list in the redis server
{
    role: {
        id: [refreshTokens...]
    }
}
*/
function reGenAccessToken(req, res, next) {
    const refresh = req.body.refresh;
    if (!refresh)
        return next(new CustomError('Missing refresh token', 400));

    let payload = verifyToken(refresh, process.env.REFRESH_SECRET);
    payload = { userId: payload.userId, role: payload.role };
    const access = genAccessToken(payload);

    return res.json({ access });
}


module.exports = {
    login,
    reGenAccessToken
}
