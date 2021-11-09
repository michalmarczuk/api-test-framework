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
        const peopleResponse = await apiClient.people().get('618a9f7505663884a4fa0859');

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data).toMatchObject({
            id: '618a9f7505663884a4fa0859',
            age: 22,
            name: 'Robles Johnston',
            gender: 'Male',
            company: 'BOSTONIC',
            email: 'roblesjohnston@bostonic.com',
            phone: '871-496-200',
            address: '533 Hastings Street, Nord, Wyoming, 7009',
            credits: [ { bank: 'National Bank', amount: 1518 } ]
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

    test('Put People: Client already exists', async () => {
        const postPeopleResponse = await apiClient.people().post();
        const existingClientData = (await apiClient.people().get()).data[0];
        delete existingClientData.id;
        const putPeopleResponse = await apiClient.people().put(postPeopleResponse.data.id, existingClientData);
        const expectedData = {
            "status": 409,
            "message": "Person already exists"
        }

        expect(putPeopleResponse.status).toEqual(409);
        expect(putPeopleResponse.data).toMatchObject(expectedData);
    });
});