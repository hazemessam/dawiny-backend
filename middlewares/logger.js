const logger = (req, res, next) => {
    if (process.env.NODE_ENV == 'test')
        return next();

    const options = {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }
    const dateTimeFormater = Intl.DateTimeFormat('en-EG', options);
    let [date, time] = dateTimeFormater.format(new Date()).split(', ');
    const [month, day, year] = date.split('/');
    date = `${year}-${month}-${day}`;
    console.log(`[${date} ${time}] | ${req.ip} | ${req.method} ${req.url}`);
    next();
}


module.exports = { logger }
