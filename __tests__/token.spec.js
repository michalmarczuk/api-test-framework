import ApiClient from '../lib/apiClient.js'

describe('Session token', () => {
    test('People resource without authorization', async () => {
        const apiClient = new ApiClient();
        const peopleData = await apiClient.people().get();

        const expectedData = {
            "status": 401,
            "message": "Error in authorization format"
        }
        expect(peopleData.status).toEqual(401);
        expect(peopleData.data).toEqual(expectedData);
    });
});
