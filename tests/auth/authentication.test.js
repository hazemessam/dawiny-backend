// Third party modules
const supertest = require('supertest');
const bcrypt = require('bcrypt');

// Application modules
const app = require('../../app');
const Doctor = require('../../models/doctor');
const { genAccessToken, genRefreshToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function craeteDoctor(doctorData = data, tokenExp = '1h') {
    const doctor = await Doctor.create(doctorData);
    const payload = { userId: doctor._id, role: 'doctor' };
    doctor.access = genAccessToken(payload, tokenExp);
    doctor.refresh = genRefreshToken(payload);
    return doctor;
}


describe('POST /api/auth/login [Auth]', () => {
    test('should return 200 status code when authenticate successfully', async () => {
        // Arrange
        const doctor = await craeteDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return 401 status code when auth header is empty', async () => {
        // Arrange
        const doctor = await craeteDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`);

        // Assert
        expect(res.status).toBe(401);
    });


    test('should return 401 status code when access token is invalid', async () => {
        // Arrange
        const doctor = await craeteDoctor();

        // Act
        const invalidAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\
            eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.\
            SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        const res = await request.get(`/api/doctors/${doctor._id}`)
            .set('Authorization', invalidAccessToken);

        // Assert
        expect(res.status).toBe(401);
    });


    test('should return 401 status code when access token is expired', async () => {
        // Arrange
        const doctor = await craeteDoctor(data, tokenExp='1s');

        // Act
        await new Promise((resolve) => setTimeout(() => resolve(), 1500));

        const res = await request.get(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.status).toBe(401);
    });
});
