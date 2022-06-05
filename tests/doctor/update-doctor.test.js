// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const Doctor = require('../../models/doctor.js');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createDoctorandItsToken(doctorData = data) {
    const doctor = await Doctor.create(doctorData);
    const payload = { userId: doctor._id, role: 'doctor' };
    doctor.access =  genAccessToken(payload);
    return doctor;
}


describe('PATCH /api/doctors/:id', () => {
    test('should respond with 200 status code', async () => {
        // Arrange        
        const doctor = await createDoctorandItsToken();

        // Act
        const res = await request.patch(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange        
        const doctor = await createDoctorandItsToken();

        // Act
        const res = await request.patch(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return updated doctor', async () => {
        // Arrange        
        const doctor = await createDoctorandItsToken();

        // Act
        const updatedEmail = 'updated@dawiny.com';
        const res = await request.patch(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access)
            .send({ email: updatedEmail });

        // Assert
        expect(res.body.email).toEqual(updatedEmail);
    });


    test('should respond with 404 status code if the doctor does not exist', async () => {
        // Arrange
        const doctor = await createDoctorandItsToken();

        // Act
        const unExistId = '6260fb7e39818e48bb725388';
        const res = await request.patch(`/api/doctors/${unExistId}`)
            .set('Authorization', doctor.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.status).toBe(404);
    });


    test('should respond with 422 status code when updating to existing email', async () => {
        // Arrange
        const existEmail = 'existdoctor@dawiny.com'
        await createDoctorandItsToken({ ...data, email: existEmail });
        const doctor = await createDoctorandItsToken({ ...data, email: 'doctor@dawiny.com' });

        // Act
        const res = await request.patch(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access)
            .send({ email: existEmail });

        // Assert
        expect(res.status).toBe(422);
    });


    test('should respond with 400 status code when updating to invaled rate', async () => {
        // Arrange        
        const doctor = await createDoctorandItsToken();

        // Act
        const res = await request.patch(`/api/doctors/${doctor._id}`)
            .set('Authorization', doctor.access)
            .send({ rate: 10 });

        // Assert
        expect(res.status).toBe(400);
    });
});
