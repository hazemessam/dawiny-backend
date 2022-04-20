const Doctor = require('../models/doctor');
const {asyncWrapper, CustomError} = require('../utils/errors');


const getAllDoctors = asyncWrapper(async (req, res) => {
    
});


const addDoctor = asyncWrapper(async (req, res) => {
    if (!req.body)
        throw new CustomError('Missing requird data', 400);
        
    const requiredFields = ['email', 'password', 'firstName', 'lastName'];
    for (field of requiredFields)
        if (!req.body[field])
            throw new CustomError('Missing requird data', 400);

    let doctor = await Doctor.findOne({email: req.body.email});
    if (doctor)
        throw new CustomError(`${req.body.email} is already exist`, 422);
    
    doctor = await Doctor.create(req.body);
    return res.status(201).json(doctor);
});


module.exports = {
    getAllDoctors,
    addDoctor
}
