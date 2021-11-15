'use strict';

import Endpoint from '../endopint';
import faker from 'faker';

export default class Customer extends Endpoint {
    constructor(axiosInstance) {
        super(axiosInstance, 'customer');
    }

    async get(id = 0) {
        return await this.axiosInstance.get(`${this.resource}${id ? `/${id}` : ''}`);
    }

    async post(data = {}) {
        return await this.axiosInstance.post(this.resource, Object.assign(this.getDefaultData(), data));
    }

    async put(id, data = {}) {
        return await this.axiosInstance.put(`${this.resource}/${id}`, Object.assign(this.getDefaultData(), data));
    }

    getDefaultData() {
        return {
            age: faker.datatype.number({ min:18, max:99 }),
            name: faker.name.findName(),
            gender: faker.random.arrayElement(['Male', 'Female']),
            company: faker.company.companyName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber('555-123-456'),
            address: faker.address.streetAddress(),
            credits: [{ bank: 'Happy bank', amount: faker.datatype.number({ min:1, max:10000 }) }]
        }
    }
}
