import ApiClient from '../apiClient.js'

describe('Login feature', () => {
    test('People resource without authorization', async () => {
        const apiClient = new ApiClient();
        const peopleData = (await apiClient.people()).data;

        expect(peopleData.status).toEqual(401);
    });

    test.each([
        ['', ''],
        ['invalid_login', 'invalid_password'],
    ])('Failure login: [login: "%s"][password: "%s"]', async (login, password) => {
        const apiClient = new ApiClient();
        const loginResponse = (await apiClient.login(login, password));
        
        const expectedData = {
            "status": 401,
            "message": "Incorrect email or password"
        }
        expect(loginResponse.status).toEqual(401);
        expect(loginResponse.data).toEqual(expectedData);
    });

});
