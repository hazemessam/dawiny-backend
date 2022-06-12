// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const Nurse = require('../../models/nurse.js');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'user@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createNurseAndItsToken(nurseData = data) {
    const nurse = await Nurse.create(nurseData);
    const payload = { userId: nurse._id, role: 'nurse' };
    nurse.access = genAccessToken(payload);
    return nurse;
}


describe('PATCH /api/nurses/:id', () => {
    test('should respond with 200 status code', async () => { 
        // Arrange        
        const nurse = await createNurseAndItsToken();

        // Act
        const res = await request.patch(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange        
        const nurse = await createNurseAndItsToken();

        // Act
        const res = await request.patch(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return updated nurse', async () => {
        // Arrange        
        const nurse = await createNurseAndItsToken();

        // Act
        const updatedEmail = 'updated@dawiny.com';
        const res = await request.patch(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access)
            .send({ email: updatedEmail });

        // Assert
        expect(res.body.email).toEqual(updatedEmail);
    });


    test('should respond with 404 status code if the nurse does not exist', async () => {
        // Arrange        
        const nurse = await createNurseAndItsToken();

        // Act
        const unExistId = '6260fb7e39818e48bb725388';
        const res = await request.patch(`/api/nurses/${unExistId}`)
            .set('Authorization', nurse.access)
            .send({ email: 'updated@dawiny.com' });

        // Assert
        expect(res.status).toBe(404);
    });


    test('should respond with 422 status code when updating to existing email', async () => {
        // Arrange
        const existEmail = 'existnurse@dawiny.com'
        await createNurseAndItsToken({ ...data, email: existEmail });
        const nurse = await createNurseAndItsToken({ ...data, email: 'nurse@dawiny.com' });

        // Act
        const res = await request.patch(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access)
            .send({ email: existEmail });

        // Assert
        expect(res.status).toBe(422);
    });


    test('should respond with 400 status code when updating to invaled rate', async () => {
        // Arrange
        const nurse = await createNurseAndItsToken();

        // Act
        const res = await request.patch(`/api/nurses/${nurse._id}`).send({ rate: 10 });
        
        // Assert
        expect(res.status).toBe(400);
    });
});
