'use strict';

import axios from 'axios';
import Customer from './endpoints/customer/customer';

export default class ApiClient {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8001',
            timeout: 1000,
            validateStatus: () => true,
        });
    }

    async login(email = 'john.connor@skynet.com', password = 'secret') {
        const data = {
            email,
            password
        }

        const loginResponse = await this.axiosInstance.post('auth/login', data);
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.message}`;

        return loginResponse;
    }

    customer() {
        return new Customer(this.axiosInstance);
    }
}
