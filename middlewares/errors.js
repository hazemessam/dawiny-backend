const mongoose = require("mongoose");
const { CustomError } = require("../utils/errors");


function errorHandler(err, req, res, next) {
    if (process.env.NODE_ENV != 'test')
        console.log(err);

    if (err instanceof CustomError)
        return res.status(err.code).json({ msg: err.message });
    if (err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError)
        return res.status(400).json({ msg: err.message, type: err.name });
    return res.status(500).json({ msg: err.message, type: err.name });
}


module.exports = { errorHandler }
