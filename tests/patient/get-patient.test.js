// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('GET /api/patients', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 200 status code', async () => {
        const res = await request.get('/api/patients');
        expect(res.status).toEqual(200);
    });
    
    test('should return json response', async () => {
        const res = await request.get('/api/patients');
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return array', async () => {
        const res = await request.get('/api/patients');
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return array contains a patient', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id; 
        res = await request.get('/api/patients');
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toEqual(patientId);
    });
});


describe('GET /api/patients/:id', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 200 status code', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.get(`/api/patients/${patientId}`);
        expect(res.status).toBe(200);
    });
    
    test('should return json response', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.get(`/api/patients/${patientId}`);
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return patient with email field', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.get(`/api/patients/${patientId}`);
        expect(res.body).toHaveProperty('email');
    });
    
    test('should return patient without passowrd field', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.get(`/api/patients/${patientId}`);
        expect(res.body).not.toHaveProperty('password');
    });
    
    test('should respond with 404 status code if the patient does not exist', async () => {
        const patientId = '6260fb7e39818e48bb725388';
        res = await request.get(`/api/patients/${patientId}`);
        expect(res.status).toBe(404);
    });
});
