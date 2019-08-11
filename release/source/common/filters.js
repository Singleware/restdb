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
const Aliases = require("../aliases");
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
        return [this.FieldsPrefix, fields.length, ...fields];
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
        const length = parseInt(array.pop());
        if (array.length < length) {
            throw new Error(`Invalid size for the given array of viewed fields.`);
        }
        const fields = [];
        for (let i = 0; i < length; ++i) {
            fields.push(array.pop());
        }
        return fields;
    }
    /**
     * Packs the specified matching rules into a parameterized array of matching rules.
     * @param model Model type.
     * @param match Matching rules.
     * @returns Returns the parameterized array of matching rules.
     * @throws Throws an error when there are invalid matching operator codes.
     */
    static packMatchRules(prefix, model, match) {
        const rules = [];
        let total = 0;
        for (const fields of match instanceof Array ? match : [match]) {
            const expression = [];
            let length = 0;
            for (const name in fields) {
                const schema = Aliases.Schema.getRealColumn(model, name);
                const operation = fields[name];
                expression.push(schema.name, operation.operator);
                length++;
                switch (operation.operator) {
                    case Aliases.Operator.LessThan:
                    case Aliases.Operator.LessThanOrEqual:
                    case Aliases.Operator.Equal:
                    case Aliases.Operator.NotEqual:
                    case Aliases.Operator.GreaterThanOrEqual:
                    case Aliases.Operator.GreaterThan:
                        expression.push(encodeURIComponent(operation.value));
                        break;
                    case Aliases.Operator.Between:
                    case Aliases.Operator.Contain:
                    case Aliases.Operator.NotContain:
                        if (!(operation.value instanceof Array)) {
                            throw new Error(`Match value for '${schema.name}' should be an Array object.`);
                        }
                        expression.push(operation.value.length, ...operation.value.map(item => encodeURIComponent(item)));
                        break;
                    case Aliases.Operator.RegExp:
                        if (!(operation.value instanceof RegExp)) {
                            throw new Error(`Match value for '${schema.name}' should be a RegExp object.`);
                        }
                        expression.push(encodeURIComponent(operation.value.source));
                        expression.push(encodeURIComponent(operation.value.flags));
                        break;
                    default:
                        throw new TypeError(`Invalid operator '${operation.operator}' for the match operation.`);
                }
            }
            if (length > 0) {
                rules.push(length, ...expression);
                total++;
            }
        }
        return [prefix, total, ...rules];
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
        const match = [];
        for (let total = parseInt(array.pop()); total > 0; --total) {
            const fields = {};
            for (let length = parseInt(array.pop()); length > 0; --length) {
                const name = array.pop();
                const operator = array.pop();
                const schema = Aliases.Schema.getRealColumn(model, name);
                switch (operator) {
                    case Aliases.Operator.LessThan:
                    case Aliases.Operator.LessThanOrEqual:
                    case Aliases.Operator.Equal:
                    case Aliases.Operator.NotEqual:
                    case Aliases.Operator.GreaterThanOrEqual:
                    case Aliases.Operator.GreaterThan:
                        fields[schema.name] = { operator: operator, value: decodeURIComponent(array.pop()) };
                        break;
                    case Aliases.Operator.Between:
                    case Aliases.Operator.Contain:
                    case Aliases.Operator.NotContain:
                        const values = [];
                        for (let i = parseInt(array.pop()); i > 0; --i) {
                            values.push(decodeURIComponent(array.pop()));
                        }
                        fields[schema.name] = { operator: operator, value: values };
                        break;
                    case Aliases.Operator.RegExp:
                        const regexp = decodeURIComponent(array.pop());
                        const flags = decodeURIComponent(array.pop());
                        fields[schema.name] = { operator: operator, value: new RegExp(regexp, flags) };
                        break;
                    default:
                        throw new TypeError(`Invalid operator code for the match operation.`);
                }
            }
            match.push(fields);
        }
        if (match.length > 0) {
            return match.length === 1 ? match[0] : match;
        }
        return void 0;
    }
    /**
     * Packs the specified sorting fields into a parameterized array of sorting fields.
     * @param model Model type.
     * @param sort Sorting fields.
     * @returns Returns the parameterized array of sorting fields.
     */
    static packSort(model, sort) {
        const fields = [];
        let length = 0;
        for (const name in sort) {
            fields.push(Aliases.Schema.getRealColumn(model, name).name, sort[name]);
            length++;
        }
        return [this.SortPrefix, length, ...fields];
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
        const fields = {};
        for (let length = parseInt(array.pop()); length > 0; --length) {
            const name = array.pop();
            const order = parseInt(array.pop());
            const schema = Aliases.Schema.getRealColumn(model, name);
            switch (order) {
                case Aliases.Order.Ascending:
                case Aliases.Order.Descending:
                    fields[schema.name] = order;
                    break;
                default:
                    throw new Error(`Invalid sorting order code.`);
            }
        }
        return fields;
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
        return {
            start: parseInt(array.pop()) || 0,
            count: parseInt(array.pop()) || 0
        };
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
                switch (parts[parts.length - 1]) {
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