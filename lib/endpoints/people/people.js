'use strict';

import Endpoint from '../endopint';

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
}