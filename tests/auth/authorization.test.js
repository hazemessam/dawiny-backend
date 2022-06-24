// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const Doctor = require('../../models/doctor');
const Patient = require('../../models/patient');
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


async function createPatient(patientData = data, tokenExp = '1h') {
    const patient = await Patient.create(patientData);
    const payload = { userId: patient._id, role: 'patient' };
    patient.access = genAccessToken(payload, tokenExp);
    patient.refresh = genRefreshToken(payload);
    return patient;
}


describe('Authorization', () => {
    test('should return 200 status code when authorize successfully', async () => {
        // Arrange
        const doctor = await createDoctor();

        // Act
        const res = await request.get(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return 403 status code when doctor tries to get another doctor data', async () => {
        // Arrange 
        const doctor1 = await createDoctor({...data, email: 'doctor1@dawiny.com'});
        const doctor2 = await createDoctor({...data, email: 'doctor2@dawiny.com'});

        // Act
        const res = await request.get(`/api/doctors/${doctor1._id}`)
            .set('Authorization', doctor2.access);

        // Assert
        expect(res.status).toBe(403);
    });


    test('should return 403 status code when patient tries to update a doctor data', async () => {
        // Arrange 
        const doctor = await createDoctor();
        const patient = await createPatient();

        // Act
        const res = await request.patch(`/api/doctors/${doctor._id}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.status).toBe(403);
    });
});
