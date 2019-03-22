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
         * Header name for the authentication key.
         */
        this.apiHeader = 'X-API-Key';
        /**
         * Subject to notify any API error.
         */
        this.errorSubject = new Observable.Subject();
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
        const response = await fetch(`${this.apiUrl}${path}`, {
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
        const url = new URL(`${this.apiUrl}${path}`);
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
            headers[this.apiHeader] = this.apiKey;
        }
        if (typeof window !== typeof void 0) {
            return this.frontCall(method, path, headers, content);
        }
        return this.backCall(method, path, headers, content);
    }
    /**
     * Gets a new request path based on the specified route information.
     * @param route Route information.
     * @returns Returns the generated path.
     */
    getPath(route) {
        const variables = {
            model: `/${Mapping.Schema.getStorage(route.model)}`,
            query: route.query ? `/${route.query}` : '',
            id: route.id ? `/${route.id}` : ''
        };
        let path;
        if (this.apiPath) {
            path = this.apiPath.replace(/{model}|{id}|{query}/g, (match) => variables[match.substr(1, match.length - 2)]);
        }
        else {
            path = `${variables.model}${variables.id}${variables.query}`;
        }
        this.apiPath = void 0;
        return Path.normalize(path);
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
     * Sets a new API key for subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path) {
        this.apiKey = path;
        return this;
    }
    /**
     * Sets a new API key header for subsequent requests.
     * @param header New API key header.
     * @returns Returns the own instance.
     */
    useHeader(header) {
        this.apiHeader = header;
        return this;
    }
    /**
     * Sets a temporary path for the next request.
     * Use: {} to set the complementary path string.
     * @param path Path to be set.
     * @returns Returns the own instance.
     */
    usePath(path) {
        this.apiPath = Path.normalize(`/${path}`);
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
     * Insert the specified entity using the POST request.
     * @param model Model type.
     * @param views View modes.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     */
    async insert(model, views, entities) {
        const list = [];
        const path = this.getPath({ model: model, query: search_1.Search.toURL(model, views) });
        for (const entity of entities) {
            const response = await this.request('POST', path, entity);
            if (response.statusCode !== 201) {
                this.errorResponse = response;
                await this.errorSubject.notifyAll(response);
            }
            else if (!(response.body instanceof Object) || typeof response.body.id !== 'string') {
                throw new Error(`The response body must be an object containing the inserted id.`);
            }
            else {
                list.push(response.body.id);
            }
        }
        return list;
    }
    /**
     * Search for all entities that corresponds to the specified filters using the GET request.
     * @param model Model type.
     * @param views View modes.
     * @param filter Fields filter.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns a promise to get the list of entities found.
     */
    async find(model, views, filter, sort, limit) {
        const path = this.getPath({ model: model, query: search_1.Search.toURL(model, views, filter, sort, limit) });
        const response = await this.request('GET', path);
        if (response.statusCode !== 200) {
            this.errorResponse = response;
            await this.errorSubject.notifyAll(response);
            return [];
        }
        else if (!(response.body instanceof Array)) {
            throw new Error(`The response body must be an array containing the search results.`);
        }
        else {
            return response.body;
        }
    }
    /**
     * Find the entity that corresponds to the specified entity id using the GET request.
     * @param model Model type.
     * @param views View modes.
     * @param id Entity id.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, views, id) {
        const path = this.getPath({ model: model, id: id, query: search_1.Search.toURL(model, views) });
        const response = await this.request('GET', path);
        if (response.statusCode !== 200) {
            this.errorResponse = response;
            await this.errorSubject.notifyAll(response);
            return void 0;
        }
        else {
            return response.body;
        }
    }
    /**
     * Update all entities that corresponds to the specified filter using the PATCH request.
     * @param model Model type.
     * @param views View modes.
     * @param filter Fields filter.
     * @param entity Entity data.
     * @returns Returns a promise to get the number of updated entities.
     * @throws Throws an error when the response doesn't have the object with the total of updated results.
     */
    async update(model, views, filter, entity) {
        const path = this.getPath({ model: model, query: search_1.Search.toURL(model, views, filter) });
        const response = await this.request('PATCH', path, entity);
        if (response.statusCode !== 200) {
            this.errorResponse = response;
            await this.errorSubject.notifyAll(response);
            return 0;
        }
        else if (!(response.body instanceof Object) || typeof response.body.total !== 'number') {
            throw new Error(`The response body must be an object containing the total of updated results.`);
        }
        else {
            return response.body.total;
        }
    }
    /**
     * Update the entity that corresponds to the specified entity id using the PATCH request.
     * @param model Model type.
     * @param views View modes.
     * @param id Entity id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, views, id, entity) {
        const path = this.getPath({ model: model, id: id, query: search_1.Search.toURL(model, views) });
        const response = await this.request('PATCH', path, entity);
        if (response.statusCode !== 200 && response.statusCode !== 204) {
            this.errorResponse = response;
            await this.errorSubject.notifyAll(response);
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * Delete all entities that corresponds to the specified filter using the DELETE request.
     * @param model Model type.
     * @param filter Fields filter.
     * @return Returns a promise to get the number of deleted entities.
     * @throws Throws an error when the response doesn't have the object with the total of deleted results.
     */
    async delete(model, filter) {
        const path = this.getPath({ model: model, query: search_1.Search.toURL(model, [], filter) });
        const response = await this.request('DELETE', path);
        if (response.statusCode !== 200) {
            this.errorResponse = response;
            await this.errorSubject.notifyAll(response);
            return 0;
        }
        else if (!(response.body instanceof Object) || typeof response.body.total !== 'number') {
            throw new Error(`The body must be an object containing the total of deleted results.`);
        }
        else {
            return response.body.total;
        }
    }
    /**
     * Delete the entity that corresponds to the specified id using the DELETE request.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, id) {
        const path = this.getPath({ model: model, id: id });
        const response = await this.request('DELETE', path);
        if (response.statusCode !== 200 && response.statusCode !== 204) {
            this.errorResponse = response;
            await this.errorSubject.notifyAll(response);
            return false;
        }
        else {
            return true;
        }
    }
};
__decorate([
    Class.Private()
], Driver.prototype, "apiUrl", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiPath", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiKey", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "apiHeader", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "errorResponse", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "errorSubject", void 0);
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
], Driver.prototype, "useHeader", null);
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
