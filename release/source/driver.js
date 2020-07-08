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
         * API auth headers.
         */
        this.apiAuthHeaders = {};
    }
    /**
     * Get the insert result from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the insert result or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getInsertResponse(model, response) {
        throw new Error(`Method 'getInsertResponse' isn't implemented.`);
    }
    /**
     * Get the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getFindResponse(model, response) {
        throw new Error(`Method 'getFindResponse' isn't implemented.`);
    }
    /**
     * Get the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity, a promise to get it or undefined when the entity wasn't found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getFindByIdResponse(model, response) {
        throw new Error(`Method 'getFindByIdResponse' isn't implemented.`);
    }
    /**
     * Get the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getUpdateResponse(model, response) {
        throw new Error(`Method 'getUpdateResponse' isn't implemented.`);
    }
    /**
     * Get the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getUpdateByIdResponse(model, response) {
        throw new Error(`Method 'getUpdateByIdResponse' isn't implemented.`);
    }
    /**
     * Get the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getReplaceByIdResponse(model, response) {
        throw new Error(`Method 'getReplaceByIdResponse' isn't implemented.`);
    }
    /**
     * Get the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getDeleteResponse(model, response) {
        throw new Error(`Method 'getDeleteResponse' isn't implemented.`);
    }
    /**
     * Get the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getDeleteByIdResponse(model, response) {
        throw new Error(`Method 'getDeleteByIdResponse' isn't implemented.`);
    }
    /**
     * Get the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getCountResponse(model, response) {
        throw new Error(`Method 'getCountResponse' isn't implemented.`);
    }
    /**
     * Get the request query string based on the specified entity model, filters and fields.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Fields to select.
     * @returns Returns the request query string.
     * @throws It will always throws an error because it's not implemented yet.
     */
    getRequestQuery(model, query, fields) {
        throw new Error(`Method 'getRequestQuery' isn't implemented.`);
    }
    /**
     * Get the request Id based on the specified entity model and entity Id.
     * @param model Entity model.
     * @param id Entity Id.
     * @returns Returns the request Id.
     */
    getRequestId(model, id) {
        return id.toString();
    }
    /**
     * Get a new request path based on the specified route entity.
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
                assigned[variable] = true;
                return value;
            }
            return '';
        });
        if (!assigned.id && route.id) {
            path += `/${route.id}`;
        }
        if (!assigned.query && route.query) {
            path += `/${route.query}`;
        }
        return `${this.apiUrl}/${Path.normalize(path)}`;
    }
    /**
     * Send an HTTP request and gets the response.
     * @param method Request method.
     * @param path Request path.
     * @param auth Determines whether or not authentication is required.
     * @param payload Request payload.
     * @returns Returns a promise to get the response output.
     */
    getRequestResponse(method, path, auth, payload) {
        const input = {
            payload: payload,
            method: method,
            url: path,
            headers: {
                ...(auth !== false ? this.apiAuthHeaders : void 0),
                ...this.apiHeaders
            }
        };
        if (typeof window === typeof void 0) {
            return Requests.Backend.request(input);
        }
        return Requests.Frontend.request(input);
    }
    /**
     * Set a new authentication header.
     * @param name Header name.
     * @param value Header value.
     * @returns Returns the instance itself.
     */
    setAuthHeader(name, value) {
        this.apiAuthHeaders[name] = value;
        return this;
    }
    /**
     * Unset the specified authentication header.
     * @param name Header name.
     * @returns Returns the instance itself.
     */
    unsetAuthHeader(name) {
        delete this.apiAuthHeaders[name];
        return this;
    }
    /**
     * Connect to the API.
     * @param url Api URL.
     */
    async connect(url) {
        this.apiUrl = url;
    }
    /**
     * Sets a new request header.
     * @param name Header name.
     * @param value Header value.
     * @returns Returns the instance itself.
     */
    setHeader(name, value) {
        this.apiHeaders[name] = value;
        return this;
    }
    /**
     * Unset the specified header.
     * @param name Header name.
     * @returns Returns the instance itself.
     */
    unsetHeader(name) {
        delete this.apiHeaders[name];
        return this;
    }
    /**
     * Request data from the API using the given details.
     * @param details Request details.
     * @returns Returns a promise to get the payload data.
     * @throws Throws an error when the status code isn't acceptable.
     */
    async request(path, options, payload) {
        var _a;
        const response = await this.getRequestResponse((_a = options.method) !== null && _a !== void 0 ? _a : method_1.Method.GET, path, options.auth, payload);
        if (!Requests.Helper.isAcceptedStatusCode(response.status.code)) {
            throw new Error(`${response.status.code} ${response.status.message}`);
        }
        return response;
    }
    /**
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @param options Insert options.
     * @returns Returns a promise to get the insert results.
     * @throws Throws an error when the server response is invalid.
     */
    async insert(model, entities, options) {
        const path = this.getRequestPath({
            query: this.getRequestQuery(model),
            path: options.path,
            model: model
        });
        const list = [];
        for (const entity of entities) {
            const payload = Types.Normalizer.create(model, entity, true, true);
            const response = await this.getInsertResponse(model, await this.request(path, {
                method: method_1.Method.POST,
                ...options
            }, payload));
            if (response !== void 0) {
                list.push(response);
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
     * @throws Throws an error when the server response is invalid.
     */
    async find(model, query, fields, options) {
        const path = this.getRequestPath({
            query: this.getRequestQuery(model, query, fields),
            path: options.path,
            model: model
        });
        return this.getFindResponse(model, await this.request(path, {
            method: method_1.Method.GET,
            ...options
        }));
    }
    /**
     * Find the entity that corresponds to the specified Id using a GET request.
     * @param model Model type.
     * @param id Entity Id.
     * @param fields Viewed fields.
     * @param options Find options.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     * @throws Throws an error when the server response is invalid.
     */
    async findById(model, id, fields, options) {
        const path = this.getRequestPath({
            id: this.getRequestId(model, id),
            query: this.getRequestQuery(model, void 0, fields),
            path: options.path,
            model: model
        });
        return this.getFindByIdResponse(model, await this.request(path, {
            method: method_1.Method.GET,
            ...options
        }));
    }
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param match Matching fields.
     * @param entity Entity data.
     * @param options Update options.
     * @returns Returns a promise to get the number of updated entities.
     * @throws Throws an error when the server response is invalid.
     */
    async update(model, match, entity, options) {
        const payload = Types.Normalizer.create(model, entity, true, true);
        const path = this.getRequestPath({
            query: this.getRequestQuery(model, { pre: match }),
            path: options.path,
            model: model
        });
        return this.getUpdateResponse(model, await this.request(path, {
            method: method_1.Method.PATCH,
            ...options
        }, payload));
    }
    /**
     * Update the entity that corresponds to the specified Id using a PATCH request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @param options Update options.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     * @throws Throws an error when the server response is invalid.
     */
    async updateById(model, id, entity, options) {
        const payload = Types.Normalizer.create(model, entity, true, true);
        const path = this.getRequestPath({
            id: this.getRequestId(model, id),
            query: this.getRequestQuery(model),
            path: options.path,
            model: model
        });
        return this.getUpdateByIdResponse(model, await this.request(path, {
            method: method_1.Method.PATCH,
            ...options
        }, payload));
    }
    /**
     * Replace the entity that corresponds to the specified Id using a PUT request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @param options Replace options.
     * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
     * @throws Throws an error when the server response is invalid.
     */
    async replaceById(model, id, entity, options) {
        const payload = Types.Normalizer.create(model, entity, true, true);
        const path = this.getRequestPath({
            id: this.getRequestId(model, id),
            query: this.getRequestQuery(model),
            path: options.path,
            model: model
        });
        return this.getReplaceByIdResponse(model, await this.request(path, {
            method: method_1.Method.PUT,
            ...options
        }, payload));
    }
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @param options Delete options.
     * @return Returns a promise to get the number of deleted entities.
     * @throws Throws an error when the server response is invalid.
     */
    async delete(model, match, options) {
        const path = this.getRequestPath({
            query: this.getRequestQuery(model, { pre: match }),
            path: options.path,
            model: model
        });
        return this.getDeleteResponse(model, await this.request(path, {
            method: method_1.Method.DELETE,
            ...options
        }));
    }
    /**
     * Delete the entity that corresponds to the specified Id using a DELETE request.
     * @param model Model type.
     * @param id Entity Id.
     * @param options Delete options.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     * @throws Throws an error when the server response is invalid.
     */
    async deleteById(model, id, options) {
        const path = this.getRequestPath({
            id: this.getRequestId(model, id),
            path: options.path,
            model: model
        });
        return this.getDeleteByIdResponse(model, await this.request(path, {
            method: method_1.Method.DELETE,
            ...options
        }));
    }
    /**
     * Count all corresponding entities using the a HEAD request.
     * @param model Model type.
     * @param query Query filter.
     * @param options Count options.
     * @returns Returns a promise to get the amount of entities.
     * @throws Throws an error when the server response is invalid.
     */
    async count(model, query, options) {
        const path = this.getRequestPath({
            query: this.getRequestQuery(model, query),
            path: options.path,
            model: model
        });
        return this.getCountResponse(model, await this.request(path, {
            method: method_1.Method.HEAD,
            ...options
        }));
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
], Driver.prototype, "apiAuthHeaders", void 0);
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
], Driver.prototype, "getRequestId", null);
__decorate([
    Class.Private()
], Driver.prototype, "getRequestPath", null);
__decorate([
    Class.Private()
], Driver.prototype, "getRequestResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setAuthHeader", null);
__decorate([
    Class.Protected()
], Driver.prototype, "unsetAuthHeader", null);
__decorate([
    Class.Public()
], Driver.prototype, "connect", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setHeader", null);
__decorate([
    Class.Protected()
], Driver.prototype, "unsetHeader", null);
__decorate([
    Class.Public()
], Driver.prototype, "request", null);
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