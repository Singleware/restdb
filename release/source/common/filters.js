"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = void 0;
/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Mapping = require("@singleware/mapping");
const Types = require("../types");
/**
 * Common driver, filters class.
 */
let Filters = class Filters extends Class.Null {
    /**
     * Packs the specified list of viewed fields into a parameterized array of viewed fields.
     * @param fields Viewed fields.
     * @returns Returns the parameterized array of viewed fields.
     */
    static packViewedFields(fields) {
        return [this.FieldsPrefix, fields.length, ...new Set(fields).values()];
    }
    /**
     * Unpacks the parameterized array of viewed fields into a list of viewed fields.
     * @param array Parameterized array of viewed fields.
     * @returns Returns the list of viewed fields or undefined when there no viewed fields.
     * @throws Throws an error when there are invalid serialized data.
     */
    static unpackViewedFields(array) {
        if (this.FieldsPrefix !== array.pop()) {
            throw new Error(`Invalid magic prefix for the given array of viewed fields.`);
        }
        else {
            const length = parseInt(array.pop());
            if (array.length < length) {
                throw new Error(`Invalid size for the given array of viewed fields.`);
            }
            else {
                const fields = [];
                for (let i = 0; i < length; ++i) {
                    fields.push(array.pop());
                }
                return fields;
            }
        }
    }
    /**
     * Pack a new operation in the given operations list based on the specified path, operator and value.
     * @param operations Operations list.
     * @param path Operation path.
     * @param operator Operator type.
     * @param value Operation value.
     */
    static packOperation(operations, path, operator, value) {
        operations.push(path, operator);
        switch (operator) {
            case "lt" /* LessThan */:
            case "lte" /* LessThanOrEqual */:
            case "eq" /* Equal */:
            case "ne" /* NotEqual */:
            case "gte" /* GreaterThanOrEqual */:
            case "gt" /* GreaterThan */:
                operations.push(encodeURIComponent(value));
                break;
            case "bt" /* Between */:
            case "in" /* Contain */:
            case "nin" /* NotContain */:
                if (!(value instanceof Array)) {
                    throw new Error(`Match value for the given path '${path}' should be an Array object.`);
                }
                operations.push(value.length, ...value.map(item => encodeURIComponent(item)));
                break;
            case "re" /* RegExp */:
                if (!(value instanceof RegExp)) {
                    throw new Error(`Match value for the given path '${path}' should be a RegExp object.`);
                }
                operations.push(encodeURIComponent(value.source));
                operations.push(encodeURIComponent(value.flags));
                break;
            default:
                throw new TypeError(`Invalid operator '${operator}' for the given path '${path}'.`);
        }
    }
    /**
     * Packs the specified matching rules into a parameterized array of matching rules.
     * @param model Model type.
     * @param match Matching rules.
     * @returns Returns the parameterized array of matching rules.
     * @throws Throws an error when there are invalid matching operator codes.
     */
    static packMatchRules(prefix, model, match) {
        const rulesList = [];
        let rulesCounter = 0;
        for (const expression of match instanceof Array ? match : [match]) {
            const operationsList = [];
            let operationsCounter = 0;
            for (const path in expression) {
                if (!Mapping.Helper.tryPathColumns(model, path)) {
                    throw new Error(`Invalid matching path '${path}' for the given model.`);
                }
                else {
                    operationsCounter++;
                    const operation = expression[path];
                    if (Mapping.Filters.Helper.isOperation(operation)) {
                        this.packOperation(operationsList, path, operation.operator, operation.value);
                    }
                    else {
                        const entry = Object.entries(operation)[0];
                        this.packOperation(operationsList, path, entry[0], entry[1]);
                    }
                }
            }
            if (operationsCounter > 0) {
                rulesList.push(operationsCounter, ...operationsList);
                rulesCounter++;
            }
        }
        return [prefix, rulesCounter, ...rulesList];
    }
    /**
     * Unpacks the parameterized array of matching rules into the matching rules.
     * @param model Model type.
     * @param array Parameterized array of matching rules.
     * @returns Returns the generated matching rules or undefined when there's no rules.
     * @throws Throws an error when there are invalid serialized data.
     */
    static unpackMatchRules(prefix, model, array) {
        if (prefix !== array.pop()) {
            throw new Error(`Invalid magic prefix for the given array of matching lists.`);
        }
        else {
            const rulesList = [];
            for (let rulesCounter = parseInt(array.pop()); rulesCounter > 0; --rulesCounter) {
                const operationsMap = {};
                for (let operationsCounter = parseInt(array.pop()); operationsCounter > 0; --operationsCounter) {
                    const path = array.pop();
                    if (!Mapping.Helper.tryPathColumns(model, path)) {
                        throw new Error(`Invalid matching path '${path}' for the given model.`);
                    }
                    else {
                        const operator = array.pop();
                        switch (operator) {
                            case "lt" /* LessThan */:
                            case "lte" /* LessThanOrEqual */:
                            case "eq" /* Equal */:
                            case "ne" /* NotEqual */:
                            case "gte" /* GreaterThanOrEqual */:
                            case "gt" /* GreaterThan */:
                                operationsMap[path] = {
                                    operator: operator,
                                    value: decodeURIComponent(array.pop())
                                };
                                break;
                            case "bt" /* Between */:
                            case "in" /* Contain */:
                            case "nin" /* NotContain */:
                                const values = [];
                                for (let total = parseInt(array.pop()); total > 0; --total) {
                                    values.push(decodeURIComponent(array.pop()));
                                }
                                operationsMap[path] = {
                                    operator: operator,
                                    value: values
                                };
                                break;
                            case "re" /* RegExp */:
                                const regexp = decodeURIComponent(array.pop());
                                const flags = decodeURIComponent(array.pop());
                                operationsMap[path] = {
                                    operator: operator,
                                    value: new RegExp(regexp, flags)
                                };
                                break;
                            default:
                                throw new TypeError(`Invalid operator '${operator}' for the given path '${path}'.`);
                        }
                    }
                }
                rulesList.push(operationsMap);
            }
            if (rulesList.length > 0) {
                return rulesList.length === 1 ? rulesList[0] : rulesList;
            }
            return void 0;
        }
    }
    /**
     * Packs the specified sorting fields into a parameterized array of sorting fields.
     * @param model Model type.
     * @param sort Sorting fields.
     * @returns Returns the parameterized array of sorting fields.
     */
    static packSort(model, sort) {
        const fields = [];
        for (const path in sort) {
            if (!Mapping.Helper.tryPathColumns(model, path)) {
                throw new Error(`Invalid sorting path '${path}' for the given model.`);
            }
            fields.push(path, sort[path]);
        }
        return [this.SortPrefix, fields.length / 2, ...fields];
    }
    /**
     * Unpacks the parameterized array of sorting fields into the sorting fields.
     * @param model Model type.
     * @param array Parameterized array of sorting fields.
     * @returns Returns the generated sorting fields.
     * @throws Throws an error when there are invalid serialized data.
     */
    static unpackSort(model, array) {
        if (this.SortPrefix !== array.pop()) {
            throw new Error(`Invalid magic prefix for the given array of sorting list.`);
        }
        else {
            const fields = {};
            for (let length = parseInt(array.pop()); length > 0; --length) {
                const path = array.pop();
                const order = array.pop();
                if (!Mapping.Helper.tryPathColumns(model, path)) {
                    throw new Error(`Invalid sorting path '${path}' for the given model.`);
                }
                else {
                    switch (order) {
                        case "asc" /* Ascending */:
                        case "desc" /* Descending */:
                            fields[path] = order;
                            break;
                        default:
                            throw new Error(`Invalid sorting order ${order} for the given path '${path}'..`);
                    }
                }
            }
            return fields;
        }
    }
    /**
     * Packs the specified limit entity into a parameterized array of limits.
     * @param limit Limit entity.
     * @returns Returns the parameterized array of limits.
     */
    static packLimit(limit) {
        return [this.LimitPrefix, limit.start || 0, limit.count || 0];
    }
    /**
     * Unpacks the parameterized array of limits into the limit entity.
     * @param array Parameterized array of limits.
     * @returns Returns the generated limit entity.
     * @throws Throws an error when there are invalid serialized data.
     */
    static unpackLimit(array) {
        if (this.LimitPrefix !== array.pop()) {
            throw new Error(`Invalid magic prefix for the given array of limits.`);
        }
        else {
            return {
                start: parseInt(array.pop()) || 0,
                count: parseInt(array.pop()) || 0
            };
        }
    }
    /**
     * Build a query string URL from the specified entity model, viewed fields and query filter.
     * @param model Model type.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the generated query string URL.
     */
    static toURL(model, query, fields) {
        const queries = [];
        if (fields && fields.length > 0) {
            queries.push(...this.packViewedFields(fields));
        }
        if (query) {
            if (query.pre) {
                queries.push(...this.packMatchRules(this.PreMatchPrefix, model, query.pre));
            }
            if (query.post) {
                queries.push(...this.packMatchRules(this.PostMatchPrefix, model, query.post));
            }
            if (query.sort) {
                queries.push(...this.packSort(model, query.sort));
            }
            if (query.limit) {
                queries.push(...this.packLimit(query.limit));
            }
        }
        return queries.length ? `${this.QueryPrefix}/${queries.join('/')}` : ``;
    }
    /**
     * Builds a query entity from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query entity.
     * @throws Throws an error when there are unsupported data serialization in the specified URL.
     */
    static fromURL(model, url) {
        const result = { fields: [] };
        const parts = url.split('/').reverse();
        if (parts.pop() === this.QueryPrefix) {
            while (parts.length) {
                const prefix = parts[parts.length - 1];
                switch (prefix) {
                    case this.PreMatchPrefix:
                        result.pre = this.unpackMatchRules(this.PreMatchPrefix, model, parts);
                        break;
                    case this.PostMatchPrefix:
                        result.post = this.unpackMatchRules(this.PostMatchPrefix, model, parts);
                        break;
                    case this.SortPrefix:
                        result.sort = this.unpackSort(model, parts);
                        break;
                    case this.LimitPrefix:
                        result.limit = this.unpackLimit(parts);
                        break;
                    case this.FieldsPrefix:
                        result.fields = this.unpackViewedFields(parts);
                        break;
                    default:
                        throw new Error(`Unsupported data serialization type.`);
                }
            }
        }
        return result;
    }
};
/**
 * Magic query prefix.
 */
Filters.QueryPrefix = 'query';
/**
 * Magic fields prefix.
 */
Filters.FieldsPrefix = 'fields';
/**
 * Magic pre-match prefix.
 */
Filters.PreMatchPrefix = 'pre';
/**
 * Magic post-match prefix.
 */
Filters.PostMatchPrefix = 'post';
/**
 * Magic sort prefix.
 */
Filters.SortPrefix = 'sort';
/**
 * Magic limit prefix.
 */
Filters.LimitPrefix = 'limit';
__decorate([
    Class.Private()
], Filters, "QueryPrefix", void 0);
__decorate([
    Class.Private()
], Filters, "FieldsPrefix", void 0);
__decorate([
    Class.Private()
], Filters, "PreMatchPrefix", void 0);
__decorate([
    Class.Private()
], Filters, "PostMatchPrefix", void 0);
__decorate([
    Class.Private()
], Filters, "SortPrefix", void 0);
__decorate([
    Class.Private()
], Filters, "LimitPrefix", void 0);
__decorate([
    Class.Private()
], Filters, "packViewedFields", null);
__decorate([
    Class.Private()
], Filters, "unpackViewedFields", null);
__decorate([
    Class.Private()
], Filters, "packOperation", null);
__decorate([
    Class.Private()
], Filters, "packMatchRules", null);
__decorate([
    Class.Private()
], Filters, "unpackMatchRules", null);
__decorate([
    Class.Private()
], Filters, "packSort", null);
__decorate([
    Class.Private()
], Filters, "unpackSort", null);
__decorate([
    Class.Private()
], Filters, "packLimit", null);
__decorate([
    Class.Private()
], Filters, "unpackLimit", null);
__decorate([
    Class.Public()
], Filters, "toURL", null);
__decorate([
    Class.Public()
], Filters, "fromURL", null);
Filters = __decorate([
    Class.Describe()
], Filters);
exports.Filters = Filters;
//# sourceMappingURL=filters.js.map