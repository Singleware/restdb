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
     * Packs the specified view modes into the given query list.
     * @param queries Query list.
     * @param views View modes.
     */
    static packViews(queries, views) {
        const list = views.filter(view => view !== Mapping.Types.View.ALL);
        if (list.length > 0) {
            queries.push(`${this.ViewsPrefix}/${list.join(';')}`);
        }
    }
    /**
     * Unpacks the specified view modes string into a new view modes list.
     * @param views View modes string.
     * @returns Returns the generated list of view modes.
     */
    static unpackViews(views) {
        return views.split(';');
    }
    /**
     * Packs the specified match rule entity according to the specified fields and model type.
     * @param model Model type.
     * @param match Matching fields.
     * @returns Returns the match rule string.
     */
    static packMatchRule(model, match) {
        let matches = [];
        for (const name in match) {
            const schema = Mapping.Schema.getRealColumn(model, name);
            const operation = match[name];
            const expression = `${schema.name}:${operation.operator}`;
            switch (operation.operator) {
                case Mapping.Statements.Operator.REGEX:
                case Mapping.Statements.Operator.LESS:
                case Mapping.Statements.Operator.LESS_OR_EQUAL:
                case Mapping.Statements.Operator.EQUAL:
                case Mapping.Statements.Operator.NOT_EQUAL:
                case Mapping.Statements.Operator.GREATER_OR_EQUAL:
                case Mapping.Statements.Operator.GREATER:
                    matches.push(`${expression}:${encodeURIComponent(operation.value)}`);
                    break;
                case Mapping.Statements.Operator.BETWEEN:
                case Mapping.Statements.Operator.CONTAIN:
                case Mapping.Statements.Operator.NOT_CONTAIN:
                    matches.push(`${expression}:${[...operation.value].map(item => encodeURIComponent(item)).join(',')}`);
                    break;
            }
        }
        return matches.join(';');
    }
    /**
     * Unpacks the specified match rule string according to the specified model type.
     * @param model Model type.
     * @param match Match string.
     * @returns Returns the generated match entity.
     * @throws @throws Throws an error when there are unsupported orders in the match string.
     */
    static unpackMatchRule(model, match) {
        const newer = {};
        const fields = match.split(';');
        for (const field of fields) {
            const [name, operator, value] = field.split(':', 3);
            const code = parseInt(operator);
            const schema = Mapping.Schema.getRealColumn(model, name);
            switch (code) {
                case Mapping.Statements.Operator.REGEX:
                case Mapping.Statements.Operator.LESS:
                case Mapping.Statements.Operator.LESS_OR_EQUAL:
                case Mapping.Statements.Operator.EQUAL:
                case Mapping.Statements.Operator.NOT_EQUAL:
                case Mapping.Statements.Operator.GREATER_OR_EQUAL:
                case Mapping.Statements.Operator.GREATER:
                    newer[schema.name] = { operator: code, value: decodeURIComponent(value) };
                    break;
                case Mapping.Statements.Operator.BETWEEN:
                case Mapping.Statements.Operator.CONTAIN:
                case Mapping.Statements.Operator.NOT_CONTAIN:
                    newer[schema.name] = { operator: code, value: value.split(',').map(value => decodeURIComponent(value)) };
                    break;
                default:
                    throw new Error(`Match operator code '${code}' doesn't supported.`);
            }
        }
        return newer;
    }
    /**
     * Packs the specified pre-match into the query list according to the given model type.
     * @param model Model type.
     * @param queries Query list.
     * @param match Matching fields.
     */
    static packPreMatch(model, queries, match) {
        const matches = (match instanceof Array ? match : [match]).map((match) => this.packMatchRule(model, match));
        if (matches.length) {
            queries.push(`${this.PreMatchPrefix}/${matches.join('|')}`);
        }
    }
    /**
     * Packs the specified post-match into the query list according to the given model type.
     * @param model Model type.
     * @param queries Query list.
     * @param match Matching fields.
     */
    static packPostMatch(model, queries, match) {
        const matches = (match instanceof Array ? match : [match]).map((match) => this.packMatchRule(model, match));
        if (matches.length) {
            queries.push(`${this.PostMatchPrefix}/${matches.join('|')}`);
        }
    }
    /**
     * Unpacks the specified match string according to the specified model type.
     * @param model Model type.
     * @param match Match string.
     * @returns Returns a single generated match entity or the generated match entity list.
     */
    static unpackMatch(model, match) {
        const newer = [];
        const matches = match.split('|');
        for (const match of matches) {
            newer.push(this.unpackMatchRule(model, match));
        }
        if (newer.length === 1) {
            return newer[0];
        }
        else {
            return newer;
        }
    }
    /**
     * Packs the specified sort entity according to the specified model type.
     * @param model Model type.
     * @param queries Query list.
     * @param sort Sorting order.
     */
    static packSort(model, queries, sort) {
        let parts = [];
        for (const name in sort) {
            const schema = Mapping.Schema.getRealColumn(model, name);
            parts.push(`${schema.name}:${sort[name]}`);
        }
        if (parts.length) {
            queries.push(`${this.SortPrefix}/${parts.join(';')}`);
        }
    }
    /**
     * Unpacks the specified sort string according to the specified model type.
     * @param model Model type.
     * @param sort Sort string.
     * @returns Returns the generated sort entity.
     * @throws Throws an error when there are unsupported orders in the specified sort string.
     */
    static unpackSort(model, sort) {
        const newer = {};
        const fields = sort.split(';');
        for (const field of fields) {
            const [name, order] = field.split(':', 2);
            const code = parseInt(order);
            const schema = Mapping.Schema.getRealColumn(model, name);
            switch (code) {
                case Mapping.Statements.Order.ASCENDING:
                case Mapping.Statements.Order.DESCENDING:
                    newer[schema.name] = code;
                    break;
                default:
                    throw new Error(`Sorting order code '${code}' doesn't supported.`);
            }
        }
        return newer;
    }
    /**
     * Packs the specified limit entity.
     * @param queries Query list.
     * @param limit Limit entity.
     */
    static packLimit(queries, limit) {
        queries.push(`${this.LimitPrefix}/${limit.start || 0};${limit.count || 0}`);
    }
    /**
     * Unpacks the specified limit string.
     * @param limit Limit string.
     * @returns Returns the generated limit entity.
     */
    static unpackLimit(limit) {
        const [start, count] = limit.split(';', 2);
        return {
            start: parseInt(start),
            count: parseInt(count)
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
        if (views.length) {
            this.packViews(queries, views);
        }
        if (filter) {
            if (filter.pre) {
                this.packPreMatch(model, queries, filter.pre);
            }
            if (filter.post) {
                this.packPostMatch(model, queries, filter.post);
            }
            if (filter.sort) {
                this.packSort(model, queries, filter.sort);
            }
            if (filter.limit) {
                this.packLimit(queries, filter.limit);
            }
        }
        return queries.length ? `${this.QueryPrefix}/${queries.join('/')}` : ``;
    }
    /**
     * Builds a query entity from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query entity.
     * @throws Throws an error when there are unsupported data in the specified URL.
     */
    static fromURL(model, url) {
        const result = { views: [] };
        const parts = url.split('/').reverse();
        if (parts.pop() === this.QueryPrefix) {
            while (parts.length) {
                const data = parts.pop();
                switch (data) {
                    case this.ViewsPrefix:
                        result.views = this.unpackViews(parts.pop());
                        break;
                    case this.PreMatchPrefix:
                        result.pre = this.unpackMatch(model, parts.pop());
                        break;
                    case this.PostMatchPrefix:
                        result.post = this.unpackMatch(model, parts.pop());
                        break;
                    case this.SortPrefix:
                        result.sort = this.unpackSort(model, parts.pop());
                        break;
                    case this.LimitPrefix:
                        result.limit = this.unpackLimit(parts.pop());
                        break;
                    default:
                        throw new Error(`Serialized data type '${data}' does not supported.`);
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
Filters.ViewsPrefix = 'v';
/**
 * Magic pre-match prefix.
 */
Filters.PreMatchPrefix = 'b';
/**
 * Magic post-match prefix.
 */
Filters.PostMatchPrefix = 'a';
/**
 * Magic sort prefix.
 */
Filters.SortPrefix = 's';
/**
 * Magic limit prefix.
 */
Filters.LimitPrefix = 'l';
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
], Filters, "packViews", null);
__decorate([
    Class.Private()
], Filters, "unpackViews", null);
__decorate([
    Class.Private()
], Filters, "packMatchRule", null);
__decorate([
    Class.Private()
], Filters, "unpackMatchRule", null);
__decorate([
    Class.Private()
], Filters, "packPreMatch", null);
__decorate([
    Class.Private()
], Filters, "packPostMatch", null);
__decorate([
    Class.Private()
], Filters, "unpackMatch", null);
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
