import ApiClient from '../lib/apiClient.js'
import People from '../lib/endpoints/people/people.js';

describe('Response validation for people resource', () => {
    test('[Get] Invalid type', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get('6044ee2a23f888686e06c0eb');
        peopleResponse.data.age = '30';

        const validationErrors = People.validateGetResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('is not of a type(s) integer');
    });

    test('[Get] Additional param', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get('6044ee2a23f888686e06c0eb');
        peopleResponse.data.newParam = '123';

        const validationErrors = People.validateGetResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('is not allowed to have the additional property "newParam"');
    });

    test('[Get] Lack of required param', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get('6044ee2a23f888686e06c0eb');
        delete peopleResponse.data.company;

        const validationErrors = People.validateGetResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('requires property "company"');
    });
    test('[Get All] Invalid type', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();
        peopleResponse.data[22].age = '30';

        const validationErrors = People.validateGetAllResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('is not of a type(s) integer');
    });

    test('[Get All] Additional param', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();
        peopleResponse.data[22].newParam = '123';

        const validationErrors = People.validateGetAllResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('is not allowed to have the additional property "newParam"');
    });

    test('[Get All] Lack of required param', async() => {
        const apiClient = new ApiClient();
        await apiClient.login();

        const peopleResponse = await apiClient.people().get();
        delete peopleResponse.data[22].company;

        const validationErrors = People.validateGetAllResponse(peopleResponse.data).errors;
        expect(validationErrors[0].message).toEqual('requires property "company"');
    });
});
