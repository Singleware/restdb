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
    parseRequestQuery(model, query, fields) {
        return filters_1.Filters.toURL(model, query, fields);
    }
    /**
     * Gets the inserted Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the inserted Id or undefined when the inserted Id wasn't found.
     * @throws Throws an error when the response payload doesn't contains the inserted Id.
     */
    parseInsertResponse(model, response) {
        if (!(response.payload instanceof Object) || response.payload.id === void 0) {
            throw new Error(`The response payload must be an object containing the inserted id.`);
        }
        return response.payload.id;
    }
    /**
     * Gets the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list.
     * @throws Throws an error when the response payload doesn't contains the entity list.
     */
    parseFindResponse(model, response) {
        if (!(response.payload instanceof Array)) {
            throw new Error(`The response payload must be an array containing the search results.`);
        }
        return response.payload;
    }
    /**
     * Gets the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity or undefined when the entity was not found.
     */
    parseFindByIdResponse(model, response) {
        return response.payload;
    }
    /**
     * Gets the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities.
     */
    parseUpdateResponse(model, response) {
        return parseInt(response.headers[this.apiCountingHeader]) || 0;
    }
    /**
     * Gets the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status.
     */
    parseUpdateByIdResponse(model, response) {
        return true;
    }
    /**
     * Gets the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseReplaceByIdResponse(model, response) {
        return true;
    }
    /**
     * Gets the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities.
     */
    parseDeleteResponse(model, response) {
        return parseInt(response.headers[this.apiCountingHeader]) || 0;
    }
    /**
     * Gets the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status.
     */
    parseDeleteByIdResponse(model, response) {
        return true;
    }
    /**
     * Gets the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities.
     */
    parseCountResponse(model, response) {
        return parseInt(response.headers[this.apiCountingHeader]) || 0;
    }
    /**
     * Parses the error response from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     */
    parseErrorResponse(mode, response) {
        this.apiResponseError = response.payload;
    }
    /**
     * Sets a new API counting header for the subsequent requests.
     * @param name New header name.
     * @returns Returns the own instance.
     */
    setCountingHeaderName(name) {
        this.apiCountingHeader = name.toLowerCase();
        return this;
    }
    /**
     * Gets the last request error response.
     * @returns Returns the error response entity or undefined when there's no error.
     */
    getErrorResponse() {
        return this.apiResponseError;
    }
};
__decorate([
    Class.Private()
], Driver.prototype, "apiCountingHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiResponseError", void 0);
__decorate([
    Class.Protected()
], Driver.prototype, "parseRequestQuery", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseInsertResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseFindResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseFindByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseUpdateResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseUpdateByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseReplaceByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseDeleteResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseDeleteByIdResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseCountResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseErrorResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setCountingHeaderName", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getErrorResponse", null);
Driver = __decorate([
    Class.Describe()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=driver.js.map