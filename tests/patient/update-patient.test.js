// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('PATCH /api/patients', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    };

    const updatedData = { email: 'updated@dawiny.com' };

    test('should respond with 200 status code', async () => { 
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.patch(`/api/patients/${patientId}`).send(updatedData);
        expect(res.status).toBe(200);
    });

    test('should return json response', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.patch(`/api/patients/${patientId}`).send(updatedData);
        expect(res.headers['content-type']).toMatch('json');
    });

    test('should return updated patient', async () => {
        let res = await request.post('/api/patients').send(data);
        const patientId = res.body._id;
        res = await request.patch(`/api/patients/${patientId}`).send(updatedData);
        expect(res.body.email).toEqual(updatedData.email);
    });
    
    test('should respond with 404 status code if the patient does not exist', async () => {
        const patientId = '6260fb7e39818e48bb725388';
        res = await request.patch(`/api/patients/${patientId}`).send(data);
        expect(res.status).toBe(404);
    });

    test('should respond with 422 status code when updating to existing email', async () => {
        await request.post('/api/patients').send(data);
        let res = await request.post('/api/patients').send({ ...data, email: 'updated@dawiny.com' });
        const patientId = res.body._id;
        res = await request.patch(`/api/patients/${patientId}`).send({ email: data.email });
        expect(res.status).toBe(422);
    });
});
