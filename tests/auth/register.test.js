// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}

describe('POST /api/doctors [Auth]', () => {
    test('should return 201 status code when successfully register', async () => {
        // Act
        const res = await request.post('/api/doctors').send(data);
        
        // Assert
        expect(res.status).toBe(201);
    });


    test('should return access and refresh tokens when successfully register', async () => {
        // Act
        const res = await request.post('/api/doctors').send(data);
        
        // Assert
        expect(res.body).toHaveProperty('access');
        expect(res.body).toHaveProperty('refresh');
    });
});
