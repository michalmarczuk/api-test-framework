import ApiClient from '../lib/apiClient.js'
import People from '../lib/endpoints/people.js';

describe('People resource', () => {
    test('Get all people', async () => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data.length).toBeGreaterThan(0);

        // People.validateGetAllResponse(peopleResponse.data);

        const invalidPeople = peopleResponse.data[33];
        invalidPeople.test = 123;
        People.validateGetResponse(invalidPeople);
    });
});
