'use strict';

import jsonschema from 'jsonschema';

export default class People {
    constructor(axiosInstance) {
        this.resource = 'people';
        this.axiosInstance = axiosInstance;
    }

    async get() {
        return await this.axiosInstance.get(this.resource);
    }

    static validateGetResponse(responseData) {
        var validator = new jsonschema.Validator();
        validator.addSchema(this.creditsSchema, '/creditsSchema');
        console.log(validator.validate(responseData, this.peopleSchema));
    }

    static validateGetAllResponse(responseData) {
        var validator = new jsonschema.Validator();
        validator.addSchema(this.creditsSchema, '/creditsSchema');
        validator.addSchema(this.peopleSchema, '/peopleSchema');
        console.log(validator.validate(responseData, this.allPeopleSchema));
    }

    static creditsSchema = {
        "id": "/creditsSchema",
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "bank": { "type": "string" },
                "amount": { "type": "integer" },
            },
            "required": ["bank", "amount"],
            "additionalProperties": false
        },
    }
    
    static peopleSchema = {
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
    }
    
    static allPeopleSchema = {
        "id": "/allPeopleSchema",
        "type": "array",
        "items": {"$ref": "/peopleSchema"},
    }
}
