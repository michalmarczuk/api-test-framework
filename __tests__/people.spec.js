import ApiClient from '../lib/apiClient.js'
import People from '../lib/endpoints/people/people.js';

describe('People resource', () => {
    test('Get all people', async () => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data.length).toBeGreaterThan(0);
        const validationErrors = People.validateGetAllResponse(peopleResponse.data).errors;
        expect(validationErrors).toEqual([]);
    });
});
