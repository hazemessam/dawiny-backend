// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const { Doctor, DoctorReservation } = require('../../models/doctor');
const { Patient } = require('../../models/patient');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


const appointments = [
    { day: 'Sun', start: '04:00 PM', end: '05:00 PM' },
    { day: 'Sun', start: '05:00 PM', end: '06:00 PM' },
    { day: 'Fri', start: '09:00 AM', end: '10:00 AM' },
    { day: 'Tue', start: '12:00 PM', end: '01:00 PM' },
]


async function createPatient(patientData = data) {
    const patient = await Patient.create(patientData);
    const payload = { userId: patient._id, role: 'patient' };
    patient.access = genAccessToken(payload);
    return patient;
}


async function createDoctor(doctorData = data) {
    return await Doctor.create(doctorData);
}


describe('POST /api/doctors/:id/reservations', () => {
    test('should respond with 201 status code when successfully book an appointment', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        // Act
        const reservationData = {
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.status).toBe(201);
    });


    test('should return reservation data when successfully book an appointment', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        // Act
        const reservationData = {
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.body).toHaveProperty('_id');
    });


    test('should respond with 400 status code when sending bad request', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        // Act
        const reservationData = {};
        const res = await request.post(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.status).toBe(400);
    });


    test('should respond with 404 status code when trying to book an appointment with unexisting doctor', async () => {
        // Arrange
        const patient = await createPatient();

        // Act
        const unexistDoctorId = '62b707b86296d2d59eba2e53';
        const reservationData = {
            appointmentId: '62b707b86296d2d59eba2e53',
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${unexistDoctorId}/reservations`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.status).toBe(404);
    });


    test('should respond with 404 status code when trying to book an unexisting appointment', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        // Act
        const unexistAppointment = '62b707b86296d2d59eba2e40';
        const reservationData = {
            appointmentId: unexistAppointment,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.status).toBe(404);
    });


    test('should respond with 422 status code when trying to book an booked appointment', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });
        const doctorReservationData = {
            patientId: patient._id, doctorId: doctor._id,
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        }
        await DoctorReservation.create(doctorReservationData);

        // Act
        const reservationData = {
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.status).toBe(422);
    });
});

describe('POST /api/doctors/:id/reservations?check=true', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        // Act
        const reservationData = {
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations?check=true`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.status).toBe(200);
    });
    
    test('should return available equals to true when the appointment is available', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        // Act
        const reservationData = {
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations?check=true`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.body.available).toBe(true);
    });
    
    
    test('should return available equals to false when the appointment is booked', async () => { 
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });
        const doctorReservationData = {
            patientId: patient._id, doctorId: doctor._id,
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        }
        await DoctorReservation.create(doctorReservationData);
        
        // Act
        const reservationData = {
            appointmentId: doctor.appointments[0]._id,
            date: '2022-07-03', type: 'offline'
        };
        const res = await request.post(`/api/doctors/${doctor._id}/reservations?check=true`)
            .set('Authorization', patient.access)
            .send(reservationData);

        // Assert
        expect(res.body.available).toBe(false);
    });
});
