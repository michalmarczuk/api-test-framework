import ApiClient from '../apiClient.js'

describe('Login feature', () => {
    test('Successful login', async () => {
        const apiClient = new ApiClient();
        const loginResponse = (await apiClient.login('john.connor@skynet.com', 'secret'));

        expect(loginResponse.status).toEqual(200);
        expect(loginResponse.data.status).toEqual(200);
        expect(loginResponse.data.message).toMatch(/^.+\..+\..+$/);
    });

    test.each([
        ['', ''],
        ['invalid_email', 'invalid_password'],
    ])('Failure login: [Email: "%s"][password: "%s"]', async (email, password) => {
        const apiClient = new ApiClient();
        const loginResponse = (await apiClient.login(email, password));
        
        const expectedData = {
            "status": 401,
            "message": "Incorrect email or password"
        }
        expect(loginResponse.status).toEqual(401);
        expect(loginResponse.data).toEqual(expectedData);
    });
});
