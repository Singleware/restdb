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
const Mapping = require("@singleware/mapping");
const caster_1 = require("./caster");
/**
 * Schema helper class.
 */
let Schema = class Schema extends Mapping.Schema {
    /**
     * Decorates the specified property to be a date column.
     * @param minimum Minimum date.
     * @param maximum Maximum date.
     * @returns Returns the decorator method.
     */
    static Date(minimum, maximum) {
        return (scope, property, descriptor) => {
            super.Date(minimum, maximum)(scope, property, descriptor);
            return super.Convert(caster_1.Caster.ISODate)(scope, property, descriptor);
        };
    }
};
__decorate([
    Class.Public()
], Schema, "Date", null);
Schema = __decorate([
    Class.Describe()
], Schema);
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map