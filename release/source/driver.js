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
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Observable = require("@singleware/observable");
const Path = require("@singleware/path");
const Requests = require("./requests");
const Types = require("./types");
const method_1 = require("./method");
/**
 * Generic driver class.
 */
let Driver = class Driver extends Class.Null {
    constructor() {
        super(...arguments);
        /**
         * API base headers.
         */
        this.apiHeaders = {};
        /**
         * API errors subject.
         */
        this.apiErrors = new Observable.Subject();
    }
    /**
     * Gets the request Id based on the specified entity model and entity Id.
     * @param model Entity model.
     * @param id Entity Id.
     * @returns Returns the request Id.
     */
    getRequestId(model, id) {
        return id.toString();
    }
    /**
     * Gets the request query string based on the specified entity model, fields and filters.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the request query string.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getRequestQuery(model, query, fields) {
        throw new Error(`Method 'getRequestQuery' doesn't implemented.`);
    }
    /**
     * Gets the request method based on the specified entity model.
     * @param model Entity model.
     * @param method Request method.
     * @returns Returns the request method.
     */
    getRequestMethod(model, method) {
        return method;
    }
    /**
     * Gets the result Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the insert result or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getInsertResponse(model, response) {
        throw new Error(`Method 'getInsertResponse' doesn't implemented.`);
    }
    /**
     * Gets the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getFindResponse(model, response) {
        throw new Error(`Method 'getFindResponse' doesn't implemented.`);
    }
    /**
     * Gets the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity, a promise to get it or undefined when the entity wasn't found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getFindByIdResponse(model, response) {
        throw new Error(`Method 'getFindByIdResponse' doesn't implemented.`);
    }
    /**
     * Gets the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getUpdateResponse(model, response) {
        throw new Error(`Method 'getUpdateResponse' doesn't implemented.`);
    }
    /**
     * Gets the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getUpdateByIdResponse(model, response) {
        throw new Error(`Method 'getUpdateByIdResponse' doesn't implemented.`);
    }
    /**
     * Gets the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getReplaceByIdResponse(model, response) {
        throw new Error(`Method 'getReplaceByIdResponse' doesn't implemented.`);
    }
    /**
     * Gets the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getDeleteResponse(model, response) {
        throw new Error(`Method 'getDeleteResponse' doesn't implemented.`);
    }
    /**
     * Gets the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getDeleteByIdResponse(model, response) {
        throw new Error(`Method 'getDeleteByIdResponse' doesn't implemented.`);
    }
    /**
     * Gets the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getCountResponse(model, response) {
        throw new Error(`Method 'getCountResponse' doesn't implemented.`);
    }
    /**
     * Gets a new request path based on the specified route entity.
     * @param route Route entity.
     * @returns Returns the generated request path.
     */
    getRequestPath(route) {
        var _a;
        const assigned = {};
        const endpoint = (_a = route.path) !== null && _a !== void 0 ? _a : Types.Schema.getStorageName(route.model);
        let path = endpoint.replace(/{query}|{id}/gi, (match) => {
            const variable = match.substr(1, match.length - 2);
            const value = route[variable];
            if (value !== void 0) {
                return (assigned[variable] = true), value;
            }
            return '';
        });
        if (!assigned.id && route.id !== void 0 && route.id.length > 0) {
            path += `/${route.id}`;
        }
        if (!assigned.query && route.query !== void 0 && route.query.length > 0) {
            path += `/${route.query}`;
        }
        return Path.normalize(path);
    }
    /**
     * Send an HTTP request and gets the response.
     * @param method Request method.
     * @param path Request path.
     * @param payload Request payload.
     * @returns Returns a promise to get the response output.
     */
    getRequestResponse(method, path, payload) {
        const input = {
            url: `${this.apiUrl}/${path}`,
            method: method,
            payload: payload,
            headers: { ...this.apiHeaders }
        };
        if (typeof window === typeof void 0) {
            return Requests.Backend.request(input);
        }
        return Requests.Frontend.request(input);
    }
    /**
     * Sets a new request header.
     * @param name Header name.
     * @param value Header value.
     * @returns Returns its own instance.
     */
    setHeader(name, value) {
        return (this.apiHeaders[name] = value), this;
    }
    /**
     * Removes the specified header.
     * @param name Header name.
     * @returns Returns its own instance.
     */
    removeHeader(name) {
        return delete this.apiHeaders[name], this;
    }
    /**
     * Notify an error in the given response entity for all listeners.
     * @param model Entity model.
     * @param response Response entity.
     */
    async notifyErrorResponse(model, response) {
        await this.apiErrors.notifyAll(response);
    }
    /**
     * Gets the error subject.
     */
    get onError() {
        return this.apiErrors;
    }
    /**
     * Connect to the API.
     * @param url Api URL.
     */
    async connect(url) {
        this.apiUrl = url;
    }
    /**
     * Request data from the API using the given details.
     * @param details Request details.
     * @returns Returns a promise to get the payload data.
     * @throws Throw an error when the status code isn't acceptable.
     */
    async read(details) {
        var _a;
        const response = await this.getRequestResponse((_a = details.method) !== null && _a !== void 0 ? _a : method_1.Method.GET, details.path);
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            throw new Error(`Unexpected status code: ${response.status.code}`);
        }
        return response.payload;
    }
    /**
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @param options Insert options.
     * @returns Returns a promise to get the insert results.
     * @throws Throws an error when the result payload doesn't contains the insertion id.
     */
    async insert(model, entities, options) {
        var _a;
        const method = this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.POST);
        const path = this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model)
        });
        const list = [];
        for (const entity of entities) {
            const payload = Types.Normalizer.create(model, entity, true, true);
            const response = await this.getRequestResponse(method, path, payload);
            if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
                const result = await this.getInsertResponse(model, response);
                if (result !== void 0) {
                    list.push(result);
                }
            }
            else {
                await this.notifyErrorResponse(model, response);
            }
        }
        return list;
    }
    /**
     * Search for all entities that corresponds to the specified filter using a GET request.
     * @param model Model type.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @param options Find options.
     * @returns Returns a promise to get the list of found entities.
     * @throws Throws an error when the result payload isn't an array.
     */
    async find(model, query, fields, options) {
        var _a;
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.GET), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model, query, fields)
        }));
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getFindResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), [];
    }
    /**
     * Find the entity that corresponds to the specified Id using a GET request.
     * @param model Model type.
     * @param id Entity Id.
     * @param fields Viewed fields.
     * @param options Find options.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, id, fields, options) {
        var _a;
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.GET), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model, void 0, fields),
            id: this.getRequestId(model, id)
        }));
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getFindByIdResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), void 0;
    }
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param match Matching fields.
     * @param entity Entity data.
     * @param options Update options.
     * @returns Returns a promise to get the number of updated entities.
     */
    async update(model, match, entity, options) {
        var _a;
        const payload = Types.Normalizer.create(model, entity, true, true);
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.PATCH), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model, { pre: match })
        }), payload);
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getUpdateResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), 0;
    }
    /**
     * Update the entity that corresponds to the specified Id using a PATCH request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @param options Update options.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, id, entity, options) {
        var _a;
        const payload = Types.Normalizer.create(model, entity, true, true);
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.PATCH), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model),
            id: this.getRequestId(model, id)
        }), payload);
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getUpdateByIdResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), false;
    }
    /**
     * Replace the entity that corresponds to the specified Id using a PUT request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @param options Replace options.
     * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
     */
    async replaceById(model, id, entity, options) {
        var _a;
        const payload = Types.Normalizer.create(model, entity, true, true);
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.PUT), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model),
            id: this.getRequestId(model, id)
        }), payload);
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getReplaceByIdResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), false;
    }
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @param options Delete options.
     * @return Returns a promise to get the number of deleted entities.
     */
    async delete(model, match, options) {
        var _a;
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.DELETE), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model, { pre: match })
        }));
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getDeleteResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), 0;
    }
    /**
     * Delete the entity that corresponds to the specified Id using a DELETE request.
     * @param model Model type.
     * @param id Entity Id.
     * @param options Delete options.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, id, options) {
        var _a;
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.DELETE), this.getRequestPath({
            model: model,
            path: options.path,
            id: this.getRequestId(model, id)
        }));
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getDeleteByIdResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), false;
    }
    /**
     * Count all corresponding entities using the a HEAD request.
     * @param model Model type.
     * @param query Query filter.
     * @param options Count options.
     * @returns Returns a promise to get the amount of found entities or 0 when there's an error.
     */
    async count(model, query, options) {
        var _a;
        const response = await this.getRequestResponse(this.getRequestMethod(model, (_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.HEAD), this.getRequestPath({
            model: model,
            path: options.path,
            query: this.getRequestQuery(model, query)
        }));
        if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            return await this.getCountResponse(model, response);
        }
        return await this.notifyErrorResponse(model, response), 0;
    }
};
__decorate([
    Class.Private()
], Driver.prototype, "apiUrl", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiHeaders", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiErrors", void 0);
__decorate([
    Class.Protected()
], Driver.prototype, "getRequestId", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getRequestQuery", null);
__decorate([
    Class.Protected()
], Driver.prototype, "getRequestMethod", null);
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
    Class.Private()
], Driver.prototype, "getRequestPath", null);
__decorate([
    Class.Private()
], Driver.prototype, "getRequestResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setHeader", null);
__decorate([
    Class.Protected()
], Driver.prototype, "removeHeader", null);
__decorate([
    Class.Protected()
], Driver.prototype, "notifyErrorResponse", null);
__decorate([
    Class.Public()
], Driver.prototype, "onError", null);
__decorate([
    Class.Public()
], Driver.prototype, "connect", null);
__decorate([
    Class.Public()
], Driver.prototype, "read", null);
__decorate([
    Class.Public()
], Driver.prototype, "insert", null);
__decorate([
    Class.Public()
], Driver.prototype, "find", null);
__decorate([
    Class.Public()
], Driver.prototype, "findById", null);
__decorate([
    Class.Public()
], Driver.prototype, "update", null);
__decorate([
    Class.Public()
], Driver.prototype, "updateById", null);
__decorate([
    Class.Public()
], Driver.prototype, "replaceById", null);
__decorate([
    Class.Public()
], Driver.prototype, "delete", null);
__decorate([
    Class.Public()
], Driver.prototype, "deleteById", null);
__decorate([
    Class.Public()
], Driver.prototype, "count", null);
Driver = __decorate([
    Class.Describe()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=driver.js.map