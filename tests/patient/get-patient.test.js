// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const { Patient } = require('../../models/patient.js');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createPatient(patientData = data) {
    const patient = await Patient.create(patientData);
    const payload = { userId: patient._id, role: 'patient' };
    patient.access = genAccessToken(payload);
    return patient;
}


describe('GET /api/patients/:id', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return patient with email field', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.body).toHaveProperty('email');
    });


    test('should return patient without passowrd field', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access);
    
        // Assert
        expect(res.body).not.toHaveProperty('password');
    });
});
