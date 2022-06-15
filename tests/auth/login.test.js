// Third party modules
const supertest = require('supertest');
const bcrypt = require('bcrypt');

// Application modules
const app = require('../../app');
const Doctor = require('../../models/doctor');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}

describe('[Auth] POST /api/auth/login', () => {
    test('should return 200 status code when successfully login', async () => {
        // Arrange
        const hash = await bcrypt.hash(data.password, 10);
        await Doctor.create({ ...data, password: hash });

        // Act
        const doctorCredentials = { email: data.email, password: data.password, role: 'doctor' };
        const res = await request.post('/api/auth/login').send(doctorCredentials);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return access and refresh tokens when successfully login', async () => {
        // Arrange
        const hash = await bcrypt.hash(data.password, 10);
        await Doctor.create({ ...data, password: hash });

        // Act
        const doctorCredentials = { email: data.email, password: data.password, role: 'doctor' };
        const res = await request.post('/api/auth/login').send(doctorCredentials);

        // Assert
        expect(res.body).toHaveProperty('access');
        expect(res.body).toHaveProperty('refresh');
    });


    test('should return 404 status code when sending unexist email', async () => {
        // Act
        const unExistEmail = 'unexist@dawiny.com';
        const doctorCredentials = { email: unExistEmail, password: data.password, role: 'doctor' };
        const res = await request.post('/api/auth/login').send(doctorCredentials);

        // Assert
        expect(res.status).toBe(404);
    })


    test('should return 401 status code when sending invalid credentials', async () => {
        // Arrange
        const hash = await bcrypt.hash(data.password, 10);
        await Doctor.create({ ...data, password: hash });

        // Act
        const doctorCredentials = { email: data.email, password: 'invalidpassword', role: 'doctor' };
        const res = await request.post('/api/auth/login').send(doctorCredentials);

        // Assert
        expect(res.status).toBe(401);
    })
});
