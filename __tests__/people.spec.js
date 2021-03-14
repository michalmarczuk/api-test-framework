import ApiClient from '../apiClient.js'

describe('People resource', () => {
    test('Get all people', async () => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people();

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data.length).toBeGreaterThan(0);
    });
});
