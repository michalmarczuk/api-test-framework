import ApiClient from '../../lib/apiClient.js'

describe('Session token', () => {
    test('Customer resource without authorization', async () => {
        const apiClient = new ApiClient();
        const customerData = await apiClient.customer().get();

        const expectedData = {
            "status": 401,
            "message": "Error in authorization format"
        }
        expect(customerData.status).toEqual(401);
        expect(customerData.data).toEqual(expectedData);
    });
});
