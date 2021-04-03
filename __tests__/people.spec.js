import ApiClient from '../lib/apiClient.js'
import People from '../lib/endpoints/people.js';

describe('People resource', () => {
    test('Get all people', async () => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data.length).toBeGreaterThan(0);
        People.validateGetAllResponse(peopleResponse.data);
    });

    test('Invalid additional param in get all people response', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();
        peopleResponse.data[33].invalidAdditionalParam = 123;

        const validationErrors = People.validateGetAllResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('is not allowed to have the additional property "invalidAdditionalParam"');
    });
});
