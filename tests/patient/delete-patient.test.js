// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('DELETE /api/patients/:id', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 200 status code', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.delete(`/api/patients/${patientId}`);
        expect(res.status).toBe(200);
    });
    
    test('should return json response', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.delete(`/api/patients/${patientId}`);
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return patientId', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.delete(`/api/patients/${patientId}`);
        expect(res.body._id).toEqual(patientId);
    });
    
    test('should respond with 404 status code if the patient does not exist', async () => {
        const patientId = '6260fb7e39818e48bb725388';
        res = await request.delete(`/api/patients/${patientId}`);
        expect(res.status).toBe(404);
    });
});
