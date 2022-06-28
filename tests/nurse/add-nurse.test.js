// Third party modules
const supertest = require('supertest');

// Application modules
const app = require('../../app');


const request = supertest(app);

const data = {
    email: 'test@dawiny.com',
    password: '1234',
    firstName: 'Hazem',
    lastName: 'Essam'
}

describe('POST /api/nurses', () => {
    test('should respond with 201 status code', async () => {
        // Act
        const res = await request.post('/api/nurses').send(data);

        // Assert
        expect(res.status).toBe(201);
    });


    test('should return json response', async () => {
        // Act
        const res = await request.post('/api/nurses').send(data);

        // Assert
        expect(res.headers['content-type']).toMatch('json');
    });


    test('should return nurse access and refresh tokens', async () => {
        // Act
        const res = await request.post('/api/nurses').send(data);

        // Assert
        expect(res.body.access).toBeDefined();
        expect(res.body.refresh).toBeDefined();
    });


    test('should respond with 400 status code when sending incompleted data', async () => {
        // Arrange
        const incompletedData = [
            {...data, email: undefined},
            {...data, password: undefined},
            {...data, firstName: undefined},
            {...data, lastName: undefined},
        ]

        // Act
        for (let data of incompletedData) {
            const res = await request.post('/api/nurses').send(data);

            // Assert
            expect(res.status).toBe(400);
        }
    });


    test('should respond with 422 status code when email is already exist', async () => {
        // Arrange
        await request.post('/api/nurses').send(data);

        // Act
        const res = await request.post('/api/nurses').send(data);

        // Assert
        expect(res.status).toBe(422);
    });
});
