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
/**
 * URL path filter class.
 */
let Filters = class Filters extends Class.Null {
    /**
     * Build a URL path filter from the specified filter expression.
     * @param model Model type.
     * @param filter Filter expression.
     * @returns Returns the generated URL path filter.
     * @throws Throws an error when there is a nonexistent column in the specified filter.
     */
    static toURL(model, filter) {
        let parts = [];
        for (const name in filter) {
            const operation = filter[name];
            const schema = Mapping.Schema.getColumn(model, name);
            if (!schema) {
                throw new Error(`Column '${name}' does not exists.`);
            }
            switch (operation.operator) {
                case Mapping.Operator.LESS:
                case Mapping.Operator.LESS_OR_EQUAL:
                case Mapping.Operator.EQUAL:
                case Mapping.Operator.NOT_EQUAL:
                case Mapping.Operator.GREATER_OR_EQUAL:
                case Mapping.Operator.GREATER:
                    parts.push(`${schema.name}/${operation.operator}/${encodeURIComponent(operation.value)}`);
                    break;
                case Mapping.Operator.BETWEEN:
                case Mapping.Operator.CONTAIN:
                case Mapping.Operator.NOT_CONTAIN:
                    parts.push(`${schema.name}/${operation.operator}/${operation.value.map(item => encodeURIComponent(item)).join(';')}`);
                    break;
            }
        }
        return parts.length ? `/${this.PREFIX}/${parts.join('/')}` : ``;
    }
    /**
     * Builds a filter expression from the specified URL path filter.
     * @param model Model type.
     * @param path Filter path.
     * @returns Returns the generated filter expression.
     * @throws Throws an error when there is a nonexistent column or unsupported operator in the specified filter.
     */
    static fromURL(model, path) {
        const filters = {};
        const parts = path.split('/').reverse();
        if (parts.pop() === this.PREFIX) {
            while (parts.length) {
                const column = parts.pop();
                const operator = parseInt(parts.pop());
                const value = parts.pop();
                if (!Mapping.Schema.getColumn(model, column)) {
                    throw new Error(`Column '${column}' does not exists.`);
                }
                switch (operator) {
                    case Mapping.Operator.LESS:
                    case Mapping.Operator.LESS_OR_EQUAL:
                    case Mapping.Operator.EQUAL:
                    case Mapping.Operator.NOT_EQUAL:
                    case Mapping.Operator.GREATER_OR_EQUAL:
                    case Mapping.Operator.GREATER:
                        filters[column] = { operator: operator, value: decodeURIComponent(value) };
                        break;
                    case Mapping.Operator.BETWEEN:
                    case Mapping.Operator.CONTAIN:
                    case Mapping.Operator.NOT_CONTAIN:
                        filters[column] = { operator: operator, value: value.split(';').map(item => decodeURIComponent(item)) };
                        break;
                    default:
                        throw new Error(`Unsupported operator "${operator}"`);
                }
            }
        }
        return filters;
    }
};
/**
 * Magic path prefix.
 */
Filters.PREFIX = 'find';
__decorate([
    Class.Private()
], Filters, "PREFIX", void 0);
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
