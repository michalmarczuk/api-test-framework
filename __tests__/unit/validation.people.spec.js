import People from '../../lib/endpoints/people/people.js';

describe('Response validation for people resource', () => {
    beforeEach(async () => {
        testData = sampleCorrectPeopleDataList();
    });

    test('[Get] Invalid type', async() => {
        testData[0].age = '30';

        expect(People.validateGetResponse(testData[0])[0].message).toEqual('should be integer');
    });

    test('[Get] Additional param', async() => {
        testData[0].newParam = '123';

        expect(People.validateGetResponse(testData[0])[0].message).toEqual('should NOT have additional properties');
    });

    test('[Get] Lack of required param', async() => {
        delete testData[0].company;

        expect(People.validateGetResponse(testData[0])[0].message).toEqual('should have required property \'company\'');
    });

    test('[Get All] Invalid type', async() => {
        testData[0].age = '30';

        expect(People.validateGetAllResponse(testData)[0].message).toEqual('should be integer');
    });

    test('[Get All] Additional param', async() => {
        testData[0].newParam = '123';

        expect(People.validateGetAllResponse(testData)[0].message).toEqual('should NOT have additional properties');
    });

    test('[Get All] Lack of required param', async() => {
        delete testData[0].company;

        expect(People.validateGetAllResponse(testData)[0].message).toEqual('should have required property \'company\'');
    });

    let testData;
    const sampleCorrectPeopleDataList = () => [
        {
            "id": "6044ee2a2519c64279eafb9f",
            "age": 31,
            "name": "Harrison Dyer",
            "gender": "male",
            "company": "CIRCUM",
            "email": "harrisondyer@circum.com",
            "phone": "+1 (957) 517-2699",
            "address": "802 Tennis Court, Greenfields, Maine, 3898",
            "credits": [ { "bank": 'Scrooge McDuck Bank', "amount": 6886 } ]
        },
        {
            "id": "6044ee2a689832d7aa4bc1ea",
            "age": 29,
            "name": "Haney Bates",
            "gender": "male",
            "company": "ZORK",
            "email": "haneybates@zork.com",
            "phone": "+1 (852) 502-2076",
            "address": "529 Independence Avenue, Wells, Washington, 9821",
            "credits": []
        }
    ];
});

