// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const Doctor = require('../../models/doctor.js');
const Patient = require('../../models/patient.js');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createPatientandGetItsToken(patientData = data) {
    const patient = await Patient.create(patientData);
    const payload = { userId: patient._id, role: 'patient' };
    return genAccessToken(payload);
}


async function createDoctor(doctorData = data) {
    return await Doctor.create(doctorData);
}


describe('GET /api/doctors', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();

        // Act
        const res = await request.get('/api/doctors').set('Authorithation', access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();

        // Act
        const res = await request.get('/api/doctors').set('Authorithation', access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return array', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();

        // Act
        const res = await request.get('/api/doctors').set('Authorithation', access);

        // Assert
        expect(Array.isArray(res.body)).toBe(true);
    });


    test('should return array contains a doctor', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();
        const doctor = await createDoctor();

        // Act
        const res = await request.get('/api/doctors').set('Authorithation', access);

        // Assert
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toEqual(doctor._id.toString());
    });
});


describe('GET /api/doctors/:id', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();
        const doctor = await createDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`).set('Authorithation', access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();
        const doctor = await createDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`).set('Authorithation', access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return doctor with email field', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();
        const doctor = await createDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`).set('Authorithation', access);

        // Assert
        expect(res.body).toHaveProperty('email');
    });


    test('should return doctor without passowrd field', async () => {
        // Arrange
        const access = await createPatientandGetItsToken();
        const doctor = await createDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`).set('Authorithation', access);

        // Assert
        expect(res.body).not.toHaveProperty('password');
    });


    test('should respond with 404 status code if the doctor does not exist', async () => {
        // Arrange
        const unExistId = '6260fb7e39818e48bb725388';

        // Act
        res = await request.get(`/api/doctors/${unExistId}`);

        // Assert
        expect(res.status).toBe(404);
    });
});
