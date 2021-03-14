'use strict';

import axios from 'axios';

export default class ApiClient {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8000',
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

    async people() {
        return await this.axiosInstance.get('people');
    }
}
