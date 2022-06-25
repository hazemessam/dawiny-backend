// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const { Nurse } = require('../models/nurse');
const { CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken } = require('../services/auth/token');


async function getAllNurses(req, res, next) {
    const nurses = await Nurse.find();
    return res.json(nurses.map(n => { n.password = undefined; return n; }));
}


async function getNurseById(req, res, next) {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) return next(new CustomError('Not found', 404));

    nurse.password = undefined;
    return res.json(nurse);
}


async function addNurse(req, res, next) {
    const email = req.body.email;
    if (!email) return next(new CustomError(`Email must be exist`, 400));
    let nurse = await Nurse.findOne({ email });
    if (nurse) return next(new CustomError(`${req.body.email} is already exist`, 422));

    const password = req.body.password;
    if (!password) return next(new CustomError(`Password must be exist`, 400));
    req.body.password = await bcrypt.hash(password, 10);

    nurse = await Nurse.create(req.body);
    const payload = { userId: nurse._id, role: 'nurse' };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);
    return res.status(201).json({ access, refresh });
}


async function updateNurseById(req, res, next) {
    let nurse = await Nurse.findById(req.params.id);
    if (!nurse) return next(new CustomError('Not found', 404));

    const email = req.body.email;
    if (email && await Nurse.findOne({ email }))
        return next(new CustomError(`${email} is already exist`, 422));

    const password = req.body.password;
    if (password) req.body.password = await bcrypt.hash(password, 10);

    const updateOptions = { returnOriginal: false, runValidators: true };
    nurse = await Nurse.findByIdAndUpdate(req.params.id, req.body, updateOptions);

    nurse.password = undefined;
    return res.json(nurse);
}


async function deleteNurseById(req, res, next) {
    const nurse = await Nurse.findByIdAndDelete(req.params.id);
    if (!nurse) return next(new CustomError('Not found', 404));

    res.json({ _id: nurse._id });
}


module.exports = {
    getAllNurses,
    getNurseById,
    addNurse,
    updateNurseById,
    deleteNurseById
}
