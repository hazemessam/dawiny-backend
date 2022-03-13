const logger = (req, res, next) => {
    console.log(`${req.ip} - ${req.method} ${req.url}`);
    next();
}

module.exports = logger;
