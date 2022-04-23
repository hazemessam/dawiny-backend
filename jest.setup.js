const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


const mongoServer = new MongoMemoryServer();

const connect = async () => {
    await mongoServer.start();
    await mongoose.connect(mongoServer.getUri());
}

const clear = async () => {
    const collections = mongoose.connection.collections;
    for (let key in collections) await collections[key].deleteMany();
}

const close = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}


beforeAll(connect);
afterEach(clear);
afterAll(close);
