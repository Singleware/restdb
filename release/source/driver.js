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
const Mapping = require("@singleware/mapping");
const filters_1 = require("./filters");
/**
 * Data driver class.
 */
let Driver = class Driver {
    /**
     * Gets the path from the specified model type.
     * @param model Mode type.
     * @returns Returns the path.
     * @throws Throws an error when the model type is not valid.
     */
    getPath(model) {
        const name = Mapping.Schema.getStorage(model);
        if (!name) {
            throw new Error(`There is no path for the specified model type.`);
        }
        return name;
    }
    /**
     * Extract all columns from the given entity list into a raw object.
     * @param entities Entities list.
     * @returns Returns the new generated list.
     */
    extractArray(entities) {
        const newer = [];
        for (const entity of entities) {
            newer.push(this.extractValue(entity));
        }
        return newer;
    }
    /**
     * Extract all columns from the given entity into a raw object.
     * @param entity Entity data.
     * @returns Returns the new generated object.
     */
    extractObject(entity) {
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
    extractValue(value) {
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
            options.body = JSON.stringify(this.extractObject(body));
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
     * Insert the specified entity into the API.
     * @param model Model type.
     * @param entities Entity data list.
     * @returns Returns the list inserted entities.
     */
    async insert(model, ...entities) {
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
     * @param aggregate Joined columns.
     * @returns Returns the list of entities found.
     */
    async find(model, filter, aggregate) {
        const filters = filters_1.Filters.toURL(model, filter);
        const response = await this.request('GET', `${this.getPath(model)}${filters}`);
        return response.status === 200 ? await response.json() : [];
    }
    /**
     * Find the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id value.
     * @param aggregate Joined columns.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    async findById(model, value, aggregate) {
        const response = await this.request('GET', `${this.getPath(model)}/${value}`);
        return response.status === 200 ? await response.json() : void 0;
    }
    /**
     * Update all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param filter Filter expression.
     * @param entity Entity data to be updated.
     * @returns Returns the number of updated entities.
     */
    async update(model, filter, entity) {
        const filters = filters_1.Filters.toURL(model, filter);
        const response = await this.request('PATCH', `${this.getPath(model)}/${filters}`, entity);
        return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
    }
    /**
     * Update the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id.
     * @param entity Entity data to be updated.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    async updateById(model, value, entity) {
        const response = await this.request('PATCH', `${this.getPath(model)}/${value}`, entity);
        return response.status === 200 || response.status === 204;
    }
    /**
     * Delete all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param filter Filter columns.
     * @return Returns the number of deleted entities.
     */
    async delete(model, filter) {
        const filters = filters_1.Filters.toURL(model, filter);
        const response = await this.request('DELETE', `${this.getPath(model)}/${filters}`);
        return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
    }
    /**
     * Delete the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    async deleteById(model, value) {
        const response = await this.request('DELETE', `${this.getPath(model)}/${value}`);
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
], Driver.prototype, "getPath", null);
__decorate([
    Class.Private()
], Driver.prototype, "extractArray", null);
__decorate([
    Class.Private()
], Driver.prototype, "extractObject", null);
__decorate([
    Class.Private()
], Driver.prototype, "extractValue", null);
__decorate([
    Class.Private()
], Driver.prototype, "request", null);
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
