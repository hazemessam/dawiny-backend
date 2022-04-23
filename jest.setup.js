const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config()


beforeAll(async () => await mongoose.connect(process.env.TEST_DB_URI));

afterEach(async () => {
    await mongoose.connection.db.collection('doctors').deleteMany();
});

afterAll(async () => await mongoose.disconnect());
