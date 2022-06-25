// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const { Nurse } = require('../models/nurse');
const { asyncWrapper, CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken } = require('../services/auth/token');


const getAllNurses = asyncWrapper(async (req, res) => {
    const nurses = await Nurse.find();
    return res.json(nurses.map(n => { n.password = undefined; return n }));
});


const getNurseById = asyncWrapper(async (req, res) => {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) throw new CustomError('Not found', 404);

    nurse.password = undefined;
    return res.json(nurse);
});


const addNurse = asyncWrapper(async (req, res) => {
    const email = req.body.email;
    if (!email) throw new CustomError(`Email must be exist`, 400);
    let nurse = await Nurse.findOne({ email });
    if (nurse) throw new CustomError(`${req.body.email} is already exist`, 422);

    const password = req.body.password;
    if (!password) throw new CustomError(`Password must be exist`, 400);
    req.body.password = await bcrypt.hash(password, 10);

    nurse = await Nurse.create(req.body);
    const payload = { userId: nurse._id, role: 'nurse' };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);
    return res.status(201).json({ access, refresh });
});


const updateNurseById = asyncWrapper(async (req, res) => {
    let nurse = await Nurse.findById(req.params.id);
    if (!nurse) throw new CustomError('Not found', 404);

    const email = req.body.email;
    if (email && await Nurse.findOne({ email }))
        throw new CustomError(`${email} is already exist`, 422);

    const password = req.body.password;
    if (password) req.body.password = await bcrypt.hash(password, 10);

    const updateOptions =  { returnOriginal: false, runValidators: true };
    nurse = await Nurse.findByIdAndUpdate(req.params.id, req.body, updateOptions);

    nurse.password = undefined;
    return res.json(nurse);
});


const deleteNurseById = asyncWrapper(async (req, res) => {
    const nurse = await Nurse.findByIdAndDelete(req.params.id);
    if (!nurse) throw new CustomError('Not found', 404);

    res.json({_id: nurse._id});
});


module.exports = {
    getAllNurses,
    getNurseById,
    addNurse,
    updateNurseById,
    deleteNurseById
}
