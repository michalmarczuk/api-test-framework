import Test from '../main.js'

describe("Login function", () => {
    test("Failure login", async () => {
        const test = new Test();
        const peopleData = (await test.people()).data;
        console.log(peopleData);

        expect(peopleData.status).toEqual(404);
    });
});