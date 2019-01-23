"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Driver_1;
"use strict";
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Mapping = require("@singleware/mapping");
const Path = require("@singleware/path");
const filters_1 = require("./filters");
/**
 * Data driver class.
 */
let Driver = Driver_1 = class Driver extends Class.Null {
    /**
     * Gets a new request path based on the specified model type.
     * @param model Mode type.
     * @param complement Path complement.
     * @returns Returns the generated path.
     * @throws Throws an error when the model type is not valid.
     */
    getPath(model, complement) {
        const path = Mapping.Schema.getStorage(model);
        if (!path) {
            throw new Error(`There is no path for the specified model entity.`);
        }
        if (this.extraPath) {
            return Path.normalize(`${path}/${this.extraPath.replace('%0', complement || '')}`);
        }
        return path;
    }
    /**
     * Extract all properties from the given entity list into a raw object list.
     * @param entities Entities list.
     * @returns Returns the new generated list.
     */
    static extractArray(entities) {
        const newer = [];
        for (const entity of entities) {
            newer.push(this.extractValue(entity));
        }
        return newer;
    }
    /**
     * Extract all properties from the given entity into a raw object map.
     * @param entity Entity data.
     * @returns Returns the new generated object.
     */
    static extractObject(entity) {
        const newer = {};
        for (const column in entity) {
            newer[column] = this.extractValue(entity[column]);
        }
        return newer;
    }
    /**
     * Extract the value from the given entity into a raw value.
     * @param value Value to be extracted.
     * @returns Returns the new generated object.
     */
    static extractValue(value) {
        if (value instanceof Array) {
            return this.extractArray(value);
        }
        else if (value instanceof Object) {
            return this.extractObject(value);
        }
        return value;
    }
    /**
     * Send an HTTP request.
     * @param method Request method.
     * @param path Request path.
     * @param body Request body.
     * @returns Returns a promise to get the HTTP response.
     */
    async request(method, path, body) {
        const options = { method: method, headers: new Headers() };
        if (this.apiKey) {
            options.headers.append('X-API-Key', this.apiKey);
        }
        if (body) {
            options.body = JSON.stringify(Driver_1.extractObject(body));
        }
        return await fetch(`${this.apiUrl}/${path}`, options);
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
     * Set a temporary path for the next request.
     * Use: %0 to set the complementary path string.
     * @param path Path to be set.
     * @returns Returns the own instance.
     */
    usePath(path) {
        this.extraPath = path;
        return this;
    }
    /**
     * Insert the specified entity into the API.
     * @param model Model type.
     * @param entities Entity data list.
     * @returns Returns the list inserted entities.
     */
    async insert(model, entities) {
        const list = [];
        for (const entity of entities) {
            const response = await this.request('POST', this.getPath(model), entity);
            if (response.status === 201) {
                list.push((await response.json()).id);
            }
        }
        return list;
    }
    /**
     * Find the corresponding entity from the API.
     * @param model Model type.
     * @param filter Filter expression.
     * @param joins Joined columns.
     * @returns Returns the list of entities found.
     */
    async find(model, joins, filters, sort, limit) {
        const urlFilter = filters_1.Filters.toURL(model, filters[0]);
        const response = await this.request('GET', this.getPath(model, urlFilter));
        return response.status === 200 ? await response.json() : [];
    }
    /**
     * Find the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id value.
     * @param aggregate Joined columns.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, joins, id) {
        const response = await this.request('GET', this.getPath(model, id));
        return response.status === 200 ? await response.json() : void 0;
    }
    /**
     * Update all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param entity Entity data to be updated.
     * @param filter Filter expression.
     * @returns Returns the number of updated entities.
     */
    async update(model, entity, filter) {
        const urlFilter = filters_1.Filters.toURL(model, filter);
        const response = await this.request('PATCH', this.getPath(model, urlFilter), entity);
        return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
    }
    /**
     * Update the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param entity Entity data to be updated.
     * @param id Entity id.s
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, entity, id) {
        const response = await this.request('PATCH', this.getPath(model, id), entity);
        return response.status === 200 || response.status === 204;
    }
    /**
     * Delete all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param filter Filter columns.
     * @return Returns the number of deleted entities.
     */
    async delete(model, filter) {
        const urlFilter = filters_1.Filters.toURL(model, filter);
        const response = await this.request('DELETE', this.getPath(model, urlFilter));
        return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
    }
    /**
     * Delete the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, id) {
        const response = await this.request('DELETE', this.getPath(model, id));
        return response.status === 200 || response.status === 204;
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
], Driver.prototype, "extraPath", void 0);
__decorate([
    Class.Private()
], Driver.prototype, "getPath", null);
__decorate([
    Class.Private()
], Driver.prototype, "request", null);
__decorate([
    Class.Public()
], Driver.prototype, "connect", null);
__decorate([
    Class.Public()
], Driver.prototype, "usePath", null);
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
    Class.Private()
], Driver, "extractArray", null);
__decorate([
    Class.Private()
], Driver, "extractObject", null);
__decorate([
    Class.Private()
], Driver, "extractValue", null);
Driver = Driver_1 = __decorate([
    Class.Describe()
], Driver);
exports.Driver = Driver;
