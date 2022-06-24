// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');
const Nurse = require('../../models/nurse');
const { genAccessToken } = require('../../services/auth/token');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}


async function createNurse(nurseData = data) {
    const nurse = await Nurse.create(nurseData);
    const payload = {userId: nurse._id, role: 'nurse'};
    nurse.access = genAccessToken(payload);
    return nurse;
}


describe('DELETE /api/nurses/:id', () => {
    test('should respond with 200 status code', async () => {
        // Arrange
        const nurse = await createNurse();

        // Act
        const res = await request.delete(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access);

        // Assert
        expect(res.status).toBe(200);
    });


    test('should return json response', async () => {
        // Arrange
        const nurse = await createNurse();

        // Act
        const res = await request.delete(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return nurseId', async () => {
        // Arrange
        const nurse = await createNurse();

        // Act
        const res = await request.delete(`/api/nurses/${nurse._id}`)
            .set('Authorization', nurse.access);

        // Assert
        expect(res.body._id).toEqual(nurse._id.toString());
    });
});
