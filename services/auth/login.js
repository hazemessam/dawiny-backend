// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const Patient = require('../../models/patient');
const Doctor = require('../../models/doctor');
const Nurse = require('../../models/nurse');
const { asyncWrapper, CustomError } = require('../../utils/errors');
const { genAccessToken, genRefreshToken } = require('./token');


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


module.exports = {
    login
}
