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
const Mapping = require("@singleware/mapping");
/**
 * Filters helper class.
 */
let Filters = class Filters extends Class.Null {
    /**
     * Packs the specified list of view modes into a parameterized array of view modes.
     * @param views View modes.
     * @returns Returns the parameterized array of view modes.
     */
    static packViewModes(views) {
        return [this.ViewsPrefix, views.length, ...views];
    }
    /**
     * Unpacks the parameterized array of view modes into a list of view modes.
     * @param array Parameterized array of view modes.
     * @returns Returns the list of view modes or undefined when there no view modes.
     * @throws Throws an error when there are invalid serialized data.
     */
    static unpackViewModes(array) {
        if (this.ViewsPrefix !== array.pop()) {
            throw new Error(`Invalid magic prefix for the given array of view modes.`);
        }
        const length = parseInt(array.pop());
        if (array.length < length) {
            throw new Error(`Invalid size for the given array of view modes.`);
        }
        const views = [];
        for (let i = 0; i < length; ++i) {
            views.push(array.pop());
        }
        return views;
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
                const schema = Mapping.Schema.getRealColumn(model, name);
                const operation = fields[name];
                expression.push(schema.name, operation.operator);
                length++;
                switch (operation.operator) {
                    case Mapping.Statements.Operator.LESS:
                    case Mapping.Statements.Operator.LESS_OR_EQUAL:
                    case Mapping.Statements.Operator.EQUAL:
                    case Mapping.Statements.Operator.NOT_EQUAL:
                    case Mapping.Statements.Operator.GREATER_OR_EQUAL:
                    case Mapping.Statements.Operator.GREATER:
                        expression.push(encodeURIComponent(operation.value));
                        break;
                    case Mapping.Statements.Operator.BETWEEN:
                    case Mapping.Statements.Operator.CONTAIN:
                    case Mapping.Statements.Operator.NOT_CONTAIN:
                        if (!(operation.value instanceof Array)) {
                            throw new Error(`Match value for '${schema.name}' should be an Array object.`);
                        }
                        const array = operation.value;
                        expression.push(array.length, ...array.map(item => encodeURIComponent(item)));
                        break;
                    case Mapping.Statements.Operator.REGEX:
                        if (!(operation.value instanceof RegExp)) {
                            throw new Error(`Match value for '${schema.name}' should be a RegExp object.`);
                        }
                        const regexp = operation.value.toString();
                        expression.push(encodeURIComponent(regexp.substr(1, regexp.length - 2)));
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
                const operator = parseInt(array.pop());
                const schema = Mapping.Schema.getRealColumn(model, name);
                switch (operator) {
                    case Mapping.Statements.Operator.LESS:
                    case Mapping.Statements.Operator.LESS_OR_EQUAL:
                    case Mapping.Statements.Operator.EQUAL:
                    case Mapping.Statements.Operator.NOT_EQUAL:
                    case Mapping.Statements.Operator.GREATER_OR_EQUAL:
                    case Mapping.Statements.Operator.GREATER:
                        fields[schema.name] = { operator: operator, value: decodeURIComponent(array.pop()) };
                        break;
                    case Mapping.Statements.Operator.BETWEEN:
                    case Mapping.Statements.Operator.CONTAIN:
                    case Mapping.Statements.Operator.NOT_CONTAIN:
                        const values = [];
                        for (let i = parseInt(array.pop()); i > 0; --i) {
                            values.push(decodeURIComponent(array.pop()));
                        }
                        fields[schema.name] = { operator: operator, value: values };
                        break;
                    case Mapping.Statements.Operator.REGEX:
                        fields[schema.name] = { operator: operator, value: new RegExp(decodeURIComponent(array.pop())) };
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
            fields.push(Mapping.Schema.getRealColumn(model, name).name, sort[name]);
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
            const schema = Mapping.Schema.getRealColumn(model, name);
            switch (order) {
                case Mapping.Statements.Order.ASCENDING:
                case Mapping.Statements.Order.DESCENDING:
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
     * Build a query string URL from the specified view modes and field filter.
     * @param model Model type.
     * @param views View modes.
     * @param filter Field filter.
     * @returns Returns the generated query string URL.
     */
    static toURL(model, views, filter) {
        const queries = [];
        if (views.length > 1 || views[0] !== Mapping.Types.View.ALL) {
            queries.push(...this.packViewModes(views));
        }
        if (filter) {
            if (filter.pre) {
                queries.push(...this.packMatchRules(this.PreMatchPrefix, model, filter.pre));
            }
            if (filter.post) {
                queries.push(...this.packMatchRules(this.PostMatchPrefix, model, filter.post));
            }
            if (filter.sort) {
                queries.push(...this.packSort(model, filter.sort));
            }
            if (filter.limit) {
                queries.push(...this.packLimit(filter.limit));
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
        const result = { views: [] };
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
                    case this.ViewsPrefix:
                        result.views = this.unpackViewModes(parts);
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
 * Magic views prefix.
 */
Filters.ViewsPrefix = 'views';
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
], Filters, "ViewsPrefix", void 0);
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
], Filters, "packViewModes", null);
__decorate([
    Class.Private()
], Filters, "unpackViewModes", null);
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
