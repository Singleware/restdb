"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const driver_1 = require("../driver");
const filters_1 = require("./filters");
/**
 * Common driver class.
 */
let Driver = class Driver extends driver_1.Driver {
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
     * Get the insert result from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the insertion or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    getInsertResponse(model, response) {
        this.lastPayload = response.payload;
        if (response.status.code !== 200 && response.status.code !== 201) {
            throw new Error(`Unexpected insert(${response.input.method}) response status: ${response.status.code}`);
        }
        else if (this.lastPayload instanceof Array) {
            throw new Error(`Response payload must be an object.`);
        }
        else if (!(this.lastPayload instanceof Object) || this.lastPayload.id === void 0) {
            throw new Error(`Response payload must contains the Id property.`);
        }
        return this.lastPayload.id;
    }
    /**
     * Get the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    getFindResponse(model, response) {
        this.lastPayload = response.payload;
        if (response.status.code !== 200) {
            throw new Error(`Unexpected find(${response.input.method}) response status: ${response.status.code}`);
        }
        else if (!(this.lastPayload instanceof Array)) {
            throw new Error(`Response payload must contains an array.`);
        }
        return this.lastPayload;
    }
    /**
     * Get the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity either undefined when the entity wasn't found or an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    getFindByIdResponse(model, response) {
        this.lastPayload = response.payload;
        if (response.status.code !== 200) {
            throw new Error(`Unexpected find(${response.input.method}) response status: ${response.status.code}`);
        }
        return this.lastPayload;
    }
    /**
     * Get the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    getUpdateResponse(model, response) {
        this.lastPayload = response.payload;
        if (response.status.code !== 200) {
            throw new Error(`Unexpected update(${response.input.method}) response status: ${response.status.code}`);
        }
        else {
            const amount = parseInt(response.headers[this.apiCountingHeader]);
            if (isNaN(amount)) {
                throw new Error(`Response header '${this.apiCountingHeader}' is missing or incorrect.`);
            }
            return amount;
        }
    }
    /**
     * Get the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or undefined when an error occurs.
     */
    getUpdateByIdResponse(model, response) {
        this.lastPayload = response.payload;
        return response.status.code === 200 || response.status.code === 204;
    }
    /**
     * Get the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or undefined when an error occurs.
     */
    getReplaceByIdResponse(model, response) {
        this.lastPayload = response.payload;
        return response.status.code === 200 || response.status.code === 204;
    }
    /**
     * Get the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    getDeleteResponse(model, response) {
        this.lastPayload = response.payload;
        if (response.status.code !== 200 && response.status.code !== 204) {
            throw new Error(`Unexpected delete(${response.input.method}) response status: ${response.status.code}`);
        }
        else {
            const amount = parseInt(response.headers[this.apiCountingHeader]);
            if (isNaN(amount)) {
                throw new Error(`Response header '${this.apiCountingHeader}' is missing or incorrect.`);
            }
            return amount;
        }
    }
    /**
     * Get the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or undefined when an error occurs.
     */
    getDeleteByIdResponse(model, response) {
        this.lastPayload = response.payload;
        return response.status.code === 200 || response.status.code === 204;
    }
    /**
     * Get the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    getCountResponse(model, response) {
        this.lastPayload = response.payload;
        if (response.status.code !== 200 && response.status.code !== 204) {
            throw new Error(`Unexpected count(${response.input.method}) response status: ${response.status.code}`);
        }
        else {
            const amount = parseInt(response.headers[this.apiCountingHeader]);
            if (isNaN(amount)) {
                throw new Error(`Response header '${this.apiCountingHeader}' missing or incorrect.`);
            }
            return amount;
        }
    }
    /**
     * Get the request query string based on the specified entity model, filters and fields.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Fields to select.
     * @returns Returns the instance itself.
     */
    getRequestQuery(model, query, fields) {
        return filters_1.Filters.toURL(model, query, fields);
    }
    /**
     * Set a new name for the API counting header.
     * @param name New header name.
     * @returns Returns the instance itself.
     */
    setCountingHeaderName(name) {
        this.apiCountingHeader = name.toLowerCase();
        return this;
    }
    /**
     * Set a new name for the API key header.
     * @param name New header name.
     * @returns Returns the instance itself.
     */
    setKeyHeaderName(name) {
        this.unsetAuthHeader(this.apiKeyHeader);
        this.apiKeyHeader = name.toLowerCase();
        return this;
    }
    /**
     * Set a new value for the API key header.
     * @param value New header value.
     * @returns Returns the instance itself.
     */
    setKeyHeaderValue(value) {
        this.setAuthHeader(this.apiKeyHeader, value);
        return this;
    }
    /**
     * Get the last request payload.
     */
    get payload() {
        return this.lastPayload;
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
], Driver.prototype, "lastPayload", void 0);
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
], Driver.prototype, "getRequestQuery", null);
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
    Class.Public()
], Driver.prototype, "payload", null);
Driver = __decorate([
    Class.Describe()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=driver.js.map