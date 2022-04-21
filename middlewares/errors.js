const { CustomError } = require("../utils/errors");


const errorHandler = (err, req, res, next) => {    
    if (process.env.NODE_ENV != 'test')
        console.log(err);
    if (err instanceof CustomError)
        return res.status(err.code).json({msg: err.message});
    return res.status(500).json({msg: 'Internal server error', err});
}


const notFoundHandler = (req, res, next) => res.status(404).json({error: 'Not found'});


module.exports = { 
    errorHandler,
    notFoundHandler
}
