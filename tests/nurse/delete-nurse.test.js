// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

describe('DELETE /api/nurses/:id', () => {
    const data = {
        email: 'test@dawiny.com',
        password: '1234',
        firstName: 'Hazem',
        lastName: 'Essam'
    }

    test('should respond with 200 status code', async () => {
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.delete(`/api/nurses/${nurseId}`);
        expect(res.status).toBe(200);
    });
    
    test('should return json response', async () => {
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.delete(`/api/nurses/${nurseId}`);
        expect(res.headers['content-type']).toMatch('json');
    });
    
    test('should return nurseId', async () => {
        let res = await request.post('/api/nurses').send(data);
        const nurseId = res.body._id;
        res = await request.delete(`/api/nurses/${nurseId}`);
        expect(res.body._id).toEqual(nurseId);
    });
    
    test('should respond with 404 status code if the nurse does not exist', async () => {
        const nurseId = '6260fb7e39818e48bb725388';
        res = await request.delete(`/api/nurses/${nurseId}`);
        expect(res.status).toBe(404);
    });
});
