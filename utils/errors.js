class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}


const asyncWrapper = controller => async (req, res, next) => {
    try {
        await controller(req, res);
    } catch (err) {
        next(err);
    }
}


module.exports = {
    CustomError,
    asyncWrapper
}
