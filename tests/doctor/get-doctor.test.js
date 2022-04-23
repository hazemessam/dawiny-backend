// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('GET /api/doctors', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 200 status code', async () => {
        const res = await request.get('/api/doctors');
        expect(res.status).toEqual(200);
    });
    
    test('should return json response', async () => {
        const res = await request.get('/api/doctors');
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return array', async () => {
        const res = await request.get('/api/doctors');
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return array contains a doctor', async () => {
        let res = await request.post('/api/doctors').send(data);
        const doctorId = res.body._id; 
        res = await request.get('/api/doctors');
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toEqual(doctorId);
    });
});


describe('GET /api/doctors/:id', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 200 status code', async () => {
        let res = await request.post('/api/doctors').send(data);
        const doctorId = res.body._id;
        res = await request.get(`/api/doctors/${doctorId}`);
        expect(res.status).toBe(200);
    });
    
    test('should return json response', async () => {
        let res = await request.post('/api/doctors').send(data);
        const doctorId = res.body._id;
        res = await request.get(`/api/doctors/${doctorId}`);
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return doctor with email field', async () => {
        let res = await request.post('/api/doctors').send(data);
        const doctorId = res.body._id;
        res = await request.get(`/api/doctors/${doctorId}`);
        expect(res.body).toHaveProperty('email');
    });
    
    test('should return doctor without passowrd field', async () => {
        let res = await request.post('/api/doctors').send(data);
        const doctorId = res.body._id;
        res = await request.get(`/api/doctors/${doctorId}`);
        expect(res.body).not.toHaveProperty('password');
    });
    
    test('should respond with 404 status code if the doctor does not exist', async () => {
        const doctorId = '6260fb7e39818e48bb725388';
        res = await request.get(`/api/doctors/${doctorId}`);
        expect(res.status).toBe(404);
    });
});
