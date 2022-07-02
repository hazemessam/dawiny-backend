// Third party modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

// Application modules
const app = require('./app');


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
