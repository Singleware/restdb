"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Observable = require("@singleware/observable");
const Mapping = require("@singleware/mapping");
const Path = require("@singleware/path");
const entity_1 = require("./entity");
const search_1 = require("./search");
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
         * Subject to notify any API error.
         */
        this.apiErrorSubject = new Observable.Subject();
    }
    /**
     * Call an HTTP request using native browser methods (frontend).
     * @param method Request method.
     * @param path Request path.
     * @param headers Request headers.
     * @param content Request content.
     * @returns Returns a promise to get the request response.
     */
    async frontCall(method, path, headers, content) {
        const response = await fetch(`${this.apiUrl}/${path}`, {
            method: method,
            headers: new Headers(headers),
            body: content ? JSON.stringify(content) : void 0
        });
        const body = await response.text();
        return {
            request: {
                url: response.url,
                body: content
            },
            statusCode: response.status,
            statusText: response.statusText,
            body: body.length > 0 ? JSON.parse(body) : void 0
        };
    }
    /**
     * Call an HTTP request using native nodejs methods. (backend)
     * @param method Request method.
     * @param path Request path.
     * @param headers Request headers.
     * @param content Request content.
     * @returns Returns a promise to get the request response.
     */
    async backCall(method, path, headers, content) {
        const url = new URL(`${this.apiUrl}/${path}`);
        const client = require(url.protocol);
        let data;
        if (content) {
            data = JSON.stringify(content);
            headers['Content-Length'] = data.length;
        }
        return new Promise((resolve, reject) => {
            const request = client.request({
                method: method,
                headers: headers,
                protocol: url.protocol,
                port: url.port,
                host: url.hostname,
                path: url.pathname
            }, (response) => {
                let body = '';
                response.setEncoding('utf8');
                response.on('error', (error) => {
                    reject(error);
                });
                response.on('data', (data) => {
                    body += data;
                });
                response.on('end', () => {
                    resolve({
                        request: {
                            url: response.url,
                            body: content
                        },
                        statusCode: response.statusCode,
                        statusText: response.statusText,
                        body: body.length > 0 ? JSON.parse(body) : void 0
                    });
                });
            });
            if (data) {
                request.write(data);
                request.end();
            }
        });
    }
    /**
     * Send an HTTP request.
     * @param method Request method.
     * @param path Request path.
     * @param body Request body.
     * @returns Returns a promise to get the request response.
     */
    request(method, path, body) {
        const headers = {};
        const content = body ? entity_1.Entity.extractMap(body) : void 0;
        if (this.apiKey) {
            headers['X-API-Key'] = this.apiKey;
        }
        if (typeof window !== typeof void 0) {
            return this.frontCall(method, path, headers, content);
        }
        return this.backCall(method, path, headers, content);
    }
    /**
     * Gets a new request path based on the specified model type.
     * @param model Mode type.
     * @param complement Path complement.
     * @returns Returns the generated path.
     * @throws Throws an error when the model type is not valid.
     */
    getPath(model, complement) {
        let path = Mapping.Schema.getStorage(model);
        if (!path) {
            throw new Error(`There is no path for the specified model entity.`);
        }
        else if (this.apiPath) {
            path += `/${Path.normalize(this.apiPath.replace('%0', complement || ''))}`;
            this.apiPath = void 0;
        }
        else if (complement) {
            path += `/${complement}`;
        }
        return Path.normalize(path);
    }
    /**
     * Gets the error subject.
     */
    get onErrors() {
        return this.apiErrorSubject;
    }
    /**
     * Gets the last error response.
     */
    get lastError() {
        return this.apiErrorResponse;
    }
    /**
     * Sets the new API key for subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path) {
        this.apiKey = path;
        return this;
    }
    /**
     * Sets a temporary path for the next request.
     * Use: %0 to set the complementary path string.
     * @param path Path to be set.
     * @returns Returns the own instance.
     */
    usePath(path) {
        this.apiPath = path;
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
     * Insert the specified entity by POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     */
    async insert(model, entities) {
        const list = [];
        for (const entity of entities) {
            const response = await this.request('POST', this.getPath(model), entity);
            if (response.statusCode === 201) {
                if (!(response.body instanceof Object) || typeof response.body.id !== 'string') {
                    throw new Error(`The body must be an object containing the inserted result id.`);
                }
                list.push(response.body.id);
            }
            else {
                this.apiErrorResponse = response;
                await this.apiErrorSubject.notifyAll(response);
            }
        }
        return list;
    }
    /**
     * Search for the corresponding entities by GET request.
     * @param model Model type.
     * @param joins List of joins (Not supported).
     * @param filter Fields filter.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns a promise to get the list of entities found.
     */
    async find(model, joins, filter, sort, limit) {
        const response = await this.request('GET', this.getPath(model, search_1.Search.toURL(model, [filter], sort, limit)));
        if (response.statusCode === 200) {
            if (!(response.body instanceof Array)) {
                throw new Error(`The body must be an array containing the search results.`);
            }
            return response.body;
        }
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
        return [];
    }
    /**
     * Find the entity that corresponds to the specified entity id by GET request.
     * @param model Model type.
     * @param joins Joined columns (Not supported).
     * @param id Entity id.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, joins, id) {
        const response = await this.request('GET', this.getPath(model, id));
        if (response.statusCode === 200) {
            return response.body;
        }
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
        return void 0;
    }
    /**
     * Update all entities that corresponds to the specified filter by PATCH request.
     * @param model Model type.
     * @param entity Entity data.
     * @param filter Fields filter.
     * @returns Returns a promise to get the number of updated entities.
     * @throws Throws an error when the response doesn't have the object with the total of updated results.
     */
    async update(model, entity, filter) {
        const response = await this.request('PATCH', this.getPath(model, search_1.Search.toURL(model, [filter])), entity);
        if (response.statusCode === 200) {
            if (!(response.body instanceof Object) || typeof response.body.total !== 'number') {
                throw new Error(`The body must be an object containing the total of updated results.`);
            }
            return response.body.total;
        }
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
        return 0;
    }
    /**
     * Update an entity that corresponds to the specified entity id by PATCH request.
     * @param model Model type.
     * @param entity Entity data.
     * @param id Entity id.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, entity, id) {
        const response = await this.request('PATCH', this.getPath(model, id), entity);
        if (response.statusCode === 200 || response.statusCode === 204) {
            return true;
        }
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
        return false;
    }
    /**
     * Delete all entities that corresponds to the specified filter by DELETE request.
     * @param model Model type.
     * @param filter Fields filter.
     * @return Returns a promise to get the number of deleted entities.
     * @throws Throws an error when the response doesn't have the object with the total of deleted results.
     */
    async delete(model, filter) {
        const response = await this.request('DELETE', this.getPath(model, search_1.Search.toURL(model, [filter])));
        if (response.statusCode === 200) {
            if (!(response.body instanceof Object) || typeof response.body.total !== 'number') {
                throw new Error(`The body must be an object containing the total of deleted results.`);
            }
            return response.body.total;
        }
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
        return 0;
    }
    /**
     * Delete an entity that corresponds to the specified id by DELETE request.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, id) {
        const response = await this.request('DELETE', this.getPath(model, id));
        if (response.statusCode === 200 || response.statusCode === 204) {
            return true;
        }
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
        return false;
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
], Driver.prototype, "apiPath", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiErrorResponse", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiErrorSubject", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "frontCall", null);
__decorate([
    Class.Private()
], Driver.prototype, "backCall", null);
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
], Driver.prototype, "usePath", null);
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
Driver = __decorate([
    Class.Describe()
], Driver);
exports.Driver = Driver;
