'use strict';

import axios from 'axios';

export default class ApiClient {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8001',
            timeout: 1000,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pbHNvbkBlbWFpbC5jb20iLCJwYXNzd29yZCI6Im5pbHNvbiIsImlhdCI6MTYxMzY1MDE5MiwiZXhwIjoxNjEzNjUzNzkyfQ.FlcPfWT0r9ruQhH9XWccL9Udnx3NYKGn4VivN9XRjIQ' },
            validateStatus: () => true,
        });
    }

    async login(email = 'john.connor@skynet.com', password = 'secret') {
        const data = {
            email,
            password
        }
        return await this.axiosInstance.post('auth/login', data);
    }

    async people() {
        return await this.axiosInstance.get('people');
    }
}
