'use strict';

import axios from 'axios';

export default class Test {
    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:8000',
            timeout: 1000,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pbHNvbkBlbWFpbC5jb20iLCJwYXNzd29yZCI6Im5pbHNvbiIsImlhdCI6MTYxMzY1MDE5MiwiZXhwIjoxNjEzNjUzNzkyfQ.FlcPfWT0r9ruQhH9XWccL9Udnx3NYKGn4VivN9XRjIQ' },
            validateStatus: () => true,
        });
    }

    async people() {
        return await this.instance.get('people');
    }
}
