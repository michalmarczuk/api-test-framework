import Customer from '../../lib/endpoints/customer/customer.js';
import { getApiClientWithSession } from '../../lib/flow.js';

describe('Customer resource', () => {
    let apiClient;

    beforeEach(async () => {
        apiClient = await getApiClientWithSession();
    });

    test('Customer GET all', async () => {
        const getCustomerResponse = await apiClient.customer().get();

        expect(getCustomerResponse.status).toEqual(200);
        expect(getCustomerResponse.data.length).toBeGreaterThan(0);
        expect(Customer.validateGetAllResponse(getCustomerResponse.data)).toEqual(true);
    });

    test('Customer GET by id', async () => {
        const getCustomerResponse = await apiClient.customer().get('618a9f7505663884a4fa0859');

        expect(getCustomerResponse.status).toEqual(200);
        expect(getCustomerResponse.data).toMatchObject({
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
    ])('Customer GET by invalid id', async (id) => {
        const getCustomerResponse = await apiClient.customer().get(id);

        expect(getCustomerResponse.status).toEqual(404);
    });

    test('Customer POST', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const expectedData = JSON.parse(postCustomerResponse.config.data);

        expect(postCustomerResponse.status).toEqual(201);
        expect(postCustomerResponse.data).toMatchObject(expectedData);
        expect(Customer.validatePostResponse(postCustomerResponse.data)).toEqual(true);

        const getClientResponse = await apiClient.customer().get(postCustomerResponse.data.id);
        expect(getClientResponse.data).toMatchObject(expectedData);
    });

    test.each([
        [["age", "name", "gender", "email", "phone", "address", "credits"], "Missing param or invalid value: age, name, gender, email, phone, address, credits"],
        [["gender"], "Missing param or invalid value: gender"]
    ])('Customer POST required params missing', async (missingParams, expectedMessage) => {
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
        const postCustomerResponse = await apiClient.customer().postRawData(data);
        const expectedData = {
            "status": 400,
            "message": expectedMessage
        }

        expect(postCustomerResponse.status).toEqual(400);
        expect(postCustomerResponse.data).toEqual(expectedData);
    });
    
    test('Customer POST client already exists', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const addedCustomerData = JSON.parse(postCustomerResponse.config.data);
        const postAgainCustomerResponse = await apiClient.customer().post(addedCustomerData);
        const expectedData = {
            "status": 409,
            "message": "Customer already exists"
        }

        expect(postAgainCustomerResponse.status).toEqual(409);
        expect(postAgainCustomerResponse.data).toMatchObject(expectedData);
    });

    test('Customer PUT', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const putCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id);
        const expectedData = JSON.parse(putCustomerResponse.config.data);

        expect(putCustomerResponse.status).toEqual(200);
        expect(putCustomerResponse.data).toMatchObject(expectedData);
        expect(Customer.validatePutResponse(putCustomerResponse.data)).toEqual(true);

        const getCustomerResponse = await apiClient.customer().get(postCustomerResponse.data.id);
        expect(getCustomerResponse.data).toMatchObject(expectedData);
    });

    test('Customer PUT invalid id', async () => {
        const putCustomerResponse = await apiClient.customer().put('non-existing-id');
        expect(putCustomerResponse.status).toEqual(404);
    });

    test('Customer PUT client already exists', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const existingClientData = (await apiClient.customer().get()).data[0];
        delete existingClientData.id;
        const putCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id, existingClientData);
        const expectedData = {
            "status": 409,
            "message": "Customer already exists"
        }

        expect(putCustomerResponse.status).toEqual(409);
        expect(putCustomerResponse.data).toMatchObject(expectedData);
    });
});