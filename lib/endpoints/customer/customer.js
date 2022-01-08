'use strict';

import Endpoint from '../endopint';
import faker from 'faker';

export default class Customer extends Endpoint {
    constructor(axiosInstance) {
        super(axiosInstance, 'customer');
    }

    async get({ id = 0, filters = {} } = {}) {
        const formatParams = (obj) => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
        const formatedParams = `${formatParams(filters)}`;
        return await this.axiosInstance.get(`${this.resource}${id ? `/${id}` : ''}${formatedParams ? `?${formatedParams}` : ''}`);
    }

    async post({ data = {}, rawData = false } = {}) {
        const requestData = rawData ? data : Object.assign(Customer.getDefaultData(), data);
        return await this.axiosInstance.post(this.resource, requestData);
    }

    async put({ id, data = {}, rawData = false } = {}) {
        const requestData = rawData ? data : Object.assign(Customer.getDefaultData(), data);
        return await this.axiosInstance.put(`${this.resource}/${id}`, requestData);
    }

    async patch({ id, data = {} } = {}) {
        return await this.axiosInstance.patch(`${this.resource}/${id}`, data);
    }

    static getDefaultData() {
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
