import People from '../lib/endpoints/people/people.js';
import { getApiClientWithSession } from '../lib/flow.js';

describe('People resource', () => {
    let apiClient;

    beforeEach(async () => {
        apiClient = await getApiClientWithSession();
    });

    test('Get all people', async () => {
        const getPeopleResponse = await apiClient.people().get();

        expect(getPeopleResponse.status).toEqual(200);
        expect(getPeopleResponse.data.length).toBeGreaterThan(0);
        expect(People.validateGetAllResponse(getPeopleResponse.data).errors).toEqual([]);
    });

    test('Get people by id', async () => {
        const peopleResponse = await apiClient.people().get('6044ee2a59be89b9b9d7ed1b');

        expect(peopleResponse.status).toEqual(200);
        expect(peopleResponse.data).toMatchObject({
            id: '6044ee2a59be89b9b9d7ed1b',
            age: 35,
            name: 'Arnold Thompson',
            gender: 'male',
            company: 'QIAO',
            email: 'arnoldthompson@qiao.com',
            phone: '+1 (820) 420-2603',
            address: '579 Madison Street, Oneida, Virginia, 6531',
            credits: [ { bank: 'Happy bank', amount: 2906 } ]
        });
    });

    test.each([
        'invalid123',
        '!@#$%^&*(((',
        '-123',
    ])('Get people by invalid id', async (id) => {
        const peopleResponse = await apiClient.people().get(id);

        expect(peopleResponse.status).toEqual(404);
    });

    test('Post people', async () => {
        const data = {
            age: 66,
            name: 'John Connor',
            gender: 'Female',
            company: 'Skynet',
            email: 'john.connor@skynet.com',
            phone: '555-123-123',
            address: 'Test address',
            credits: [{ bank: 'Happy bank', amount: 2906 }]
        }
        const peopleResponse = await apiClient.people().post(data);

        // delete peopleResponse.data.id;
        console.log(peopleResponse.data);
        
        expect(peopleResponse.status).toEqual(201);
        expect(peopleResponse.data).toMatchObject(data);
    });
    
});