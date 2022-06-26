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
    const doctor = await Doctor.create(doctorData);
    const payload = { userId: doctor._id, role: 'doctor' };
    doctor.access = genAccessToken(payload);
    return doctor;
}


describe('POST /api/doctors/:id/reservations', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        const reservationData = { patientId: patient._id, doctorId: doctor._id, type: 'offline' }
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-03-22' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-07-04' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-07-28' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[1]._id, date: '2022-07-28' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-10-02' });
        // Act

        const res = await request.get(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', doctor.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should respond with 200 status code', async () => {
        // Arrange
        const patient = await createPatient();
        const doctor = await createDoctor({ ...data, appointments });

        const reservationData = { patientId: patient._id, doctorId: doctor._id, type: 'offline' }
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-03-22' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-07-04' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-07-28' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[1]._id, date: '2022-07-28' });
        await DoctorReservation.create({ ...reservationData, appointmentId: doctor.appointments[0]._id, date: '2022-10-02' });
        // Act

        const res = await request.get(`/api/doctors/${doctor._id}/reservations`)
            .set('Authorization', doctor.access);

        // Assert
        console.log(res.body)
        expect(res.status).toBe(200);
    });
});
