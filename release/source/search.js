"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Search_1;
"use strict";
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Mapping = require("@singleware/mapping");
/**
 * Search helper class.
 */
let Search = Search_1 = class Search extends Class.Null {
    /**
     * Serializes the specified filter object according to the specified data model.
     * @param model Model type.
     * @param filter Filter statement.
     * @returns Returns a string that represents the serialized filter.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    static serializeFilter(model, filter) {
        let parts = [];
        for (const name in filter) {
            const schema = Mapping.Schema.getRealColumn(model, name);
            if (!schema) {
                throw new Error(`Column '${name}' does not exists.`);
            }
            const operation = filter[name];
            const expression = `${schema.name}:${operation.operator}`;
            switch (operation.operator) {
                case Mapping.Statements.Operator.REGEX:
                case Mapping.Statements.Operator.LESS:
                case Mapping.Statements.Operator.LESS_OR_EQUAL:
                case Mapping.Statements.Operator.EQUAL:
                case Mapping.Statements.Operator.NOT_EQUAL:
                case Mapping.Statements.Operator.GREATER_OR_EQUAL:
                case Mapping.Statements.Operator.GREATER:
                    parts.push(`${expression}:${encodeURIComponent(operation.value)}`);
                    break;
                case Mapping.Statements.Operator.BETWEEN:
                case Mapping.Statements.Operator.CONTAIN:
                case Mapping.Statements.Operator.NOT_CONTAIN:
                    parts.push(`${expression}:${[...operation.value].map(item => encodeURIComponent(item)).join(',')}`);
                    break;
            }
        }
        return parts.length ? `${Search_1.FilterPrefix}/${parts.join(';')}` : ``;
    }
    /**
     * Unserializes the specified filter string according to the specified data model.
     * @param model Model type.
     * @param filter Filter string.
     * @returns Returns the generated filter object.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    static unserializeFilter(model, filter) {
        const newer = {};
        const fields = filter.split(';');
        for (const field of fields) {
            const [name, operator, value] = field.split(':', 3);
            if (!Mapping.Schema.getRealColumn(model, name)) {
                throw new Error(`Column '${name}' does not exists.`);
            }
            const code = parseInt(operator);
            switch (code) {
                case Mapping.Statements.Operator.REGEX:
                case Mapping.Statements.Operator.LESS:
                case Mapping.Statements.Operator.LESS_OR_EQUAL:
                case Mapping.Statements.Operator.EQUAL:
                case Mapping.Statements.Operator.NOT_EQUAL:
                case Mapping.Statements.Operator.GREATER_OR_EQUAL:
                case Mapping.Statements.Operator.GREATER:
                    newer[name] = { operator: code, value: decodeURIComponent(value) };
                    break;
                case Mapping.Statements.Operator.BETWEEN:
                case Mapping.Statements.Operator.CONTAIN:
                case Mapping.Statements.Operator.NOT_CONTAIN:
                    newer[name] = { operator: code, value: value.split(':').map(value => decodeURIComponent(value)) };
                    break;
                default:
                    throw new Error(`Unsupported filter operator code "${code}"`);
            }
        }
        return newer;
    }
    /**
     * Serializes the specified sort object according to the specified data model.
     * @param model Model type.
     * @param sort Sorting order.
     * @returns Returns a string that represent the serialized sorting order.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    static serializeSort(model, sort) {
        let parts = [];
        for (const name in sort) {
            const schema = Mapping.Schema.getRealColumn(model, name);
            if (!schema) {
                throw new Error(`Column '${name}' does not exists.`);
            }
            parts.push(`${schema.name}:${sort[name]}`);
        }
        return parts.length ? `${Search_1.SortPrefix}/${parts.join(';')}` : ``;
    }
    /**
     * Unserializes the specified sort string according to the specified data model.
     * @param model Model type.
     * @param sort Sort string.
     * @returns Returns the generated sort object.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    static unserializeSort(model, sort) {
        const newer = {};
        const fields = sort.split(';');
        for (const field of fields) {
            const [name, order] = field.split(':', 2);
            if (!Mapping.Schema.getRealColumn(model, name)) {
                throw new Error(`Column '${name}' does not exists.`);
            }
            const code = parseInt(order);
            switch (code) {
                case Mapping.Statements.Order.ASCENDING:
                case Mapping.Statements.Order.DESCENDING:
                    newer[name] = code;
                    break;
                default:
                    throw new Error(`Unsupported sorting order code "${code}"`);
            }
        }
        return newer;
    }
    /**
     * Serializes the specified limit object.
     * @param limit Limit object.
     * @returns Returns a string that represents the specified limit object.
     */
    static serializeLimit(limit) {
        return `${Search_1.LimitPrefix}/${limit.start || 0};${limit.count || 0}`;
    }
    /**
     * Unserializes the specified limit string.
     * @param limit Limit string.
     * @returns Returns the generated limit object.
     */
    static unserializeLimit(limit) {
        const [start, count] = limit.split(';', 2);
        return {
            start: parseInt(start),
            count: parseInt(count)
        };
    }
    /**
     * Build a query URL from the specified parameters.
     * @param model Model type.
     * @param filters List of filters.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns the generated URL path filter.
     * @throws Throws an error when there is a nonexistent column in the specified filter.
     */
    static toURL(model, filters, sort, limit) {
        let statements = [];
        for (const filter of filters) {
            statements.push(Search_1.serializeFilter(model, filter));
        }
        if (sort) {
            statements.push(Search_1.serializeSort(model, sort));
        }
        if (limit) {
            statements.push(Search_1.serializeLimit(limit));
        }
        return statements.length ? `/${this.QueryPrefix}/${statements.join('/')}` : ``;
    }
    /**
     * Builds a query object from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query object.
     * @throws Throws an error when there is a nonexistent column or unsupported data in the specified URL.
     */
    static fromURL(model, url) {
        const result = { filters: [], sort: void 0, limit: void 0 };
        const parts = url.split('/').reverse();
        if (parts.pop() === this.QueryPrefix) {
            while (parts.length) {
                const data = parts.pop();
                switch (data) {
                    case this.FilterPrefix:
                        result.filters.push(Search_1.unserializeFilter(model, parts.pop() || ''));
                        break;
                    case this.SortPrefix:
                        result.sort = Search_1.unserializeSort(model, parts.pop() || '');
                        break;
                    case this.LimitPrefix:
                        result.limit = Search_1.unserializeLimit(parts.pop() || '');
                        break;
                    default:
                        throw new Error(`Unsupported serialized data type "${data}"`);
                }
            }
        }
        return result;
    }
};
/**
 * Magic query prefix.
 */
Search.QueryPrefix = 'query';
/**
 * Magic filter prefix.
 */
Search.FilterPrefix = 'f';
/**
 * Magic sort prefix.
 */
Search.SortPrefix = 's';
/**
 * Magic limit prefix.
 */
Search.LimitPrefix = 'l';
__decorate([
    Class.Private()
], Search, "QueryPrefix", void 0);
__decorate([
    Class.Private()
], Search, "FilterPrefix", void 0);
__decorate([
    Class.Private()
], Search, "SortPrefix", void 0);
__decorate([
    Class.Private()
], Search, "LimitPrefix", void 0);
__decorate([
    Class.Private()
], Search, "serializeFilter", null);
__decorate([
    Class.Private()
], Search, "unserializeFilter", null);
__decorate([
    Class.Private()
], Search, "serializeSort", null);
__decorate([
    Class.Private()
], Search, "unserializeSort", null);
__decorate([
    Class.Private()
], Search, "serializeLimit", null);
__decorate([
    Class.Private()
], Search, "unserializeLimit", null);
__decorate([
    Class.Public()
], Search, "toURL", null);
__decorate([
    Class.Public()
], Search, "fromURL", null);
Search = Search_1 = __decorate([
    Class.Describe()
], Search);
exports.Search = Search;
