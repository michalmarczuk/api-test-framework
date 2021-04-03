'use strict';

import Endpoint from './endopint';

export default class People extends Endpoint {
    constructor(axiosInstance) {
        super(axiosInstance, 'people');

        People.validator.addSchema(People.all.creditsSchema, '/creditsSchema');
        People.validator.addSchema(People.all.peopleSchema, '/peopleSchema');
    }

    async get() {
        return await this.axiosInstance.get(this.resource);
    }

    static all = {
        "creditsSchema": {
            "id": "/creditsSchema",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "bank": { "type": "string" },
                    "amount": { "type": "string" },
                },
                "required": ["bank", "amount"],
                "additionalProperties": false
            }
        },
        "peopleSchema": {
            "id": "/peopleSchema",
            "type": "object",
            "properties": {
                "id": { "type": "string" },
                "age": { "type": "integer" },
                "name": { "type": "string" },
                "gender": { "type": "string" },
                "company": { "type": "string" },
                "email": { "type": "string" },
                "phone": { "type": "string" },
                "address": { "type": "string" },
                "credits": {"$ref": "/creditsSchema"},
            },
            "required": ["id", "age", "name", "gender", "company", "email", "phone", "address", "credits"],
            "additionalProperties": false
        },
        "allPeopleSchema": {
            "id": "/allPeopleSchema",
            "type": "array",
            "items": {"$ref": "/peopleSchema"},
        }
    }
}
