'use strict';

import jsonschema from 'jsonschema';
import path from 'path';
import fs from 'fs';

export default class Endpoint {
    constructor(axiosInstance, resource) {
        this.resource = resource;
        this.axiosInstance = axiosInstance;
    }

    static validator = new jsonschema.Validator();

    static validateGetResponse(responseData) {
        return this.validator.validate(responseData, this.responseSchemas().getSchema);
    }

    static validateGetAllResponse(responseData) {
        this.validator.addSchema(this.responseSchemas().getSchema, '/getSchema');
        return this.validator.validate(responseData, this.responseSchemas().getAllSchema);
    }

    static responseSchemas() {
        const endpointName = this.name.toLowerCase();
        const responseSchemasPath = path.resolve(`./lib/endpoints/${endpointName}/responseSchemas.json`);
        const responseSchemas = JSON.parse(fs.readFileSync(responseSchemasPath));

        return responseSchemas;
    }
}
