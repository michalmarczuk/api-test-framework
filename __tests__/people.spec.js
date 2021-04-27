import People from '../lib/endpoints/people/people.js';
import { getApiClientWithSession } from '../lib/flow.js';

describe('People resource', () => {
    test('Get all people', async () => {
        const apiClient = await getApiClientWithSession();
        const getPeopleResponse = await apiClient.people().get();

        expect(getPeopleResponse.status).toEqual(200);
        expect(getPeopleResponse.data.length).toBeGreaterThan(0);
        expect(People.validateGetAllResponse(getPeopleResponse.data).errors).toEqual([]);
    });
    test.only('Post people', async () => {
        const apiClient = await getApiClientWithSession();
        const postPeopleReposnse = await apiClient.people().post({name: 'Jack'});
        const getPeopleResponseData = await apiClient.people().get(postPeopleReposnse.data.id);
        
        console.log(getPeopleResponseData);

        expect(postPeopleReposnse.status).toEqual(201);
        // expect(getPeopleResponseData)
    });
});
