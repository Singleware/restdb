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
const Observable = require("@singleware/observable");
const Path = require("@singleware/path");
const Request = require("./request");
const Aliases = require("./aliases");
/**
 * Generic driver class.
 */
let Driver = class Driver extends Class.Null {
    /**
     * Generic driver class.
     */
    constructor() {
        super(...arguments);
        /**
         * Header name for authenticated requests.
         */
        this.apiKeyHeader = 'x-api-key';
        /**
         * Subject to notify any API error.
         */
        this.errorSubject = new Observable.Subject();
    }
    /**
     * Gets a new request path based on the specified route entity.
     * @param route Route entity.
     * @returns Returns the generated request path.
     */
    getRequestPath(route) {
        const assigned = {};
        const endpoint = Aliases.Schema.getStorageName(route.model);
        let path = endpoint.replace(/{query}|{id}/gi, (match) => {
            const variable = match.substr(1, match.length - 2);
            const value = route[variable];
            if (value !== void 0) {
                assigned[variable] = true;
                return value;
            }
            return '';
        });
        if (!assigned.id && route.id !== void 0 && route.id.length > 0) {
            path += `/${route.id}`;
        }
        if (!assigned.query && route.query !== void 0 && route.query.length > 0) {
            path += `/${route.query}`;
        }
        return Path.normalize(`${path}`);
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
            payload: payload
        };
        if (this.apiKeyValue) {
            input.headers = {};
            input.headers[this.apiKeyHeader] = this.apiKeyValue;
        }
        if (typeof window !== 'undefined') {
            return Request.Frontend.request(input);
        }
        return Request.Backend.request(input);
    }
    /**
     * Parses the request Id based on the specified entity model and entity Id.
     * @param model Entity model.
     * @param id Entity Id.
     * @returns Returns the parsed entity Id.
     */
    parseRequestId(model, id) {
        return id.toString();
    }
    /**
     * Parses the request query string based on the specified entity model, fields and filters.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the parsed query string.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseRequestQuery(model, query, fields) {
        throw new Error(`Method 'parseRequestQuery' doesn't implemented.`);
    }
    /**
     * Parses the inserted Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the inserted Id, a promise to get or undefined when the inserted Id was not found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseInsertResponse(model, response) {
        throw new Error(`Method 'parseInsertResponse' doesn't implemented.`);
    }
    /**
     * Parses the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseFindResponse(model, response) {
        throw new Error(`Method 'parseFindResponse' doesn't implemented.`);
    }
    /**
     * Parses the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity, a promise to get it or undefined when the entity was not found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseFindByIdResponse(model, response) {
        throw new Error(`Method 'parseFindByIdResponse' doesn't implemented.`);
    }
    /**
     * Parses the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseUpdateResponse(model, response) {
        throw new Error(`Method 'parseUpdateResponse' doesn't implemented.`);
    }
    /**
     * Parses the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseUpdateByIdResponse(model, response) {
        throw new Error(`Method 'parseUpdateByIdResponse' doesn't implemented.`);
    }
    /**
     * Parses the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseReplaceByIdResponse(model, response) {
        throw new Error(`Method 'parseReplaceByIdResponse' doesn't implemented.`);
    }
    /**
     * Parses the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseDeleteResponse(model, response) {
        throw new Error(`Method 'parseDeleteResponse' doesn't implemented.`);
    }
    /**
     * Parses the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseDeleteByIdResponse(model, response) {
        throw new Error(`Method 'parseDeleteByIdResponse' doesn't implemented.`);
    }
    /**
     * Parses the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    parseCountResponse(model, response) {
        throw new Error(`Method 'parseCountResponse' doesn't implemented.`);
    }
    /**
     * Parses the error response from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     */
    parseErrorResponse(model, response) {
        this.errorSubject.notifyAll(response);
    }
    /**
     * Sets a new key header name for the subsequent requests.
     * @param name New header name.
     * @returns Returns the own instance.
     */
    setKeyHeaderName(name) {
        this.apiKeyHeader = name;
        return this;
    }
    /**
     * Sets a new key header value for the subsequent requests.
     * @param value New header value.
     * @returns Returns the own instance.
     */
    setKeyHeaderValue(value) {
        this.apiKeyValue = value;
        return this;
    }
    /**
     * Sets a new key header name and value for the subsequent requests.
     * @param name New header name.
     * @param value New header value.
     * @returns Returns the own instance.
     */
    setKeyHeader(name, value) {
        this.apiKeyHeader = name;
        this.apiKeyValue = value;
        return this;
    }
    /**
     * Gets the error subject.
     */
    get onErrors() {
        return this.errorSubject;
    }
    /**
     * Connect to the API.
     * @param url Api URL.
     */
    async connect(url) {
        this.apiUrl = url;
    }
    /**
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     * @throws Throws an error when the result payload doesn't contains the insertion id.
     */
    async insert(model, entities) {
        const list = [];
        const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model) });
        for (const entity of entities) {
            const payload = Aliases.Normalizer.create(model, entity, true);
            const response = await this.getRequestResponse('POST', path, payload);
            if (response.status.code === 200 || response.status.code === 201 || response.status.code === 202) {
                const id = await this.parseInsertResponse(model, response);
                if (id !== void 0) {
                    list.push(id);
                }
            }
            else {
                this.parseErrorResponse(model, response);
            }
        }
        return list;
    }
    /**
     * Search for all entities that corresponds to the specified filter using a GET request.
     * @param model Model type.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns a promise to get the list of found entities.
     * @throws Throws an error when the result payload isn't an array.
     */
    async find(model, query, fields) {
        const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, query, fields) });
        const response = await this.getRequestResponse('GET', path);
        if (response.status.code === 200) {
            return await this.parseFindResponse(model, response);
        }
        return this.parseErrorResponse(model, response), [];
    }
    /**
     * Find the entity that corresponds to the specified Id using a GET request.
     * @param model Model type.
     * @param id Entity Id.
     * @param fields Viewed fields.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, id, fields) {
        const target = this.parseRequestId(model, id);
        const query = this.parseRequestQuery(model, void 0, fields);
        const path = this.getRequestPath({ model: model, id: target, query: query });
        const response = await this.getRequestResponse('GET', path);
        if (response.status.code === 200) {
            return await this.parseFindByIdResponse(model, response);
        }
        return this.parseErrorResponse(model, response), void 0;
    }
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param match Matching fields.
     * @param entity Entity data.
     * @returns Returns a promise to get the number of updated entities.
     */
    async update(model, match, entity) {
        const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, { pre: match }) });
        const payload = Aliases.Normalizer.create(model, entity, true);
        const response = await this.getRequestResponse('PATCH', path, payload);
        if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
            return await this.parseUpdateResponse(model, response);
        }
        return this.parseErrorResponse(model, response), 0;
    }
    /**
     * Update the entity that corresponds to the specified Id using a PATCH request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, id, entity) {
        const path = this.getRequestPath({ model: model, id: this.parseRequestId(model, id), query: this.parseRequestQuery(model) });
        const payload = Aliases.Normalizer.create(model, entity, true);
        const response = await this.getRequestResponse('PATCH', path, payload);
        if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
            return await this.parseUpdateByIdResponse(model, response);
        }
        return this.parseErrorResponse(model, response), false;
    }
    /**
     * Replace the entity that corresponds to the specified Id using a PUT request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
     */
    async replaceById(model, id, entity) {
        const path = this.getRequestPath({ model: model, id: this.parseRequestId(model, id), query: this.parseRequestQuery(model) });
        const payload = Aliases.Normalizer.create(model, entity, true);
        const response = await this.getRequestResponse('PUT', path, payload);
        if (response.status.code === 200 || response.status.code === 201 || response.status.code === 202) {
            return await this.parseReplaceByIdResponse(model, response);
        }
        return this.parseErrorResponse(model, response), false;
    }
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @return Returns a promise to get the number of deleted entities.
     */
    async delete(model, match) {
        const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, { pre: match }) });
        const response = await this.getRequestResponse('DELETE', path);
        if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
            return await this.parseDeleteResponse(model, response);
        }
        return this.parseErrorResponse(model, response), 0;
    }
    /**
     * Delete the entity that corresponds to the specified Id using a DELETE request.
     * @param model Model type.
     * @param id Entity Id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, id) {
        const path = this.getRequestPath({ model: model, id: this.parseRequestId(model, id) });
        const response = await this.getRequestResponse('DELETE', path);
        if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
            return await this.parseDeleteByIdResponse(model, response);
        }
        return this.parseErrorResponse(model, response), false;
    }
    /**
     * Count all corresponding entities using the a HEAD request.
     * @param model Model type.
     * @param query Query filter.
     * @returns Returns a promise to get the total amount of found entities.
     */
    async count(model, query) {
        const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, query) });
        const response = await this.getRequestResponse('HEAD', path);
        if (response.status.code === 200 || response.status.code === 204) {
            return await this.parseCountResponse(model, response);
        }
        return this.parseErrorResponse(model, response), 0;
    }
};
__decorate([
    Class.Private()
], Driver.prototype, "apiUrl", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiKeyValue", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiKeyHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "errorSubject", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "getRequestPath", null);
__decorate([
    Class.Private()
], Driver.prototype, "getRequestResponse", null);
__decorate([
    Class.Protected()
], Driver.prototype, "parseRequestId", null);
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
], Driver.prototype, "setKeyHeaderName", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setKeyHeaderValue", null);
__decorate([
    Class.Protected()
], Driver.prototype, "setKeyHeader", null);
__decorate([
    Class.Public()
], Driver.prototype, "onErrors", null);
__decorate([
    Class.Public()
], Driver.prototype, "connect", null);
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