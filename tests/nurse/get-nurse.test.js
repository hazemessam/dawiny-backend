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


    test('should return orderd list of the nearst nurses to a specfic location', async () => {
        // Arrange
        const location = { lat: 31.42139662201346, lng: 31.81586299955237 };
        const patient = await createPatient();

        const nursesData = [
            { email: 'n1@dawiny.com', address: 'a1', location: { lat: 31.42230301053233, lng: 31.813052020427122 } },
	        { email: 'n2@dawiny.com', address: 'a2', status: 'offline', location: { lat: 31.428269092248854, lng: 31.817984039666502 } },
	        { email: 'n3@dawiny.com', address: 'a3', status: 'online' },
	        { email: 'n5@dawiny.com', address: 'Cairo', status: 'online', location: { lat: 30.118313673851535, lng: 31.311940888357075 } },
	        { email: 'n6@dawiny.com', address: 'Fayoum', status: 'online', location: { lat: 29.312322484322483, lng: 30.84384526287473 } },
	        { email: 'n7@dawiny.com', address: 'Damietta', status: 'online', location: { lat: 31.443177612996678, lng: 31.658397622866737 } },
	        { email: 'n8@dawiny.com', address: 'October', status: 'online', location: { lat: 29.94975117509209, lng: 30.896899918381223 } },
	        { email: 'n9@dawiny.com', address: 'Alex', status: 'online', location: { lat: 31.387026615678803, lng: 30.52112230692198 } },
	        { email: 'n10@dawiny.com', address: 'USA', status: 'online', location: { lat: 42.05521311755507, lng: -97.74822703925088 } },
	        { email: 'n11@dawiny.com', address: 'UK', status: 'online', location: { lat: 54.828759516988924, lng: -2.456174205390504 } }
        ]
        nursesData.forEach(async nurseData => await createNurse({ ...data, ...nurseData }));

        // Act
        const res = await request.get(`/api/nurses?lat=${location.lat}&lng=${location.lng}`)
            .set('Authorization', patient.access);

        // Assert
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(7);
        expect(res.body[0].address).toEqual('Damietta');
        expect(res.body[1].address).toEqual('Alex');
        expect(res.body[2].address).toEqual('Cairo');
        expect(res.body[3].address).toEqual('October');
        expect(res.body[4].address).toEqual('Fayoum');
        expect(res.body[5].address).toEqual('UK');
        expect(res.body[6].address).toEqual('USA');
    });
});
