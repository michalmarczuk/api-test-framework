import jsonschema from 'jsonschema';

export default class Endpoint {
    constructor(axiosInstance, resource) {
        this.resource = resource;
        this.axiosInstance = axiosInstance;
    }

    static validator = new jsonschema.Validator();

    static validateGetResponse(responseData) {
        return this.validator.validate(responseData, this.all.peopleSchema)
    }

    static validateGetAllResponse(responseData) {
        return this.validator.validate(responseData, this.all.allPeopleSchema);
    }
}
