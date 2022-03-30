const { CustomError } = require("../utils/errors");


const errorHandler = (err, req, res, next) => {    
    console.log(err);
    if (err instanceof CustomError)
        return res.status(err.code).json({error: err.message});
    return res.status(500).json({error: 'Internal server error'});
}


const notFoundHandler = (req, res, next) => res.status(404).json({error: 'Not found'});


module.exports = { 
    errorHandler,
    notFoundHandler
}
