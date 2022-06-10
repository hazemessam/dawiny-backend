// Third party modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Application modules
const app = require('./app');


dotenv.config();

const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI;


async function runServer() {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to db ${mongoose.connection.db.databaseName}`);
        app.listen(PORT, '0.0.0.0', () => console.log(`Server is listening on port ${PORT}...`));
    } catch (error) {
        console.error(error);
        console.error('Can not connect to the db!');
    }
}


runServer();
