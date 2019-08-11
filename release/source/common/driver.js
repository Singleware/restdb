"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const driver_1 = require("../driver");
const filters_1 = require("./filters");
/**
 * Common driver class.
 */
let Driver = class Driver extends driver_1.Driver {
    /**
     * Common driver class.
     */
    constructor() {
        super(...arguments);
        /**
         * Header name for the authorization key.
         */
        this.apiKeyHeader = 'x-api-key';
        /**
         * Header name for the counting results.
         */
        this.apiCountingHeader = 'x-api-count';
    }
    /**
     * Gets the request query string based on the specified entity model, fields and filters.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the parsed query string.
     */
    getRequestQuery(model, query, fields) {
        return filters_1.Filters.toURL(model, query, fields);
    }
    /**
     * Gets the result Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the result Id or undefined when the result Id wasn't found.
     * @throws Throws an error when the response payload doesn't contains the result Id.
     */
    getInsertResponse(model, response) {
        if (response.status.code === 200 || response.status.code === 201 || response.status.code === 202) {
            if (!(response.payload instanceof Object) || response.payload.id === void 0) {
                throw new Error(`The response payload must be an object containing the insert id.`);
            }
            return response.payload.id;
        }
        return void 0;
    }
    /**
     * Gets the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list.
     * @throws Throws an error when the response payload doesn't contains the entity list.
     */
    getFindResponse(model, response) {
        if (response.status.code === 200) {
            if (!(response.payload instanceof Array)) {
                throw new Error(`The response payload must be an array containing the search results.`);
            }
            return response.payload;
        }
        return [];
    }
    /**
     * Gets the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity or undefined when the entity was not found.
     */
    getFindByIdResponse(model, response) {
        if (response.status.code === 200) {
            if (!(response.payload instanceof Object)) {
                throw new Error(`The response payload must be an object.`);
            }
            return response.payload;
        }
        return void 0;
    }
    /**
     * Gets the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities.
     * @throws Throws an error when the counting header is missing or incorrect in the response.
     */
    getUpdateResponse(model, response) {
        if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
            const amount = parseInt(response.headers[this.apiCountingHeader]);
            if (isNaN(amount)) {
                throw new Error(`Counting header is missing or incorrect in the update response.`);
            }
            return amount;
        }
        return 0;
    }
    /**
     * Gets the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status.
     */
    getUpdateByIdResponse(model, response) {
        return response.status.code === 200 || response.status.code === 202 || response.status.code === 204;
    }
    /**
     * Gets the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getReplaceByIdResponse(model, response) {
        return response.status.code === 200 || response.status.code === 202 || response.status.code === 204;
    }
    /**
     * Gets the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities.
     * @throws Throws an error when the counting header is missing or incorrect in the response.
     */
    getDeleteResponse(model, response) {
        if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
            const amount = parseInt(response.headers[this.apiCountingHeader]);
            if (isNaN(amount)) {
                throw new Error(`Counting header is missing or incorrect in the delete response.`);
            }
            return amount;
        }
        return 0;
    }
    /**
     * Gets the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status.
     */
    getDeleteByIdResponse(model, response) {
        return response.status.code === 200 || response.status.code === 202 || response.status.code === 204;
    }
    /**
     * Gets the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities.
     * @throws Throws an error when the counting header is missing or incorrect in the response.
     */
    getCountResponse(model, response) {
        if (response.status.code === 200 || response.status.code === 204) {
            const amount = parseInt(response.headers[this.apiCountingHeader]);
            if (isNaN(amount)) {
                throw new Error(`Counting header missing or incorrect in the count response.`);
            }
            return amount;
        }
        return 0;
    }
    /**
     * Notify an error in the given response entity for all listeners.
     * @param model Entity model.
     * @param response Response entity.
     */
    async notifyErrorResponse(model, response) {
        await super.notifyErrorResponse(model, (this.apiResponseError = response.payload));
    }
    /**
     * Sets a new name for the API counting header.
     * @param name New header name.
     * @returns Returns its own instance.
     */
    setCountingHeaderName(name) {
        return (this.apiCountingHeader = name.toLowerCase()), this;
    }
    /**
     * Sets a new name for the API key header.
     * @param name New header name.
     * @returns Returns its own instance.
     */
    setKeyHeaderName(name) {
        return (this.apiKeyHeader = name.toLowerCase()), this;
    }
    /**
     * Sets a new value for the API key header.
     * @param value New header value.
     * @returns Returns its own instance.
     */
    setKeyHeaderValue(value) {
        return this.setHeader(this.apiKeyHeader, value), this;
    }
    /**
     * Gets the request error response.
     * @returns Returns the error response entity or undefined when there's no error.
     */
    get errorResponse() {
        return this.apiResponseError;
    }
};
__decorate([
    Class.Private()
], Driver.prototype, "apiKeyHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiCountingHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiResponseError", void 0);
__decorate([
    Class.Protected()
], Driver.prototype, "getRequestQuery", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getInsertResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getFindResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getFindByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getUpdateResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getUpdateByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getReplaceByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getDeleteResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getDeleteByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getCountResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "notifyErrorResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setCountingHeaderName", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setKeyHeaderName", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setKeyHeaderValue", null);
__decorate([
    Class.Protected()
], Driver.prototype, "errorResponse", null);
Driver = __decorate([
    Class.Describe()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=driver.js.map