"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Observable = require("@singleware/observable");
const Mapping = require("@singleware/mapping");
const Path = require("@singleware/path");
const Request = require("./request");
const filters_1 = require("./filters");
const entity_1 = require("./entity");
/**
 * Data driver class.
 */
let Driver = class Driver extends Class.Null {
    /**
     * Data driver class.
     */
    constructor() {
        super(...arguments);
        /**
         * Header name for the authentication key.
         */
        this.apiKeyHeader = 'x-api-key';
        /**
         * Header name for the counting results.
         */
        this.apiCountHeader = 'x-api-count';
        /**
         * Subject to notify any API error.
         */
        this.errorSubject = new Observable.Subject();
    }
    /**
     * Send an HTTP request.
     * @param method Request method.
     * @param path Request path.
     * @param content Request content.
     * @returns Returns a promise to get the response output.
     */
    request(method, path, content) {
        const input = {
            url: `${this.apiUrl}${path}`,
            method: method,
            content: content ? entity_1.Entity.extractMap(content) : void 0,
            headers: {}
        };
        if (this.apiKey) {
            input.headers[this.apiKeyHeader] = this.apiKey;
        }
        return window !== void 0 ? Request.Frontend.request(input) : Request.Backend.request(input);
    }
    /**
     * Gets a new request path based on the specified route entity.
     * @param route Route entity.
     * @returns Returns the generated request path.
     */
    getPath(route) {
        const assigned = {};
        const path = Mapping.Schema.getStorage(route.model).replace(/{query}|{id}/g, (match) => {
            const name = match.substr(1, match.length - 2);
            const variable = route[name];
            return variable !== void 0 ? ((assigned[name] = true), variable) : '';
        });
        if (!assigned.id && route.id !== void 0 && route.id.length > 0) {
            return Path.normalize(`/${path}/${route.id}`);
        }
        else if (!assigned.query && route.query !== void 0 && route.query.length > 0) {
            return Path.normalize(`/${path}/${route.query}`);
        }
        return Path.normalize(`/${path}`);
    }
    /**
     * Gets the error subject.
     */
    get onErrors() {
        return this.errorSubject;
    }
    /**
     * Gets the last error response.
     */
    get lastError() {
        return this.errorResponse;
    }
    /**
     * Sets a new API key for the subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path) {
        this.apiKey = path;
        return this;
    }
    /**
     * Sets a new API key header for the subsequent requests.
     * @param header New API key header name.
     * @returns Returns the own instance.
     */
    useKeyHeaderName(header) {
        this.apiKeyHeader = header;
        return this;
    }
    /**
     * Sets a new API count header for the subsequent requests.
     * @param header New API count header name.
     * @returns Returns the own instance.
     */
    useCountHeaderName(header) {
        this.apiCountHeader = header.toLowerCase();
        return this;
    }
    /**
     * Connect to the API.
     * @param url Api URL.
     * @param key Api key.
     */
    async connect(url, key) {
        this.apiUrl = url;
        this.apiKey = key;
    }
    /**
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param views View modes.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     * @throws Throws an error when the result body doesn't contains the insertion id.
     */
    async insert(model, views, entities) {
        const list = [];
        const path = this.getPath({ model: model, query: filters_1.Filters.toURL(model, views) });
        for (const entity of entities) {
            const response = await this.request('POST', path, entity);
            if (response.status.code !== 201 && response.status.code !== 202) {
                await this.errorSubject.notifyAll((this.errorResponse = response));
            }
            else if (!(response.body instanceof Object) || typeof response.body.id !== 'string') {
                throw new Error(`The response body must be an object containing the insertion id.`);
            }
            else {
                list.push(response.body.id);
            }
        }
        return list;
    }
    /**
     * Search for all entities that corresponds to the specified filter using a GET request.
     * @param model Model type.
     * @param views View modes.
     * @param filter Fields filter.
     * @returns Returns a promise to get the list of found entities.
     * @throws Throws an error when the result body isn't an array.
     */
    async find(model, views, filter) {
        const path = this.getPath({ model: model, query: filters_1.Filters.toURL(model, views, filter) });
        const response = await this.request('GET', path);
        if (response.status.code !== 200) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), [];
        }
        else if (!(response.body instanceof Array)) {
            throw new Error(`The response body must be an array containing the search result.`);
        }
        return response.body;
    }
    /**
     * Find the entity that corresponds to the specified id using a GET request.
     * @param model Model type.
     * @param views View modes.
     * @param id Entity id.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, views, id) {
        const path = this.getPath({ model: model, id: id.toString(), query: filters_1.Filters.toURL(model, views) });
        const response = await this.request('GET', path);
        if (response.status.code !== 200) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), void 0;
        }
        return response.body;
    }
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param views View modes.
     * @param match Matching fields.
     * @param entity Entity data.
     * @returns Returns a promise to get the number of updated entities.
     */
    async update(model, views, match, entity) {
        const path = this.getPath({ model: model, query: filters_1.Filters.toURL(model, views, { pre: match }) });
        const response = await this.request('PATCH', path, entity);
        if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), 0;
        }
        return parseInt(response.headers[this.apiCountHeader]) || 0;
    }
    /**
     * Update the entity that corresponds to the specified id using a PATCH request.
     * @param model Model type.
     * @param views View modes.
     * @param id Entity id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, views, id, entity) {
        const path = this.getPath({ model: model, id: id.toString(), query: filters_1.Filters.toURL(model, views) });
        const response = await this.request('PATCH', path, entity);
        if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), false;
        }
        return true;
    }
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @return Returns a promise to get the number of deleted entities.
     */
    async delete(model, match) {
        const path = this.getPath({ model: model, query: filters_1.Filters.toURL(model, [], { pre: match }) });
        const response = await this.request('DELETE', path);
        if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), 0;
        }
        return parseInt(response.headers[this.apiCountHeader]) || 0;
    }
    /**
     * Delete the entity that corresponds to the specified id using a DELETE request.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, id) {
        const path = this.getPath({ model: model, id: id.toString() });
        const response = await this.request('DELETE', path);
        if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), false;
        }
        return true;
    }
    /**
     * Count all corresponding entities using the a HEAD request.
     * @param model Model type.
     * @param views View modes.
     * @param filter Field filter.
     * @returns Returns a promise to get the total amount of found entities.
     */
    async count(model, views, filter) {
        const path = this.getPath({ model: model, query: filters_1.Filters.toURL(model, views, filter) });
        const response = await this.request('HEAD', path);
        if (response.status.code !== 200 && response.status.code !== 204) {
            return await this.errorSubject.notifyAll((this.errorResponse = response)), 0;
        }
        return parseInt(response.headers[this.apiCountHeader]) || 0;
    }
};
__decorate([
    Class.Private()
], Driver.prototype, "apiUrl", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiKey", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiKeyHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiCountHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "errorResponse", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "errorSubject", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "request", null);
__decorate([
    Class.Private()
], Driver.prototype, "getPath", null);
__decorate([
    Class.Public()
], Driver.prototype, "onErrors", null);
__decorate([
    Class.Public()
], Driver.prototype, "lastError", null);
__decorate([
    Class.Public()
], Driver.prototype, "useKey", null);
__decorate([
    Class.Public()
], Driver.prototype, "useKeyHeaderName", null);
__decorate([
    Class.Public()
], Driver.prototype, "useCountHeaderName", null);
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
