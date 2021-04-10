'use strict';

import Endpoint from '../endopint';

export default class People extends Endpoint {
    constructor(axiosInstance) {
        super(axiosInstance, 'people');

        People.validator.addSchema(People.responseSchemas().creditsSchema, '/creditsSchema');
        People.validator.addSchema(People.responseSchemas().peopleSchema, '/peopleSchema');
    }

    async get() {
        return await this.axiosInstance.get(this.resource);
    }
}
