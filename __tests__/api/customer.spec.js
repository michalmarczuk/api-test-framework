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

    test.each([
        [{ name: 'Krista Rohan' }, c => c.name === 'Krista Rohan'],
        [{ age_gte: 90 }, c => c.age >= 90],
        [{ gender: 'Female',  age_lte: 25}, c => c.age <= 25 && c.gender === 'Female'],
        [{ email_like: 'gmail' }, c => c.email.includes('gmail')],
        [{ name: 'Zero results' }, c => c.name.includes('Zero results')],
    ])('Customer GET filtered', async (filters, assertFunction) => {
        const getCustomerResponse = await apiClient.customer().get({ filters });
        expect(getCustomerResponse.data.length).toEqual(getCustomerResponse.data.filter(assertFunction).length);
    });

    test('Customer GET by id', async () => {
        const getCustomerResponse = await apiClient.customer().get({ id: '618a9f7505663884a4fa0859' });

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
        const getCustomerResponse = await apiClient.customer().get({ id });

        expect(getCustomerResponse.status).toEqual(404);
    });

    test('Customer POST', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const expectedData = JSON.parse(postCustomerResponse.config.data);

        expect(postCustomerResponse.status).toEqual(201);
        expect(postCustomerResponse.data).toMatchObject(expectedData);
        expect(Customer.validatePostResponse(postCustomerResponse.data)).toEqual(true);

        const getClientResponse = await apiClient.customer().get({ id: postCustomerResponse.data.id });
        expect(getClientResponse.data).toMatchObject(expectedData);
    });

    test.each([
        [["age", "name", "gender", "email", "phone", "address", "credits"], "Missing param or invalid value: age, name, gender, email, phone, address, credits"],
        [["gender"], "Missing param or invalid value: gender"]
    ])('Customer POST required params missing', async (missingParams, expectedMessage) => {
        const data = Customer.getDefaultData();
        missingParams.forEach(param => delete data[param]);
        const postCustomerResponse = await apiClient.customer().post(data, true);
        const expectedData = {
            "status": 400,
            "message": expectedMessage
        }

        expect(postCustomerResponse.status).toEqual(expectedData.status);
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

        expect(postAgainCustomerResponse.status).toEqual(expectedData.status);
        expect(postAgainCustomerResponse.data).toMatchObject(expectedData);
    });

    test.each([
        [{naame: 'John'}],
        [{Agge: 123, UknownedParameter: 'xyz'}],
    ])('Customer POST uknowned parameters', async (invalidParams) => {
        const postCustomerResponse = await apiClient.customer().post(invalidParams);

        expect(postCustomerResponse.status).toEqual(201);
        const getCustomerResponse = await apiClient.customer().get({ id: postCustomerResponse.data.id });
        
        for (const invalidParam of Object.keys(invalidParams)) {
            expect(getCustomerResponse.data).not.toHaveProperty(invalidParam);
        }
    });

    test.each([
        [{age: 'John'}],
        [{age: 'John', name: '1', gender: 'Gender', company: 123, email: 'abc', phone: '9-2-11', address: 678, credits: 'credits'}],
    ])('Customer POST invalid parameters values', async (invalidParamsValues) => {
        const postCustomerResponse = await apiClient.customer().post(invalidParamsValues);
        const expectedData = {
            "status": 400,
            "message": `Missing param or invalid value: ${Object.keys(invalidParamsValues).join(', ')}`
        }

        expect(postCustomerResponse.status).toEqual(expectedData.status);
        expect(postCustomerResponse.data).toMatchObject(expectedData);
    });

    test('Customer PUT', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const putCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id);
        const expectedData = JSON.parse(putCustomerResponse.config.data);

        expect(putCustomerResponse.status).toEqual(200);
        expect(putCustomerResponse.data).toMatchObject(expectedData);
        expect(Customer.validatePutResponse(putCustomerResponse.data)).toEqual(true);

        const getCustomerResponse = await apiClient.customer().get({ id: postCustomerResponse.data.id });
        expect(getCustomerResponse.data).toMatchObject(expectedData);
    });

    test('Customer PUT invalid id', async () => {
        const putCustomerResponse = await apiClient.customer().put('non-existing-id');
        expect(putCustomerResponse.status).toEqual(404);
    });

    test.each([
        [["age", "name", "gender", "email", "phone", "address", "credits"], "Missing param or invalid value: age, name, gender, email, phone, address, credits"],
        [["gender"], "Missing param or invalid value: gender"]
    ])('Customer PUT required params missing', async (missingParams, expectedMessage) => {
        const data = Customer.getDefaultData();
        missingParams.forEach(param => delete data[param]);
        const postCustomerResponse = await apiClient.customer().post();
        const putCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id, data, true);
        const expectedData = {
            "status": 400,
            "message": expectedMessage
        }

        expect(putCustomerResponse.status).toEqual(expectedData.status);
        expect(putCustomerResponse.data).toEqual(expectedData);
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

        expect(putCustomerResponse.status).toEqual(expectedData.status);
        expect(putCustomerResponse.data).toMatchObject(expectedData);
    });

    test.each([
        [{naame: 'John'}],
        [{Agge: 123, UknownedParameter: 'xyz'}],
    ])('Customer PUT uknowned parameters', async (invalidParams) => {
        const postCustomerResponse = await apiClient.customer().post();
        const putCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id, invalidParams);

        expect(putCustomerResponse.status).toEqual(200);
        const getCustomerResponse = await apiClient.customer().get({ id: postCustomerResponse.data.id });
        
        for (const invalidParam of Object.keys(invalidParams)) {
            expect(getCustomerResponse.data).not.toHaveProperty(invalidParam);
        }
    });

    test.each([
        [{age: 'John'}],
        [{age: 'John', name: '1', gender: 'Gender', company: 123, email: 'abc', phone: '9-2-11', address: 678, credits: 'credits'}],
    ])('Customer PUT invalid parameters values', async (invalidParamsValues) => {
        const postCustomerResponse = await apiClient.customer().post();
        const putCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id, invalidParamsValues);
        const expectedData = {
            "status": 400,
            "message": `Missing param or invalid value: ${Object.keys(invalidParamsValues).join(', ')}`
        }

        expect(putCustomerResponse.status).toEqual(expectedData.status);
        expect(putCustomerResponse.data).toMatchObject(expectedData);
    });

    test('Customer PATCH', async () => {
        const postCustomerResponse = await apiClient.customer().post();

        const patchCustomerResponse = await apiClient.customer().patch(postCustomerResponse.data.id, { name: Customer.getDefaultData().name });
        const expectedData = JSON.parse(patchCustomerResponse.config.data);

        expect(patchCustomerResponse.status).toEqual(200);
        expect(patchCustomerResponse.data).toMatchObject(expectedData);
        expect(Customer.validatePutResponse(patchCustomerResponse.data)).toEqual(true);

        const getCustomerResponse = await apiClient.customer().get({ id: postCustomerResponse.data.id });
        expect(getCustomerResponse.data).toMatchObject(expectedData);
    });

    test('Customer PATCH invalid id', async () => {
        const patchCustomerResponse = await apiClient.customer().patch('non-existing-id');
        expect(patchCustomerResponse.status).toEqual(404);
    });

    test('Customer PATCH client already exists', async () => {
        const postCustomerResponse = await apiClient.customer().post();
        const existingClientData = (await apiClient.customer().get()).data[0];
        delete existingClientData.id;
        const patchCustomerResponse = await apiClient.customer().patch(postCustomerResponse.data.id, { name: existingClientData.name });
        const expectedData = {
            "status": 409,
            "message": "Customer already exists"
        }

        expect(patchCustomerResponse.status).toEqual(expectedData.status);
        expect(patchCustomerResponse.data).toMatchObject(expectedData);
    });

    test.each([
        [{naame: 'John'}],
        [{Agge: 123, UknownedParameter: 'xyz'}],
    ])('Customer PATCH uknowned parameters', async (invalidParams) => {
        const postCustomerResponse = await apiClient.customer().post();
        const patchCustomerResponse = await apiClient.customer().patch(postCustomerResponse.data.id, invalidParams);

        expect(patchCustomerResponse.status).toEqual(200);
        const getCustomerResponse = await apiClient.customer().get({ id: postCustomerResponse.data.id });
        
        for (const invalidParam of Object.keys(invalidParams)) {
            expect(getCustomerResponse.data).not.toHaveProperty(invalidParam);
        }
    });

    test.each([
        [{age: 'John'}],
        [{age: 'John', name: '1', gender: 'Gender', company: 123, email: 'abc', phone: '9-2-11', address: 678, credits: 'credits'}],
    ])('Customer PATCH invalid parameters values', async (invalidParamsValues) => {
        const postCustomerResponse = await apiClient.customer().post();
        const patchCustomerResponse = await apiClient.customer().put(postCustomerResponse.data.id, invalidParamsValues);
        const expectedData = {
            "status": 400,
            "message": `Missing param or invalid value: ${Object.keys(invalidParamsValues).join(', ')}`
        }

        expect(patchCustomerResponse.status).toEqual(expectedData.status);
        expect(patchCustomerResponse.data).toMatchObject(expectedData);
    });

    // Parameters handling - GET
});
