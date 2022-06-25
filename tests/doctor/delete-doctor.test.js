// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const { Doctor } = require('../../models/doctor');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createDoctor(doctorData = data) {
    const doctor = await Doctor.create(doctorData);
    const payload = {userId: doctor._id, role: 'doctor'};
    doctor.access = genAccessToken(payload);
    return doctor;
}


describe('DELETE /api/doctors/:id', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        const res = await request.delete(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        const res = await request.delete(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return doctorId', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        const res = await request.delete(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.body._id).toEqual(doctor._id.toString());
    });
});
