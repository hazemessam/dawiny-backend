// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const { Nurse } = require('../../models/nurse.js');
const { Patient } = require('../../models/patient.js');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
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


async function createNurse(nurseData = data) {
    return await Nurse.create(nurseData);
}


describe('GET /api/nurses', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get('/api/nurses').set('Authorization', patient.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get('/api/nurses').set('Authorization', patient.access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return array', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const res = await request.get('/api/nurses').set('Authorization', patient.access);

        // Assert
        expect(Array.isArray(res.body)).toBe(true);
    });


    test('should return array contains a nurse', async () => {
        // Arrange
        const patient = await createPatient();
        const nurse = await createNurse();

        // Act
        const res = await request.get('/api/nurses').set('Authorization', patient.access);

        // Assert
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toEqual(nurse._id.toString());
    });
});


describe('GET /api/nurses/:id', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const patient = await createPatient();
        const nurse = await createNurse();

        // Act
        const res = await request.get(`/api/nurses/${nurse._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const patient = await createPatient();
        const nurse = await createNurse();

        // Act
        const res = await request.get(`/api/nurses/${nurse._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return nurse with email field', async () => {
        // Arrange
        const patient = await createPatient();
        const nurse = await createNurse();

        // Act
        const res = await request.get(`/api/nurses/${nurse._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.body).toHaveProperty('email');
    });


    test('should return nurse without passowrd field', async () => {
        // Arrange
        const patient = await createPatient();
        const nurse = await createNurse();

        // Act
        const res = await request.get(`/api/nurses/${nurse._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.body).not.toHaveProperty('password');
    });


    test('should respond with 404 status code if the nurse does not exist', async () => {
        // Arrange
        const patient = await createPatient();
        const nurseId = '6260fb7e39818e48bb725388';

        // Act
        const res = await request.get(`/api/nurses/${nurseId}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.status).toBe(404);
    });
});
