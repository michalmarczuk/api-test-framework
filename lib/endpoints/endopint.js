'use strict';

import path from 'path';
import fs from 'fs';
import Ajv from 'ajv';

export default class Endpoint {
    constructor(axiosInstance, resource) {
        this.resource = resource;
        this.axiosInstance = axiosInstance;
    }

    static endpointSchemas;
    static ajv;

    static validateGetResponse(responseData) {
        return this.validate('getSchema', responseData);
    }

    static validateGetAllResponse(responseData) {
        return this.validate('getAllSchema', responseData);
    }

    static validatePostResponse(responseData) {
        return this.validate('postSchema', responseData);
    }

    static validatePutResponse(responseData) {
        return this.validate('putSchema', responseData);
    }

    static allSchemas() {
        if (!this.endpointSchemas) {
            const endpointName = this.name.toLowerCase();
            const responseSchemasPath = path.resolve(`./lib/endpoints/${endpointName}/responseSchemas.json`);
            this.endpointSchemas = JSON.parse(fs.readFileSync(responseSchemasPath));
        }

        return this.endpointSchemas;
    }

    static schema(name) {
        return this.allSchemas().find(schema => schema.$id === name);
    }

    static validate(schemaName, responseData) {
        if (!this.ajv) this.ajv = new Ajv.default({schemas: this.allSchemas()});
        const valid = this.ajv.validate(this.schema(schemaName), responseData);

        return !valid ? this.ajv.errors : valid;
    }
}
