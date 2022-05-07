const Nurse = require('../models/nurse');
const { asyncWrapper, CustomError } = require('../utils/errors');


const getAllNurses = asyncWrapper(async (req, res) => {
    const nurses = await Nurse.find();
    for (let nurse of nurses)
        nurse.password = undefined;
    return res.json(nurses);
});


const getNurseById = asyncWrapper(async (req, res) => {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) throw new CustomError('Not found', 404);
    nurse.password = undefined;
    return res.json(nurse);
});


const addNurse = asyncWrapper(async (req, res) => {
    let nurse = await Nurse.findOne({email: req.body.email});
    if (nurse) throw new CustomError(`${req.body.email} is already exist`, 422);
    nurse = await Nurse.create(req.body);
    return res.status(201).json(nurse);
});


const updateNurseById = asyncWrapper(async (req, res) => {
    let nurse = await Nurse.findById(req.params.id);
    if (!nurse) throw new CustomError('Not found', 404);
    if (await Nurse.findOne({email: req.body.email}))
        throw new CustomError(`${req.body.email} is already exist`, 422);
    const updateOptions =  { returnOriginal: false, runValidators: true };
    nurse = await Nurse.findByIdAndUpdate(req.params.id, req.body, updateOptions);
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
