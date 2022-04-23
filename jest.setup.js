const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


const mongoServer = new MongoMemoryServer();

const setup = async () => {
    await mongoServer.start();
    await mongoose.connect(mongoServer.getUri());
}

const clear = async () => {
    const collections = mongoose.connection.collections;
    for (let key in collections) await collections[key].deleteMany();
}

const teardown = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}


beforeAll(setup);
afterEach(clear);
afterAll(teardown);
