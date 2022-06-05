// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const Patient = require('../../models/patient');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
};


async function createPatientAndItsToken(patientData = data) {
    const patient = await Patient.create(patientData);
    const payload = { userId: patient._id, role: 'patient' };
    patient.access = genAccessToken(payload);
    return patient;
}


describe('PATCH /api/patients/:id', () => {
    test('should respond with 200 status code', async () => { 
        // Arrange        
        const patient = await createPatientAndItsToken();

        // Act
        const res = await request.patch(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange        
        const patient = await createPatientAndItsToken();

        // Act
        const res = await request.patch(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return updated patient', async () => {
        // Arrange
        const patient = await createPatientAndItsToken();

        // Act
        const updatedEmail = 'updated@dawiny.com';
        const res = await request.patch(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access)
            .send({ email: updatedEmail });

        // Assert
        expect(res.body.email).toEqual(updatedEmail);
    });


    test('should respond with 404 status code if the patient does not exist', async () => {
        // Arrange
        const patient = await createPatientAndItsToken();

        // Act
        const unExistId = '6260fb7e39818e48bb725388';
        const res = await request.patch(`/api/patient/${unExistId}`)
            .set('Authorization', patient.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.status).toBe(404);
    });


    test('should respond with 422 status code when updating to existing email', async () => {
        // Arrange
        const existEmail = 'exist@dawiny.com'
        await createPatientAndItsToken({ ...data, email: existEmail });
        const patient = await createPatientAndItsToken({ ...data, email: 'patient@dawiny.com' });

        // Act
        const res = await request.patch(`/api/patients/${patient._id}`)
            .set('Authorization', patient.access)
            .send({ email: existEmail });

        // Assert
        expect(res.status).toBe(422);
    });
});
