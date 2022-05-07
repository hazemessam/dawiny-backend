// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('PATCH /api/nurses', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    };

    const updatedData = { email: 'updated@dawiny.com' };

    test('should respond with 200 status code', async () => { 
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.patch(`/api/nurses/${nurseId}`).send(updatedData);
        expect(res.status).toBe(200);
    });

    test('should return json response', async () => {
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.patch(`/api/nurses/${nurseId}`).send(updatedData);
        expect(res.headers['content-type']).toMatch('json');
    });

    test('should return updated nurse', async () => {
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.patch(`/api/nurses/${nurseId}`).send(updatedData);
        expect(res.body.email).toEqual(updatedData.email);
    });
    
    test('should respond with 404 status code if the nurse does not exist', async () => {
        const nurseId = '6260fb7e39818e48bb725388';
        res = await request.patch(`/api/nurses/${nurseId}`).send(data);
        expect(res.status).toBe(404);
    });

    test('should respond with 422 status code when updating to existing email', async () => {
        await request.post('/api/nurses').send(data);
        let res = await request.post('/api/nurses').send({ ...data, email: 'updated@dawiny.com' });
        const nurseId = res.body._id;
        res = await request.patch(`/api/nurses/${nurseId}`).send({ email: data.email });
        expect(res.status).toBe(422);
    });
    
    test('should respond with 400 status code when updating to invaled rate', async () => {
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.patch(`/api/nurses/${nurseId}`).send({ rate: 10 });
        expect(res.status).toBe(400);
    });
});
