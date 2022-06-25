// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const { Doctor } = require('../../models/doctor');
const { genAccessToken, genRefreshToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createDoctor(doctorData = data, tokenExp = '1h') {
    const doctor = await Doctor.create(doctorData);
    const payload = { userId: doctor._id, role: 'doctor' };
    doctor.access = genAccessToken(payload, tokenExp);
    doctor.refresh = genRefreshToken(payload);
    return doctor;
}


describe('POST /api/auth/token [Auth]', () => {
    test('should respond with 200 status code when successfully generating a new acccess token', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        const res = await request.post(`/api/auth/token`)
            .send({ refresh: doctor.refresh });

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return the access token when successfully generating it', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        const res = await request.post(`/api/auth/token`)
            .send({ refresh: doctor.refresh });

        // Assert
        expect(res.body).toHaveProperty('access');
    });


    test('should return a valid access token', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        let res = await request.post(`/api/auth/token`)
            .send({ refresh: doctor.refresh });
        
        res = await request.get(`/api/doctors/${doctor._id}`)
            .set('Authorization', res.body.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should respond with 401 when sending an invalid refresh token', async () => {
        // Act
        const invalidRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\
            eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.\
            SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        const res = await request.post(`/api/auth/token`)
            .send({ refresh: invalidRefreshToken });

        // Assert
        expect(res.status).toBe(401);
    });
});
