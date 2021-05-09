'use strict';

import Endpoint from '../endopint';
import faker from 'faker';

export default class People extends Endpoint {
    constructor(axiosInstance) {
        super(axiosInstance, 'people');

        People.validator.addSchema(People.responseSchemas().creditsSchema, '/creditsSchema');
    }

    async get(id = 0) {
        if (id) {
            return await this.axiosInstance.get(`${this.resource}/${id}`);
        }
        
        return await this.axiosInstance.get(this.resource);
    }

    async post(data) {
        const defaultData = {
            age: faker.datatype.number({min:18, max:99}),
            name: faker.name.findName(),
            gender: faker.random.arrayElement(['Male', 'Female']),
            company: faker.company.companyName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            credits: [{ bank: 'Happy bank', amount: '$2906' }]
        }

        return await this.axiosInstance.post(this.resource, Object.assign(defaultData, data));
    }
}
