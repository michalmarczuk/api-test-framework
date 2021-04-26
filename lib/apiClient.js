'use strict';

import axios from 'axios';
import People from './endpoints/people/people';

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

    people() {
        // return await this.axiosInstance.get('people');
        return new People(this.axiosInstance);
    }
}
