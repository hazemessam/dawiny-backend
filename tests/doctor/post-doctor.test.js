// Third party modules
const supertest = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Application modules
const app = require('../../app');


dotenv.config()
const request = supertest(app);

describe('POST /api/doctors', () => {
    beforeEach(async () => await mongoose.connect(process.env.TEST_DB_URI));
    afterEach(async () => {
        await mongoose.connection.db.collection('doctors').deleteMany();
        await mongoose.disconnect();
    });

    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    it('should respond with 201 status code', async () => {
        const res = await request.post('/api/doctors').send(data);
        expect(res.status).toBe(201);
    });
    
    it('should return json response', async () => {
        const res = await request.post('/api/doctors').send(data);
        expect(res.headers['content-type']).toMatch(/json/);
    });
    
    it('should return doctor id', async () => {
        const res = await request.post('/api/doctors').send(data);
        expect(res.body._id).toBeDefined();
    });

    it('should respond with 400 status code when sending incompleted data', async () => {
        const incompletedData = [
            {...data, email: undefined},
            {...data, password: undefined},
            {...data, firstName: undefined},
            {...data, lastName: undefined},
        ]
        for (let record of incompletedData) {
            const res = await request.post('/api/doctors').send(record);
            expect(res.status).toBe(400);
        }
    });
    
    it('should respond with 422 status code when email is already exist', async () => {
        await request.post('/api/doctors').send(data);
        const res = await request.post('/api/doctors').send(data);
        expect(res.status).toBe(422);
    });
});
