import People from '../../lib/endpoints/people/people.js';
import { getApiClientWithSession } from '../../lib/flow.js';

describe('People resource', () => {
    let apiClient;

    beforeEach(async () => {
        apiClient = await getApiClientWithSession();
    });

    test('[Get People] Get all clients', async () => {
        const getPeopleResponse = await apiClient.people().get();

        expect(getPeopleResponse.status).toEqual(200);
        expect(getPeopleResponse.data.length).toBeGreaterThan(0);
        expect(People.validateGetAllResponse(getPeopleResponse.data)).toEqual(true);
    });

    test('[Get People] Get client by id', async () => {
        const peopleResponse = await apiClient.people().get('6044ee2a59be89b9b9d7ed1b');

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data).toMatchObject({
            id: '6044ee2a59be89b9b9d7ed1b',
            age: 35,
            name: 'Arnold Thompson',
            gender: 'male',
            company: 'QIAO',
            email: 'arnoldthompson@qiao.com',
            phone: '+1 (820) 420-2603',
            address: '579 Madison Street, Oneida, Virginia, 6531',
            credits: [ { bank: 'Happy bank', amount: 2906 } ]
        });
    });

    test.each([
        'invalid123',
        '!@#$%^&*(((',
        '-123',
    ])('[Get People] Get client by invalid id', async (id) => {
        const peopleResponse = await apiClient.people().get(id);

        expect(peopleResponse.status).toEqual(404);
    });

    test('[Post People] Add client', async () => {
        const postPeopleResponse = await apiClient.people().post();
        const expectedData = JSON.parse(postPeopleResponse.config.data);

        expect(postPeopleResponse.status).toEqual(201);
        expect(postPeopleResponse.data).toMatchObject(expectedData);
        expect(People.validatePostResponse(postPeopleResponse.data)).toEqual(true);

        const getPeopleResponse = await apiClient.people().get(postPeopleResponse.data.id);

        expect(getPeopleResponse.data).toMatchObject(expectedData);
    });

    test.each([
        [["age", "name", "gender", "email", "phone", "address", "credits"], "Missing param or invalid value: age, name, gender, email, phone, address, credits"],
        [["gender"], "Missing param or invalid value: gender"]
    ])('[Post People] Required params missing', async (missingParams, expectedMessage) => {
        const data = {
            age: 66,
            name: 'John Connor',
            gender: 'female',
            company: 'Skynet',
            email: 'john.connor@skynet.com',
            phone: '555-123-123',
            address: 'Test address',
            credits: [{ bank: 'Happy bank', amount: 2906 }]
        }
        missingParams.forEach(param => delete data[param]);
        const postPeopleResponse = await apiClient.people().postRawData(data);
        const expectedData = {
            "status": 400,
            "message": expectedMessage
        }

        expect(postPeopleResponse.status).toEqual(400);
        expect(postPeopleResponse.data).toEqual(expectedData);
    });
    
    test('[Post People] Client already exists', async () => {
        const postPeopleResponse = await apiClient.people().post();
        const addedPeopleData = JSON.parse(postPeopleResponse.config.data);
        const postAgainPeopleResponse = await apiClient.people().post(addedPeopleData);
        const expectedData = {
            "status": 409,
            "message": "Person already exists"
        }

        expect(postAgainPeopleResponse.status).toEqual(409);
        expect(postAgainPeopleResponse.data).toMatchObject(expectedData);
    });

    test('[Put People] Update client', async () => {
        const postPeopleResponse = await apiClient.people().post();
        const putPeopleResponse = await apiClient.people().put(postPeopleResponse.data.id);
        const expectedData = JSON.parse(putPeopleResponse.config.data);

        expect(putPeopleResponse.status).toEqual(200);
        expect(putPeopleResponse.data).toMatchObject(expectedData);
        expect(People.validatePutResponse(putPeopleResponse.data)).toEqual(true);

        const getPeopleResponse = await apiClient.people().get(postPeopleResponse.data.id);

        expect(getPeopleResponse.data).toMatchObject(expectedData);
    });

    test('[Put People] Invalid ID', async () => {
        const putPeopleResponse = await apiClient.people().put('non-existing-id');
        expect(putPeopleResponse.status).toEqual(404);
    });
});