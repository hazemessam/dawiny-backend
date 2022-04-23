// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('POST /api/doctors', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 201 status code', async () => {
        const res = await request.post('/api/doctors').send(data);
        expect(res.status).toBe(201);
    });
    
    test('should return json response', async () => {
        const res = await request.post('/api/doctors').send(data);
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return doctor id', async () => {
        const res = await request.post('/api/doctors').send(data);
        expect(res.body._id).toBeDefined();
    });

    test('should respond with 400 status code when sending incompleted data', async () => {
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
    
    test('should respond with 422 status code when email is already exist', async () => {
        await request.post('/api/doctors').send(data);
        const res = await request.post('/api/doctors').send(data);
        expect(res.status).toBe(422);
    });
});
